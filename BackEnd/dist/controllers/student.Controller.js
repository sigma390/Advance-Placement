"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIndividualJob = exports.getAllJobsForStudent = exports.applyForJob = exports.loginStudent = exports.registerStudent = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const schema_1 = require("../db/schema");
const uploadResume_1 = __importDefault(require("../utils/uploadResume"));
const registerStudent = async (req, res) => {
    const { name, usn, password, age, grade, resumeId } = req.body;
    try {
        // Check if student already exists
        const existingStudent = await schema_1.Student.findOne({ usn });
        if (existingStudent) {
            return res
                .status(400)
                .json({ success: false, message: 'Student already exists' });
        }
        // Hash the password
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        // Create new student
        const newStudent = new schema_1.Student({
            name,
            usn,
            password: hashedPassword,
            age,
            grade,
            resumeId,
        });
        await newStudent.save();
        // Generate JWT
        const token = jsonwebtoken_1.default.sign({ id: newStudent._id, name: newStudent.name }, process.env.JWT_SECRET || 'your_jwt_secret', // Use an environment variable for the secret
        { expiresIn: '1h' });
        // Return response with token
        return res.status(201).json({
            success: true,
            message: 'Student registered successfully',
            token,
            userId: newStudent._id,
        });
    }
    catch (err) {
        return res
            .status(500)
            .json({ success: false, message: err.message });
    }
};
exports.registerStudent = registerStudent;
const loginStudent = async (req, res) => {
    const { usn, password } = req.body;
    try {
        // Check if the student exists
        const existingStudent = await schema_1.Student.findOne({ usn });
        if (!existingStudent) {
            return res
                .status(404)
                .json({ success: false, message: 'Student does not exist' });
        }
        // Verify the password
        const isPasswordValid = await bcrypt_1.default.compare(password, existingStudent.password);
        if (!isPasswordValid) {
            return res
                .status(400)
                .json({ success: false, message: 'Invalid credentials' });
        }
        // Generate JWT
        const token = jsonwebtoken_1.default.sign({ id: existingStudent._id, name: existingStudent.name, role: 'student' }, // Add role if needed
        process.env.JWT_SECRET || 'your_jwt_secret', // Use an environment variable for the secret
        { expiresIn: '2h' });
        // Return success response with token
        return res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            userId: existingStudent._id,
        });
    }
    catch (err) {
        return res
            .status(500)
            .json({ success: false, message: err.message });
    }
};
exports.loginStudent = loginStudent;
// Job application route
const applyForJob = async (req, res) => {
    try {
        // Extract JWT from the Authorization header
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }
        // Verify JWT and get student ID
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
        const studentId = decoded.id;
        const studentName = decoded.name;
        // Find the student
        const student = await schema_1.Student.findById(studentId);
        if (!student) {
            return res
                .status(404)
                .json({ success: false, message: 'Student not found' });
        }
        // Resume file handling
        uploadResume_1.default.single('resume')(req, res, async (err) => {
            if (err) {
                return res.status(400).json({ success: false, message: err.message });
            }
            // Access `jobId` after multer processes the request
            const { jobId } = req.body;
            console.log('Request body:', req.body); // Log to check if `jobId` exists
            console.log('Job ID:', jobId);
            // Find the job
            const recruiter = await schema_1.Recruiter.findOne({ 'jobs._id': jobId });
            if (!recruiter) {
                return res
                    .status(404)
                    .json({ success: false, message: 'Job not found' });
            }
            const job = recruiter.jobs.id(jobId);
            // Check if the job has reached its maxApplications
            if (job.applicants.length >= job.maxApplications) {
                return res.status(400).json({
                    success: false,
                    message: 'Maximum applications reached for this job',
                });
            }
            const resumePath = req.file?.path;
            // Check if the student already applied
            const alreadyApplied = job.applicants.some((applicant) => applicant.studentId.toString() === studentId);
            if (alreadyApplied) {
                return res.status(400).json({
                    success: false,
                    message: 'You have already applied for this job',
                });
            }
            // Add the application to the job
            job.applicants.push({
                studentId,
                studentName,
                resume: resumePath,
            });
            // Save the updated recruiter document
            await recruiter.save();
            return res.status(201).json({
                success: true,
                message: 'Application submitted successfully',
            });
        });
    }
    catch (err) {
        return res
            .status(500)
            .json({ success: false, message: err.message });
    }
};
exports.applyForJob = applyForJob;
const getAllJobsForStudent = async (req, res) => {
    try {
        // Fetch all recruiters along with their jobs
        const recruiters = await schema_1.Recruiter.find({}, 'name jobs'); // Fetch only the 'name' and 'jobs' fields
        if (!recruiters || recruiters.length === 0) {
            return res
                .status(404)
                .json({ success: false, message: 'No jobs found.' });
        }
        // Collect all jobs and include recruiter (company) name
        const allJobs = recruiters.flatMap((recruiter) => recruiter.jobs.map((job) => ({
            ...job.toObject(), // Convert job to plain JavaScript object
            companyName: recruiter.name, // Add the recruiter's name as the company name
        })));
        return res.status(200).json({
            success: true,
            message: 'Jobs retrieved successfully.',
            jobs: allJobs,
        });
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: 'Error fetching jobs.',
            error: err.message,
        });
    }
};
exports.getAllJobsForStudent = getAllJobsForStudent;
const getIndividualJob = async (req, res) => {
    try {
        const { jobId } = req.params;
        // Find a recruiter that has the job matching the jobId
        const recruiter = await schema_1.Recruiter.findOne({ 'jobs._id': jobId }, { 'jobs.$': 1 });
        if (!recruiter || recruiter.jobs.length === 0) {
            return res
                .status(404)
                .json({ success: false, message: 'Job not found.' });
        }
        // Return the individual job
        const job = recruiter.jobs[0];
        res.status(200).json({ success: true, job });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getIndividualJob = getIndividualJob;

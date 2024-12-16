import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Recruiter, Student } from '../db/schema';
import upload from '../utils/uploadResume';

export const registerStudent = async (req: any, res: any) => {
  const { name, usn, password, age, grade, resumeId } = req.body;

  try {
    // Check if student already exists
    const existingStudent = await Student.findOne({ usn });
    if (existingStudent) {
      return res
        .status(400)
        .json({ success: false, message: 'Student already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new student
    const newStudent = new Student({
      name,
      usn,
      password: hashedPassword,
      age,
      grade,
      resumeId,
    });

    await newStudent.save();

    // Generate JWT
    const token = jwt.sign(
      { id: newStudent._id, name: newStudent.name },
      process.env.JWT_SECRET || 'your_jwt_secret', // Use an environment variable for the secret
      { expiresIn: '1h' }
    );

    // Return response with token
    return res.status(201).json({
      success: true,
      message: 'Student registered successfully',
      token,
      userId: newStudent._id,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: (err as Error).message });
  }
};

export const loginStudent = async (req: any, res: any) => {
  const { usn, password } = req.body;

  try {
    // Check if the student exists
    const existingStudent = await Student.findOne({ usn });
    if (!existingStudent) {
      return res
        .status(404)
        .json({ success: false, message: 'Student does not exist' });
    }

    // Verify the password
    const isPasswordValid = await bcrypt.compare(
      password,
      existingStudent.password
    );
    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: existingStudent._id, name: existingStudent.name, role: 'student' }, // Add role if needed
      process.env.JWT_SECRET || 'your_jwt_secret', // Use an environment variable for the secret
      { expiresIn: '2h' }
    );

    // Return success response with token
    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      userId: existingStudent._id,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: (err as Error).message });
  }
};

// Job application route
export const applyForJob = async (req: any, res: any) => {
  try {
    // Extract JWT from the Authorization header
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    // Verify JWT and get student ID
    const decoded: any = jwt.verify(
      token,
      process.env.JWT_SECRET || 'your_jwt_secret'
    );
    const studentId = decoded.id;
    const studentName = decoded.name;

    // Find the student
    const student = await Student.findById(studentId);
    if (!student) {
      return res
        .status(404)
        .json({ success: false, message: 'Student not found' });
    }

    // Resume file handling
    upload.single('resume')(req, res, async (err: any) => {
      if (err) {
        return res.status(400).json({ success: false, message: err.message });
      }

      // Access `jobId` after multer processes the request
      const { jobId } = req.body;
      console.log('Request body:', req.body); // Log to check if `jobId` exists
      console.log('Job ID:', jobId);

      // Find the job
      const recruiter = await Recruiter.findOne({ 'jobs._id': jobId });
      if (!recruiter) {
        return res
          .status(404)
          .json({ success: false, message: 'Job not found' });
      }

      const job = recruiter.jobs.id(jobId);

      // Check if the job has reached its maxApplications
      if (job!.applicants.length >= job!.maxApplications) {
        return res.status(400).json({
          success: false,
          message: 'Maximum applications reached for this job',
        });
      }

      const resumePath = req.file?.path;

      // Check if the student already applied
      const alreadyApplied = job!.applicants.some(
        (applicant: any) => applicant.studentId.toString() === studentId
      );
      if (alreadyApplied) {
        return res.status(400).json({
          success: false,
          message: 'You have already applied for this job',
        });
      }

      // Add the application to the job
      job!.applicants.push({
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
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: (err as Error).message });
  }
};

export const getAllJobsForStudent = async (req: any, res: any) => {
  try {
    // Fetch all recruiters along with their jobs
    const recruiters = await Recruiter.find({}, 'name jobs'); // Fetch only the 'name' and 'jobs' fields

    if (!recruiters || recruiters.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: 'No jobs found.' });
    }

    // Collect all jobs and include recruiter (company) name
    const allJobs = recruiters.flatMap((recruiter) =>
      recruiter.jobs.map((job) => ({
        ...job.toObject(), // Convert job to plain JavaScript object
        companyName: recruiter.name, // Add the recruiter's name as the company name
      }))
    );

    return res.status(200).json({
      success: true,
      message: 'Jobs retrieved successfully.',
      jobs: allJobs,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Error fetching jobs.',
      error: (err as Error).message,
    });
  }
};

export const getIndividualJob = async (req: any, res: any) => {
  try {
    const { jobId } = req.params;

    // Find a recruiter that has the job matching the jobId
    const recruiter = await Recruiter.findOne(
      { 'jobs._id': jobId },
      { 'jobs.$': 1 }
    );

    if (!recruiter || recruiter.jobs.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: 'Job not found.' });
    }

    // Return the individual job
    const job = recruiter.jobs[0];
    res.status(200).json({ success: true, job });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

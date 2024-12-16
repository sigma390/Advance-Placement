import bcrypt from 'bcrypt';
import fs from 'fs';

import path from 'path';
import pdfParse from 'pdf-parse';
import { techKeywordList } from '../data/ndata';
import { Recruiter, Student } from '../db/schema';

import jwt from 'jsonwebtoken';

export const registerRecruiter = async (req: any, res: any) => {
  const { email, name, password } = req.body;

  try {
    // Check if recruiter already exists
    const existingRecruiter = await Recruiter.findOne({ email });
    if (existingRecruiter) {
      return res.status(400).json({
        success: false,
        message: 'Recruiter with this email already exists',
      });
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create a new recruiter
    const newRecruiter = new Recruiter({
      email,
      name,
      password: hashedPassword,
    });
    await newRecruiter.save();

    // Generate JWT token
    const token = jwt.sign(
      { id: newRecruiter._id, role: 'Recruiter' },
      process.env.JWT_SECRET as string, // Ensure JWT_SECRET is set in your .env file
      { expiresIn: '1d' }
    );

    return res.status(201).json({
      success: true,
      message: 'Recruiter registered successfully',
      token,
      userId: newRecruiter._id,
    });
  } catch (err) {
    return res
      .status(400)
      .json({ success: false, message: (err as Error).message });
  }
};

export const loginRecruiter = async (req: any, res: any) => {
  const { email, password } = req.body;

  try {
    // Check if the recruiter exists
    const recruiter = await Recruiter.findOne({ email });
    if (!recruiter) {
      return res.status(404).json({
        success: false,
        message: 'Recruiter with this email does not exist',
      });
    }

    // Compare the provided password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, recruiter.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid password',
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: recruiter._id, role: 'Recruiter' },
      process.env.JWT_SECRET || 'your_jwt_secret', // Replace with your .env secret
      { expiresIn: '1d' }
    );

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      userId: recruiter._id,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: (err as Error).message });
  }
};

export const createJobPost = async (req: any, res: any) => {
  const { title, description, maxApplications } = req.body;

  try {
    //authenticate the Recruiter from jwt
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);
    const recruiterId = decoded.id;
    //find if recruiter is there
    const recruiter = await Recruiter.findById(recruiterId);
    if (!recruiter) {
      return res
        .status(404)
        .jsob({ success: false, message: 'Recruiter Not Found!!!' });
    }
    //create A Job

    const newJob = {
      title,
      description,
      maxApplications: maxApplications || 100, // Default to 100 if not provided
    };

    // Add the job to the recruiter's jobs array
    recruiter.jobs.push(newJob);
    // Save the updated recruiter document
    await recruiter.save();
    //return Response
    return res.status(201).json({
      success: true,
      message: 'Job created successfully',
      job: newJob,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: (err as Error).message });
  }
};

export const getJobsRec = async (req: any, res: any) => {
  try {
    // Extract the token from the Authorization header
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    // Decode and verify the token
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);
    const recruiterId = decoded.id;

    // Find the recruiter by ID
    const recruiter = await Recruiter.findById(recruiterId);
    if (!recruiter) {
      return res
        .status(404)
        .json({ success: false, message: 'Recruiter not found.' });
    }

    // Return the jobs posted by the recruiter
    return res.status(200).json({
      success: true,
      jobs: recruiter.jobs,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Error fetching jobs.',
      error: (err as Error).message,
    });
  }
};

// Helper function to extract keywords from text
const extractKeywords = (text: string, keywordList: string[]): string[] => {
  const words = text.toLowerCase().split(/\W+/);
  return keywordList.filter((keyword) => words.includes(keyword.toLowerCase()));
};

// Helper function to extract text from a PDF file
const extractResumeText = async (resumePath: string): Promise<string> => {
  const pdfBuffer = fs.readFileSync(resumePath);
  const data = await pdfParse(pdfBuffer);
  return data.text.toLowerCase();
};

// Main function to get applicants with resume scores
export const getApplicantsWithScores = async (req: any, res: any) => {
  try {
    // Extract jobId from the request
    const { jobId } = req.params;

    // Authenticate recruiter using JWT
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    const decoded: any = jwt.verify(
      token,
      process.env.JWT_SECRET || 'your_jwt_secret'
    );
    const recruiterId = decoded.id;
    const name = decoded.name;

    // Fetch recruiter and the specific job
    const recruiter = await Recruiter.findOne({
      _id: recruiterId,
      'jobs._id': jobId,
    });
    if (!recruiter) {
      return res
        .status(404)
        .json({ success: false, message: 'Job or Recruiter not found.' });
    }

    const job = recruiter.jobs.id(jobId);
    if (!job) {
      return res
        .status(404)
        .json({ success: false, message: 'Job not found.' });
    }

    // Extract job description from the job schema
    const jobDescription = job.description;
    const jobKeywords = extractKeywords(jobDescription, techKeywordList);

    // Fetch all applicants and calculate scores
    const applicantsWithScores = [];
    for (const applicant of job.applicants) {
      const resumePath = applicant.resume; // Path stored in the `resume` field
      if (!fs.existsSync(resumePath!)) {
        continue; // Skip if resume file doesn't exist
      }
      // Fetch student details from the Student model
      const student = await Student.findById(applicant.studentId);
      if (!student) {
        continue; // Skip if student not found
      }

      // Extract text from the resume and calculate score
      const resumeText = await extractResumeText(resumePath!);
      const resumeKeywords = extractKeywords(resumeText, techKeywordList);

      const commonKeywords = jobKeywords.filter((keyword) =>
        resumeKeywords.includes(keyword)
      );
      const score = (commonKeywords.length / jobKeywords.length) * 100;

      applicantsWithScores.push({
        studentId: applicant.studentId,
        studentName: student.name,
        resumePath,
        score: score.toFixed(2), // Score as a percentage
      });
    }

    return res.status(200).json({
      success: true,
      jobTitle: job.title,
      applicants: applicantsWithScores,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Error fetching applicants and scores.',
      error: (err as Error).message,
    });
  }
};

export const deleteJobRec = async (req: any, res: any) => {
  try {
    // Extract the token from the Authorization header
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    // Decode and verify the token
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);
    const recruiterId = decoded.id;

    // Extract the jobId from the request parameters
    const { jobId } = req.params;

    // Find the recruiter by ID
    const recruiter = await Recruiter.findById(recruiterId);
    if (!recruiter) {
      return res
        .status(404)
        .json({ success: false, message: 'Recruiter not found.' });
    }

    // Find the job in the recruiter's job list
    const jobIndex = recruiter.jobs.findIndex(
      (job: any) => job._id.toString() === jobId
    );

    if (jobIndex === -1) {
      return res
        .status(404)
        .json({ success: false, message: 'Job not found or unauthorized.' });
    }

    // Remove the job from the recruiter's job list
    recruiter.jobs.splice(jobIndex, 1);

    // Save the recruiter with the updated job list
    await recruiter.save();

    return res.status(200).json({
      success: true,
      message: 'Job deleted successfully.',
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Error deleting job.',
      error: (err as Error).message,
    });
  }
};

export const getJobById = async (req: any, res: any) => {
  try {
    // Extract the token from the Authorization header
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    // Decode and verify the token
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);
    const recruiterId = decoded.id;

    // Extract the jobId from the request parameters
    const { jobId } = req.params;

    // Find the recruiter by ID
    const recruiter = await Recruiter.findById(recruiterId);
    if (!recruiter) {
      return res
        .status(404)
        .json({ success: false, message: 'Recruiter not found.' });
    }

    // Find the specific job in the recruiter's job list
    const job = recruiter.jobs.find((job: any) => job._id.toString() === jobId);

    if (!job) {
      return res
        .status(404)
        .json({ success: false, message: 'Job not found or unauthorized.' });
    }

    // Return the job details
    return res.status(200).json({
      success: true,
      job,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Error fetching job details.',
      error: (err as Error).message,
    });
  }
};

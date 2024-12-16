import mongoose from 'mongoose';

// Schema for Students
const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  usn: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  age: {
    type: Number,
    required: true,
  },
  grade: {
    type: String,
    required: true,
  },
  resumeId: {
    type: String,
  },
});

// Schema for Placement Cell
const placementCellSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
});

// Schema for Jobs
const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  maxApplications: {
    type: Number,
    default: 100, // Default maximum count of applications
  },
  applicants: [
    {
      studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
      studentName: { type: String, ref: 'Student' },
      resume: { type: String }, // Resume file path
      applicationDate: { type: Date, default: Date.now },
    },
  ],
});

// Schema for Recruiters
const recruiterSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  jobs: [jobSchema], // Embedding jobs within recruiters
});

// Models
const Student = mongoose.model('Student', studentSchema);
const PlacementCell = mongoose.model('PlacementCell', placementCellSchema);
const Recruiter = mongoose.model('Recruiter', recruiterSchema);

export { PlacementCell, Recruiter, Student };

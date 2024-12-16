"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Student = exports.Recruiter = exports.PlacementCell = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
// Schema for Students
const studentSchema = new mongoose_1.default.Schema({
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
const placementCellSchema = new mongoose_1.default.Schema({
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
const jobSchema = new mongoose_1.default.Schema({
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
            studentId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Student' },
            studentName: { type: String, ref: 'Student' },
            resume: { type: String }, // Resume file path
            applicationDate: { type: Date, default: Date.now },
        },
    ],
});
// Schema for Recruiters
const recruiterSchema = new mongoose_1.default.Schema({
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
const Student = mongoose_1.default.model('Student', studentSchema);
exports.Student = Student;
const PlacementCell = mongoose_1.default.model('PlacementCell', placementCellSchema);
exports.PlacementCell = PlacementCell;
const Recruiter = mongoose_1.default.model('Recruiter', recruiterSchema);
exports.Recruiter = Recruiter;

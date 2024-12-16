"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const recruiter_Controller_1 = require("../controllers/recruiter.Controller");
const authRecruiter_1 = require("../middlewares/authRecruiter");
const validator_1 = __importDefault(require("../middlewares/validator"));
const zodSchema_1 = require("../utils/zodSchema");
const router = express_1.default.Router();
router.post('/register', (0, validator_1.default)(zodSchema_1.recruiterRegSchema), recruiter_Controller_1.registerRecruiter); // Register a recruiter
router.post('/login', recruiter_Controller_1.loginRecruiter);
//create A JOB posting
router.post('/create-job', authRecruiter_1.authenticateRecruiter, recruiter_Controller_1.createJobPost);
router.get('/jobs', authRecruiter_1.authenticateRecruiter, recruiter_Controller_1.getJobsRec);
router.get('/jobs/:jobId', authRecruiter_1.authenticateRecruiter, recruiter_Controller_1.getJobById);
router.get('/jobs/:jobId/applicants', recruiter_Controller_1.getApplicantsWithScores);
router.delete('/jobs/deletejob/:jobId', recruiter_Controller_1.deleteJobRec);
exports.default = router;

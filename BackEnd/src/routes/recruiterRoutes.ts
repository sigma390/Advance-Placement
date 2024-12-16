import express from 'express';
import { loginPlacement } from '../controllers/placementCell.Controller';
import {
  createJobPost,
  deleteJobRec,
  getApplicantsWithScores,
  getJobById,
  getJobsRec,
  loginRecruiter,
  registerRecruiter,
} from '../controllers/recruiter.Controller';

import { authenticateRecruiter } from '../middlewares/authRecruiter';
import validateRequest from '../middlewares/validator';
import { recruiterRegSchema } from '../utils/zodSchema';

const router = express.Router();

router.post(
  '/register',
  validateRequest(recruiterRegSchema),
  registerRecruiter
); // Register a recruiter
router.post('/login', loginRecruiter);

//create A JOB posting
router.post('/create-job', authenticateRecruiter, createJobPost);
router.get('/jobs', authenticateRecruiter, getJobsRec);
router.get('/jobs/:jobId', authenticateRecruiter, getJobById);
router.get('/jobs/:jobId/applicants', getApplicantsWithScores);
router.delete('/jobs/deletejob/:jobId', deleteJobRec);
export default router;

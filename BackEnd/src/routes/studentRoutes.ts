import express from 'express';
import {
  applyForJob,
  getAllJobsForStudent,
  getIndividualJob,
  loginStudent,
  registerStudent,
} from '../controllers/student.Controller';
import { authenticateStudent } from '../middlewares/authStudent';
import validateRequest from '../middlewares/validator';
import { studentRegistrationSchema } from '../utils/zodSchema';


const router = express.Router();
router.post(
  '/register',
  validateRequest(studentRegistrationSchema),
  registerStudent
);
router.post('/login', loginStudent);
router.get('/jobs', getAllJobsForStudent);
router.get('/jobs/:jobId', getIndividualJob);
router.post('/jobs/applyjob', authenticateStudent, applyForJob);

export default router;

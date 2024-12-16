import express from 'express';
import {
  loginPlacement,
  registerPlacement,
} from '../controllers/placementCell.Controller';
import validateRequest from '../middlewares/validator';
import { placementRegSchema } from '../utils/zodSchema';

const router = express.Router();

router.post(
  '/register',
  validateRequest(placementRegSchema),
  registerPlacement
); // Register a placement cell
// router.post('/login', loginPlacement); // Login a placement cell
router.post('/login', loginPlacement);
export default router;

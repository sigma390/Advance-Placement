"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const student_Controller_1 = require("../controllers/student.Controller");
const authStudent_1 = require("../middlewares/authStudent");
const validator_1 = __importDefault(require("../middlewares/validator"));
const zodSchema_1 = require("../utils/zodSchema");
const router = express_1.default.Router();
router.post('/register', (0, validator_1.default)(zodSchema_1.studentRegistrationSchema), student_Controller_1.registerStudent);
router.post('/login', student_Controller_1.loginStudent);
router.get('/jobs', student_Controller_1.getAllJobsForStudent);
router.get('/jobs/:jobId', student_Controller_1.getIndividualJob);
router.post('/jobs/applyjob', authStudent_1.authenticateStudent, student_Controller_1.applyForJob);
exports.default = router;

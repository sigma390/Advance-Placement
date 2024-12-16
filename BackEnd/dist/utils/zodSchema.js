"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.placementRegSchema = exports.recruiterRegSchema = exports.studentRegistrationSchema = void 0;
const zod_1 = require("zod");
exports.studentRegistrationSchema = zod_1.z.object({
    name: zod_1.z.string().min(3, 'Name must be at least 3 characters long'),
    usn: zod_1.z.string(),
    password: zod_1.z.string().min(8, 'Password must be at least 8 characters long'),
    age: zod_1.z
        .number()
        .min(16, 'Age must be at least 16')
        .max(60, 'Age cannot exceed 60'),
    grade: zod_1.z.string().min(1, 'Grade is required'),
    resumeId: zod_1.z.string().optional(),
});
exports.recruiterRegSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    name: zod_1.z.string().min(5, 'Min length must be at least 5 characters'),
});
exports.placementRegSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    name: zod_1.z.string().min(10, 'Min length must be at least 10 characters'),
});

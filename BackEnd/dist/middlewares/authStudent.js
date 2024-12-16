"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateStudent = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authenticateStudent = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        req.body.studentId = decoded.id; // Attach student ID to the request
        next();
    }
    catch (err) {
        return res.status(401).json({ success: false, message: 'Invalid token' });
    }
};
exports.authenticateStudent = authenticateStudent;

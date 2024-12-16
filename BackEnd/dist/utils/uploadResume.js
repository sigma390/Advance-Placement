"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
// Multer configuration for resume upload
const upload = (0, multer_1.default)({
    storage: multer_1.default.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'uploads/resumes'); // Directory for resumes
        },
        filename: (req, file, cb) => {
            const timestamp = Date.now();
            cb(null, `${timestamp}-${file.originalname}`);
        },
    }),
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
            cb(null, true); // Allow only PDFs
        }
        else {
            cb(null, false);
        }
    },
});
exports.default = upload;

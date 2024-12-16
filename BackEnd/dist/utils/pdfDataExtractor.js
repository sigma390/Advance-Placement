"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parsePDF = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const pdf_parse_1 = __importDefault(require("pdf-parse"));
const parsePDF = async (filePath) => {
    try {
        const resolvedPath = path_1.default.resolve(__dirname, filePath); // Resolve the full path
        const pdfBuffer = fs_1.default.readFileSync(resolvedPath); // Read the PDF file as a buffer
        const data = await (0, pdf_parse_1.default)(pdfBuffer); // Parse the PDF buffer
        return data.text;
        console.log('Extracted Text:', data.text); // Log extracted text
        console.log('PDF Info:', data.info); // Log PDF metadata
    }
    catch (error) {
        console.error('Error reading or parsing PDF:', error.message);
    }
};
exports.parsePDF = parsePDF;

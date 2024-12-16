"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const pdf_parse_1 = __importDefault(require("pdf-parse"));
const ndata_1 = require("../data/ndata");
// Function to extract tech keywords from text
const extractKeywords = (text, keywordList) => {
    const words = text.toLowerCase().split(/\W+/); // Split by non-word characters
    const matchedKeywords = keywordList.filter((keyword) => words.includes(keyword.toLowerCase()));
    return matchedKeywords;
};
// Job description (example)
const jobDescription = `
    We are looking for a skilled Software Engineer with experience in 
    JavaScript, Node.js, React, HTML, MongoDB, and CI/CD pipelines.
`;
// Function to extract text from a PDF resume
const extractResumeText = async (resumePath) => {
    const pdfBuffer = fs_1.default.readFileSync(resumePath); // Load PDF as buffer
    const data = await (0, pdf_parse_1.default)(pdfBuffer); // Parse the PDF
    return data.text.toLowerCase(); // Return lowercased text
};
// Function to compare job description with resume and generate a score
const compareKeywordsAndGenerateScore = async (resumePath) => {
    // Extract keywords from job description
    const jobKeywords = extractKeywords(jobDescription, ndata_1.techKeywordList);
    console.log('Job Keywords:', jobKeywords);
    // Extract resume text and find keywords
    const resumeText = await extractResumeText(resumePath);
    const resumeKeywords = extractKeywords(resumeText, ndata_1.techKeywordList);
    console.log('Resume Keywords:', resumeKeywords);
    // Calculate the match score (based on common keywords)
    const commonKeywords = jobKeywords.filter((keyword) => resumeKeywords.includes(keyword));
    console.log('Common Keywords:', commonKeywords);
    // Generate a score (e.g., percentage of job description keywords matched in resume)
    const score = (commonKeywords.length / jobKeywords.length) * 100;
    console.log(`Match Score: ${score.toFixed(2)}%`);
    return score;
};
// Example usage
const resumePath = path_1.default.resolve(__dirname, '../../Uploads/resumes/1734121637597-example1.pdf');
compareKeywordsAndGenerateScore(resumePath);

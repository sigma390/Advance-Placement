import fs from 'fs';
import path from 'path';
import pdfParse from 'pdf-parse';
import { techKeywordList } from '../data/ndata';

// Function to extract tech keywords from text
const extractKeywords = (text: string, keywordList: string[]): string[] => {
  const words = text.toLowerCase().split(/\W+/); // Split by non-word characters
  const matchedKeywords = keywordList.filter((keyword) =>
    words.includes(keyword.toLowerCase())
  );
  return matchedKeywords;
};

// Job description (example)
const jobDescription = `
    We are looking for a skilled Software Engineer with experience in 
    JavaScript, Node.js, React, HTML, MongoDB, and CI/CD pipelines.
`;

// Function to extract text from a PDF resume
const extractResumeText = async (resumePath: string): Promise<string> => {
  const pdfBuffer = fs.readFileSync(resumePath); // Load PDF as buffer
  const data = await pdfParse(pdfBuffer); // Parse the PDF
  return data.text.toLowerCase(); // Return lowercased text
};

// Function to compare job description with resume and generate a score
const compareKeywordsAndGenerateScore = async (resumePath: string) => {
  // Extract keywords from job description
  const jobKeywords = extractKeywords(jobDescription, techKeywordList);
  console.log('Job Keywords:', jobKeywords);

  // Extract resume text and find keywords
  const resumeText = await extractResumeText(resumePath);
  const resumeKeywords = extractKeywords(resumeText, techKeywordList);
  console.log('Resume Keywords:', resumeKeywords);

  // Calculate the match score (based on common keywords)
  const commonKeywords = jobKeywords.filter((keyword) =>
    resumeKeywords.includes(keyword)
  );
  console.log('Common Keywords:', commonKeywords);

  // Generate a score (e.g., percentage of job description keywords matched in resume)
  const score = (commonKeywords.length / jobKeywords.length) * 100;
  console.log(`Match Score: ${score.toFixed(2)}%`);

  return score;
};

// Example usage
const resumePath = path.resolve(
  __dirname,
  '../../Uploads/resumes/1734121637597-example1.pdf'
);
compareKeywordsAndGenerateScore(resumePath);

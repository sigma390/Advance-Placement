import fs from 'fs';
import path from 'path';
import pdfParse from 'pdf-parse';

export const parsePDF = async (filePath: string): Promise<void | string> => {
  try {
    const resolvedPath = path.resolve(__dirname, filePath); // Resolve the full path
    const pdfBuffer = fs.readFileSync(resolvedPath); // Read the PDF file as a buffer
    const data = await pdfParse(pdfBuffer); // Parse the PDF buffer
    return data.text;
    console.log('Extracted Text:', data.text); // Log extracted text
    console.log('PDF Info:', data.info); // Log PDF metadata
  } catch (error) {
    console.error('Error reading or parsing PDF:', (error as Error).message);
  }
};



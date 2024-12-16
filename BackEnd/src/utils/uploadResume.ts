import multer from 'multer';

// Multer configuration for resume upload
const upload = multer({
  storage: multer.diskStorage({
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
    } else {
      cb(null, false);
    }
  },
});

export default upload;

import dotenv from 'dotenv';
import express, { NextFunction, Request, Response } from 'express';
import MongoConnect from './db/dbConnect';

import cors from 'cors';
import plcmentCellRoutes from './routes/plcmentCellRoutes';
import recruiterRoutes from './routes/recruiterRoutes';
import studentRoutes from './routes/studentRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(express.json());
app.use(cors()); // Enable CORS for cross-origin requests

// Route Setup
app.use('/api/students', studentRoutes);
app.use('/api/placements', plcmentCellRoutes);
app.use('/api/recruiters', recruiterRoutes);

// Test Route
app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to the API!');
});

// Global Error Handling Middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res
    .status(500)
    .json({ message: 'Internal Server Error', error: err.message });
});

// Connect to DB and Start Server
(async () => {
  try {
    await MongoConnect();
    console.log('Database connected successfully!');

    app.listen(PORT, () =>
      console.log(`🚀 Server running on http://localhost:${PORT}`)
    );
  } catch (error) {
    console.error('❌ Failed to connect to the database:', error);
    process.exit(1); // Exit process with failure
  }
})();

import { NextFunction, Request, Response } from 'express';
import { ZodError, ZodSchema } from 'zod';

const validateRequest = (schema: ZodSchema<any>) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse(req.body); // Validate the request body
      next(); // Pass control to the next middleware/route handler
    } catch (err) {
      if (err instanceof ZodError) {
        // If validation fails, send a structured error response
        res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: err.errors.map((e) => ({
            field: e.path.join('.'),
            message: e.message,
          })),
        });
      } else {
        next(err); // Pass non-validation errors to the next middleware
      }
    }
  };
};

export default validateRequest;

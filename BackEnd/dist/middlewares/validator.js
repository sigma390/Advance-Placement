"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const validateRequest = (schema) => {
    return (req, res, next) => {
        try {
            schema.parse(req.body); // Validate the request body
            next(); // Pass control to the next middleware/route handler
        }
        catch (err) {
            if (err instanceof zod_1.ZodError) {
                // If validation fails, send a structured error response
                res.status(400).json({
                    success: false,
                    message: 'Validation error',
                    errors: err.errors.map((e) => ({
                        field: e.path.join('.'),
                        message: e.message,
                    })),
                });
            }
            else {
                next(err); // Pass non-validation errors to the next middleware
            }
        }
    };
};
exports.default = validateRequest;

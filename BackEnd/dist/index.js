"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const dbConnect_1 = __importDefault(require("./db/dbConnect"));
const cors_1 = __importDefault(require("cors"));
const plcmentCellRoutes_1 = __importDefault(require("./routes/plcmentCellRoutes"));
const recruiterRoutes_1 = __importDefault(require("./routes/recruiterRoutes"));
const studentRoutes_1 = __importDefault(require("./routes/studentRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 8000;
// Middleware
app.use(express_1.default.json());
app.use((0, cors_1.default)()); // Enable CORS for cross-origin requests
// Route Setup
app.use('/api/students', studentRoutes_1.default);
app.use('/api/placements', plcmentCellRoutes_1.default);
app.use('/api/recruiters', recruiterRoutes_1.default);
// Test Route
app.get('/', (req, res) => {
    res.send('Welcome to the API!');
});
// Global Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res
        .status(500)
        .json({ message: 'Internal Server Error', error: err.message });
});
// Connect to DB and Start Server
(async () => {
    try {
        await (0, dbConnect_1.default)();
        console.log('Database connected successfully!');
        app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
    }
    catch (error) {
        console.error('❌ Failed to connect to the database:', error);
        process.exit(1); // Exit process with failure
    }
})();

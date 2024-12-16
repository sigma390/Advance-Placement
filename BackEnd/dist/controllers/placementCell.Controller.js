"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginPlacement = exports.registerPlacement = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const schema_1 = require("../db/schema");
const registerPlacement = async (req, res) => {
    const { email, name, password } = req.body;
    try {
        // Check if Placement Cell already exists
        const existingPlacement = await schema_1.PlacementCell.findOne({ email });
        if (existingPlacement) {
            return res.status(400).json({
                success: false,
                message: 'Placement Cell with this email already exists',
            });
        }
        // Hash the password
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        // Create a new Placement Cell
        const newPlacement = new schema_1.PlacementCell({
            email,
            name,
            password: hashedPassword,
        });
        await newPlacement.save();
        // Generate JWT
        const token = jsonwebtoken_1.default.sign({ id: newPlacement._id, role: 'placement' }, process.env.JWT_SECRET, { expiresIn: '1d' });
        return res.status(201).json({
            success: true,
            message: 'Placement Cell registered successfully',
            token,
            userId: newPlacement._id,
        });
    }
    catch (err) {
        return res
            .status(400)
            .json({ success: false, message: err.message });
    }
};
exports.registerPlacement = registerPlacement;
const loginPlacement = async (req, res) => {
    const { email, password } = req.body;
    try {
        // Check if the Placement Cell exists
        const placementCell = await schema_1.PlacementCell.findOne({ email });
        if (!placementCell) {
            return res.status(404).json({
                success: false,
                message: 'Placement Cell with this email does not exist',
            });
        }
        // Compare the provided password with the stored hashed password
        const isPasswordValid = await bcrypt_1.default.compare(password, placementCell.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid password',
            });
        }
        // Generate JWT token
        const token = jsonwebtoken_1.default.sign({ id: placementCell._id, role: 'PlacementCell' }, process.env.JWT_SECRET || 'your_jwt_secret', { expiresIn: '1d' });
        return res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
        });
    }
    catch (err) {
        return res
            .status(500)
            .json({ success: false, message: err.message });
    }
};
exports.loginPlacement = loginPlacement;

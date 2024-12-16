"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userLogin = void 0;
const schema_1 = require("../db/schema");
// Environment variable for JWT secret
const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';
const userLogin = async (req, res) => {
    try {
        const { username, password, role } = req.body;
        // Validate the role
        if (!role || !['student', 'placement', 'recruiter'].includes(role)) {
            return res
                .status(400)
                .json({ success: false, message: 'Invalid role specified' });
        }
        // Validate username and password
        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: 'Username and password are required',
            });
        }
        // Find user in the database based on username and role
        const user = await schema_1.Student.findOne({ username, role });
        if (!user) {
            return res
                .status(404)
                .json({ success: false, message: 'User not found' });
        }
        // Compare the password
        // const isPasswordValid = await bcrypt.compare(password, user.password);
        // if (!isPasswordValid) {
        //   return res.status(401).json({ success: false, message: 'Invalid credentials' });
        // }
        // // Generate a JWT token
        // const token = jwt.sign(
        //   { id: user._id, role: user.role },
        //   JWT_SECRET,
        //   { expiresIn: '1d' } // Token validity (1 day)
        // );
        // Respond with success and token
        return res.status(200).json({
            success: true,
            message: `${role} login successful`,
            //   token,
            user: { id: user._id, username: user.name },
        });
    }
    catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
};
exports.userLogin = userLogin;
const userRegister = async (req, res) => {
    const { username, password, role, name } = req.body;
    if (role === 'student') {
        try {
            const newStudent = new schema_1.Student({ username, password, role });
            await newStudent.save();
            return res
                .status(201)
                .json({ success: true, message: 'Student registered successfully' });
        }
        catch (err) {
            throw new Error('Not Registered');
        }
    }
    else if (role === 'plcement') {
        try {
            const newPlacement = new schema_1.PlacementCell({
                email: username,
                password: password,
                name: name,
            });
            await newPlacement.save();
            return res
                .status(201)
                .json({
                success: true,
                message: 'Placement Cell registered successfully',
            });
        }
        catch (err) {
            throw new Error('Not Registered');
        }
    }
    else {
        try {
        }
        catch (err) {
            throw new Error('Not Registered');
        }
    }
};

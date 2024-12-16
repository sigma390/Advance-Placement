import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PlacementCell } from '../db/schema';

export const registerPlacement = async (req: any, res: any) => {
  const { email, name, password } = req.body;

  try {
    // Check if Placement Cell already exists
    const existingPlacement = await PlacementCell.findOne({ email });
    if (existingPlacement) {
      return res.status(400).json({
        success: false,
        message: 'Placement Cell with this email already exists',
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new Placement Cell
    const newPlacement = new PlacementCell({
      email,
      name,
      password: hashedPassword,
    });

    await newPlacement.save();

    // Generate JWT
    const token = jwt.sign(
      { id: newPlacement._id, role: 'placement' },
      process.env.JWT_SECRET!,
      { expiresIn: '1d' }
    );

    return res.status(201).json({
      success: true,
      message: 'Placement Cell registered successfully',
      token,
      userId: newPlacement._id,
    });
  } catch (err) {
    return res
      .status(400)
      .json({ success: false, message: (err as Error).message });
  }
};

export const loginPlacement = async (req: any, res: any) => {
  const { email, password } = req.body;

  try {
    // Check if the Placement Cell exists
    const placementCell = await PlacementCell.findOne({ email });
    if (!placementCell) {
      return res.status(404).json({
        success: false,
        message: 'Placement Cell with this email does not exist',
      });
    }

    // Compare the provided password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(
      password,
      placementCell.password
    );
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid password',
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: placementCell._id, role: 'PlacementCell' },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '1d' }
    );

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: (err as Error).message });
  }
};

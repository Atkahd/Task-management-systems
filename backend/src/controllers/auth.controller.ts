import { Request, Response } from 'express';
import User from '../models/User';
import { generateToken } from '../utils/generateToken';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(409).json({
        success: false,
        message: 'User with this email already exists',
        error: 'CONFLICT'
      });
      return;
    }

    const user = await User.create({
      name,
      email,
      password,
      role: 'USER' 
    });

    
    const token = generateToken(user._id.toString(), user.role);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: { user, token }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error during registration',
      error: error instanceof Error ? error.message : 'UNKNOWN_ERROR'
    });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    
    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Invalid email or password',
        error: 'UNAUTHORIZED'
      });
      return;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(401).json({
        success: false,
        message: 'Invalid email or password',
        error: 'UNAUTHORIZED'
      });
      return;
    }

    
    const token = generateToken(user._id.toString(), user.role);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: { user, token }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error during login',
      error: error instanceof Error ? error.message : 'UNKNOWN_ERROR'
    });
  }
};

export const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = req.user;

    res.status(200).json({
      success: true,
      message: 'User data retrieved',
      data: { user }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error retrieving user data',
      error: error instanceof Error ? error.message : 'UNKNOWN_ERROR'
    });
  }
};
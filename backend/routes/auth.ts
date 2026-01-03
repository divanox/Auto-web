import express, { Router, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';
import { authenticateUser, AuthRequest } from '../middleware/auth.js';

const router: Router = express.Router();

// Helper function to generate JWT token
const generateToken = (userId: string): string => {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
        throw new Error('JWT_SECRET is not defined in environment variables');
    }

    const expiresIn = process.env.JWT_EXPIRE || '7d';

    return jwt.sign(
        { userId },
        jwtSecret,
        { expiresIn } as jwt.SignOptions
    );
};

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { email, password, name } = req.body;

        // Validate input
        if (!email || !password || !name) {
            res.status(400).json({
                success: false,
                message: 'Please provide email, password, and name.'
            });
            return;
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            res.status(400).json({
                success: false,
                message: 'User with this email already exists.'
            });
            return;
        }

        // Create new user
        const user = await User.create({ email, password, name });

        // Generate JWT token
        const token = generateToken(user._id.toString());

        res.status(201).json({
            success: true,
            message: 'User registered successfully.',
            data: {
                user,
                token
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Error registering user.',
            error: (error as Error).message
        });
    }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            res.status(400).json({
                success: false,
                message: 'Please provide email and password.'
            });
            return;
        }

        // Find user and include password field
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            res.status(401).json({
                success: false,
                message: 'Invalid credentials.'
            });
            return;
        }

        // Check password
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            res.status(401).json({
                success: false,
                message: 'Invalid credentials.'
            });
            return;
        }

        // Generate JWT token
        const token = generateToken(user._id.toString());

        // Remove password from response
        user.password = undefined as any;

        res.status(200).json({
            success: true,
            message: 'Login successful.',
            data: {
                user,
                token
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Error logging in.',
            error: (error as Error).message
        });
    }
});

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', authenticateUser, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        res.status(200).json({
            success: true,
            data: {
                user: req.user
            }
        });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching user data.',
            error: (error as Error).message
        });
    }
});

export default router;

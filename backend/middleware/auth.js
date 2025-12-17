import jwt from 'jsonwebtoken';
import { User, Project } from '../models/index.js';

// Middleware to verify JWT token for authenticated users
export const authenticateUser = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Access denied. No token provided.'
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid token. User not found.'
            });
        }

        req.user = user;
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Invalid token.'
            });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token expired.'
            });
        }
        res.status(500).json({
            success: false,
            message: 'Server error during authentication.'
        });
    }
};

// Middleware to verify API token for generated APIs
export const authenticateApiToken = async (req, res, next) => {
    try {
        const { projectToken } = req.params;

        if (!projectToken) {
            return res.status(401).json({
                success: false,
                message: 'API token is required.'
            });
        }

        const project = await Project.findOne({ apiToken: projectToken });

        if (!project) {
            return res.status(401).json({
                success: false,
                message: 'Invalid API token.'
            });
        }

        req.project = project;
        next();
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error during API token validation.'
        });
    }
};

// Middleware to check if user owns the project
export const authorizeProjectOwner = async (req, res, next) => {
    try {
        const projectId = req.params.id || req.params.projectId;
        const project = await Project.findById(projectId);

        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Project not found.'
            });
        }

        if (project.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Access denied. You do not own this project.'
            });
        }

        req.project = project;
        next();
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error during authorization.'
        });
    }
};

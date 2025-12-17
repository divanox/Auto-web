import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User, Project, IUser, IProject } from '../models/index.js';

// Extend Express Request type to include user and project
export interface AuthRequest extends Request {
    user?: IUser;
    project?: IProject;
}

// Middleware to verify JWT token for authenticated users
export const authenticateUser = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            res.status(401).json({
                success: false,
                message: 'Access denied. No token provided.'
            });
            return;
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string };
        const user = await User.findById(decoded.userId);

        if (!user) {
            res.status(401).json({
                success: false,
                message: 'Invalid token. User not found.'
            });
            return;
        }

        req.user = user;
        next();
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            res.status(401).json({
                success: false,
                message: 'Invalid token.'
            });
            return;
        }
        if (error instanceof jwt.TokenExpiredError) {
            res.status(401).json({
                success: false,
                message: 'Token expired.'
            });
            return;
        }
        res.status(500).json({
            success: false,
            message: 'Server error during authentication.'
        });
    }
};

// Middleware to verify API token for generated APIs
export const authenticateApiToken = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { projectToken } = req.params;

        if (!projectToken) {
            res.status(401).json({
                success: false,
                message: 'API token is required.'
            });
            return;
        }

        const project = await Project.findOne({ apiToken: projectToken });

        if (!project) {
            res.status(401).json({
                success: false,
                message: 'Invalid API token.'
            });
            return;
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
export const authorizeProjectOwner = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const projectId = req.params.id || req.params.projectId;
        const project = await Project.findById(projectId);

        if (!project) {
            res.status(404).json({
                success: false,
                message: 'Project not found.'
            });
            return;
        }

        if (!req.user || project.userId.toString() !== req.user._id.toString()) {
            res.status(403).json({
                success: false,
                message: 'Access denied. You do not own this project.'
            });
            return;
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

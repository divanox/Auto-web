import express, { Router, Response } from 'express';
import { nanoid } from 'nanoid';
import { Project } from '../models/index.js';
import { authenticateUser, authorizeProjectOwner, AuthRequest } from '../middleware/auth.js';

const router: Router = express.Router();

// All routes require authentication
router.use(authenticateUser);

// @route   GET /api/projects
// @desc    Get all projects for the authenticated user
// @access  Private
router.get('/', async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const projects = await Project.find({ userId: req.user!._id })
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: projects.length,
            data: { projects }
        });
    } catch (error) {
        console.error('Get projects error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching projects.',
            error: (error as Error).message
        });
    }
});

// @route   POST /api/projects
// @desc    Create a new project
// @access  Private
router.post('/', async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { name, description } = req.body;

        if (!name) {
            res.status(400).json({
                success: false,
                message: 'Project name is required.'
            });
            return;
        }

        const project = await Project.create({
            userId: req.user!._id,
            name,
            description: description || ''
        });

        res.status(201).json({
            success: true,
            message: 'Project created successfully.',
            data: { project }
        });
    } catch (error) {
        console.error('Create project error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating project.',
            error: (error as Error).message
        });
    }
});

// @route   GET /api/projects/:id
// @desc    Get a single project
// @access  Private (owner only)
router.get('/:id', authorizeProjectOwner, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        res.status(200).json({
            success: true,
            data: { project: req.project }
        });
    } catch (error) {
        console.error('Get project error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching project.',
            error: (error as Error).message
        });
    }
});

// @route   PUT /api/projects/:id
// @desc    Update a project
// @access  Private (owner only)
router.put('/:id', authorizeProjectOwner, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { name, description } = req.body;

        if (name) req.project!.name = name;
        if (description !== undefined) req.project!.description = description;

        await req.project!.save();

        res.status(200).json({
            success: true,
            message: 'Project updated successfully.',
            data: { project: req.project }
        });
    } catch (error) {
        console.error('Update project error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating project.',
            error: (error as Error).message
        });
    }
});

// @route   DELETE /api/projects/:id
// @desc    Delete a project
// @access  Private (owner only)
router.delete('/:id', authorizeProjectOwner, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        await Project.findByIdAndDelete(req.project!._id);

        res.status(200).json({
            success: true,
            message: 'Project deleted successfully.'
        });
    } catch (error) {
        console.error('Delete project error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting project.',
            error: (error as Error).message
        });
    }
});

// @route   POST /api/projects/:id/regenerate-token
// @desc    Regenerate API token for a project
// @access  Private (owner only)
router.post('/:id/regenerate-token', authorizeProjectOwner, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        req.project!.apiToken = nanoid(32);
        await req.project!.save();

        res.status(200).json({
            success: true,
            message: 'API token regenerated successfully.',
            data: { project: req.project }
        });
    } catch (error) {
        console.error('Regenerate token error:', error);
        res.status(500).json({
            success: false,
            message: 'Error regenerating API token.',
            error: (error as Error).message
        });
    }
});

export default router;

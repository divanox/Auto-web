import express, { Router, Response } from 'express';
import { nanoid } from 'nanoid';
import { Project, Module, ProjectModule } from '../models/index.js';
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

// @route   GET /api/projects/:id/modules
// @desc    Get all enabled modules for a project
// @access  Private (owner only)
router.get('/:id/modules', authorizeProjectOwner, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const projectModules = await ProjectModule.find({
            projectId: req.params.id
        }).populate('moduleId');

        res.status(200).json({
            success: true,
            count: projectModules.length,
            data: { modules: projectModules }
        });
    } catch (error) {
        console.error('Get project modules error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching project modules.',
            error: (error as Error).message
        });
    }
});

// @route   POST /api/projects/:id/modules
// @desc    Enable a module for a project
// @access  Private (owner only)
router.post('/:id/modules', authorizeProjectOwner, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { moduleId, configuration } = req.body;

        if (!moduleId) {
            res.status(400).json({
                success: false,
                message: 'Module ID is required.'
            });
            return;
        }

        // Check if module exists
        const module = await Module.findById(moduleId);
        if (!module) {
            res.status(404).json({
                success: false,
                message: 'Module not found.'
            });
            return;
        }

        // Check if module is already enabled
        const existing = await ProjectModule.findOne({
            projectId: req.params.id,
            moduleId
        });

        if (existing) {
            res.status(400).json({
                success: false,
                message: 'Module is already enabled for this project.'
            });
            return;
        }

        // Enable module
        const projectModule = await ProjectModule.create({
            projectId: req.params.id,
            moduleId,
            configuration: configuration || {}
        });

        await projectModule.populate('moduleId');

        res.status(201).json({
            success: true,
            message: 'Module enabled successfully.',
            data: { projectModule }
        });
    } catch (error) {
        console.error('Enable module error:', error);
        res.status(500).json({
            success: false,
            message: 'Error enabling module.',
            error: (error as Error).message
        });
    }
});

// @route   DELETE /api/projects/:id/modules/:moduleId
// @desc    Disable a module for a project
// @access  Private (owner only)
router.delete('/:id/modules/:moduleId', authorizeProjectOwner, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const result = await ProjectModule.findOneAndDelete({
            projectId: req.params.id,
            moduleId: req.params.moduleId
        });

        if (!result) {
            res.status(404).json({
                success: false,
                message: 'Module not found for this project.'
            });
            return;
        }

        res.status(200).json({
            success: true,
            message: 'Module disabled successfully.'
        });
    } catch (error) {
        console.error('Disable module error:', error);
        res.status(500).json({
            success: false,
            message: 'Error disabling module.',
            error: (error as Error).message
        });
    }
});

export default router;

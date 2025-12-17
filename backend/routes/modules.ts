import express, { Router, Response } from 'express';
import { Module, ProjectModule } from '../models/index.js';
import { authenticateUser, authorizeProjectOwner, AuthRequest } from '../middleware/auth.js';

const router: Router = express.Router();

// All routes require authentication
router.use(authenticateUser);

// @route   GET /api/modules
// @desc    Get all available modules
// @access  Private
router.get('/', async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const modules = await Module.find().sort({ name: 1 });

        res.status(200).json({
            success: true,
            count: modules.length,
            data: { modules }
        });
    } catch (error) {
        console.error('Get modules error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching modules.',
            error: (error as Error).message
        });
    }
});

// @route   GET /api/modules/:id
// @desc    Get a single module
// @access  Private
router.get('/:id', async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const module = await Module.findById(req.params.id);

        if (!module) {
            res.status(404).json({
                success: false,
                message: 'Module not found.'
            });
            return;
        }

        res.status(200).json({
            success: true,
            data: { module }
        });
    } catch (error) {
        console.error('Get module error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching module.',
            error: (error as Error).message
        });
    }
});

// @route   GET /api/projects/:projectId/modules
// @desc    Get all enabled modules for a project
// @access  Private (owner only)
router.get('/projects/:projectId/modules', authorizeProjectOwner, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const projectModules = await ProjectModule.find({
            projectId: req.params.projectId
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

// @route   POST /api/projects/:projectId/modules
// @desc    Enable a module for a project
// @access  Private (owner only)
router.post('/projects/:projectId/modules', authorizeProjectOwner, async (req: AuthRequest, res: Response): Promise<void> => {
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
            projectId: req.params.projectId,
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
            projectId: req.params.projectId,
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

// @route   DELETE /api/projects/:projectId/modules/:moduleId
// @desc    Disable a module for a project
// @access  Private (owner only)
router.delete('/projects/:projectId/modules/:moduleId', authorizeProjectOwner, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const result = await ProjectModule.findOneAndDelete({
            projectId: req.params.projectId,
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

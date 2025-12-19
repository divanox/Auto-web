import express, { Router, Response } from 'express';
import { Module } from '../models/index.js';
import { authenticateUser, AuthRequest } from '../middleware/auth.js';

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

export default router;

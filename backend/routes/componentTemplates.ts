import express, { Router, Response } from 'express';
import { ComponentTemplate } from '../models/index.js';
import { authenticateUser, AuthRequest } from '../middleware/auth.js';

const router: Router = express.Router();

// All routes require authentication
router.use(authenticateUser);

// @route   GET /api/component-templates
// @desc    Get all available component templates
// @access  Private
router.get('/', async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const templates = await ComponentTemplate.find().sort({ category: 1, name: 1 });

        res.status(200).json({
            success: true,
            count: templates.length,
            data: { templates }
        });
    } catch (error) {
        console.error('Get component templates error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching component templates.',
            error: (error as Error).message
        });
    }
});

// @route   GET /api/component-templates/:id
// @desc    Get a single component template
// @access  Private
router.get('/:id', async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const template = await ComponentTemplate.findById(req.params.id);

        if (!template) {
            res.status(404).json({
                success: false,
                message: 'Component template not found.'
            });
            return;
        }

        res.status(200).json({
            success: true,
            data: { template }
        });
    } catch (error) {
        console.error('Get component template error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching component template.',
            error: (error as Error).message
        });
    }
});

export default router;

import express, { Router, Response, Request } from 'express';
import { ProjectComponent } from '../models/index.js';
import { authenticateApiToken, AuthRequest } from '../middleware/auth.js';

const router: Router = express.Router();

// @route   GET /api/v1/:projectToken/site
// @desc    Get all active components for public site rendering
// @access  Public (with valid API token)
router.get('/:projectToken/site', authenticateApiToken, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const components = await ProjectComponent.find({
            projectId: req.project!._id,
            isActive: true
        })
            .populate('templateId')
            .sort({ order: 1 });

        res.status(200).json({
            success: true,
            count: components.length,
            data: {
                components: components.map(c => ({
                    id: c._id,
                    template: c.templateId,
                    content: c.content,
                    configuration: c.configuration,
                    order: c.order
                }))
            }
        });
    } catch (error) {
        console.error('Get site components error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching site components.',
            error: (error as Error).message
        });
    }
});

export default router;

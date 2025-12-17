import express, { Router, Response } from 'express';
import { ProjectComponent, ComponentTemplate } from '../models/index.js';
import { authenticateUser, authorizeProjectOwner, AuthRequest } from '../middleware/auth.js';

const router: Router = express.Router();

// All routes require authentication
router.use(authenticateUser);

// @route   GET /api/projects/:projectId/components
// @desc    Get all components for a project
// @access  Private (owner only)
router.get('/projects/:projectId/components', authorizeProjectOwner, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const components = await ProjectComponent.find({
            projectId: req.params.projectId
        })
            .populate('templateId')
            .sort({ order: 1 });

        res.status(200).json({
            success: true,
            count: components.length,
            data: { components }
        });
    } catch (error) {
        console.error('Get project components error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching project components.',
            error: (error as Error).message
        });
    }
});

// @route   POST /api/projects/:projectId/components
// @desc    Add a component to a project
// @access  Private (owner only)
router.post('/projects/:projectId/components', authorizeProjectOwner, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { templateId, content, configuration } = req.body;

        if (!templateId) {
            res.status(400).json({
                success: false,
                message: 'Template ID is required.'
            });
            return;
        }

        // Verify template exists
        const template = await ComponentTemplate.findById(templateId);
        if (!template) {
            res.status(404).json({
                success: false,
                message: 'Component template not found.'
            });
            return;
        }

        // Get the highest order number for this project
        const lastComponent = await ProjectComponent.findOne({
            projectId: req.params.projectId
        }).sort({ order: -1 });

        const order = lastComponent ? lastComponent.order + 1 : 0;

        // Create component with default content from template
        const defaultContent: Record<string, any> = {};
        template.fieldSchema.fields.forEach(field => {
            if (field.default !== undefined) {
                defaultContent[field.name] = field.default;
            }
        });

        const component = await ProjectComponent.create({
            projectId: req.params.projectId,
            templateId,
            order,
            content: content || defaultContent,
            configuration: configuration || template.defaultConfig || {}
        });

        await component.populate('templateId');

        res.status(201).json({
            success: true,
            message: 'Component added successfully.',
            data: { component }
        });
    } catch (error) {
        console.error('Add component error:', error);
        res.status(500).json({
            success: false,
            message: 'Error adding component.',
            error: (error as Error).message
        });
    }
});

// @route   PUT /api/projects/:projectId/components/:componentId
// @desc    Update a component
// @access  Private (owner only)
router.put('/projects/:projectId/components/:componentId', authorizeProjectOwner, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { content, configuration, isActive } = req.body;

        const component = await ProjectComponent.findOne({
            _id: req.params.componentId,
            projectId: req.params.projectId
        });

        if (!component) {
            res.status(404).json({
                success: false,
                message: 'Component not found.'
            });
            return;
        }

        if (content !== undefined) component.content = content;
        if (configuration !== undefined) component.configuration = configuration;
        if (isActive !== undefined) component.isActive = isActive;

        await component.save();
        await component.populate('templateId');

        res.status(200).json({
            success: true,
            message: 'Component updated successfully.',
            data: { component }
        });
    } catch (error) {
        console.error('Update component error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating component.',
            error: (error as Error).message
        });
    }
});

// @route   DELETE /api/projects/:projectId/components/:componentId
// @desc    Delete a component
// @access  Private (owner only)
router.delete('/projects/:projectId/components/:componentId', authorizeProjectOwner, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const component = await ProjectComponent.findOneAndDelete({
            _id: req.params.componentId,
            projectId: req.params.projectId
        });

        if (!component) {
            res.status(404).json({
                success: false,
                message: 'Component not found.'
            });
            return;
        }

        res.status(200).json({
            success: true,
            message: 'Component deleted successfully.'
        });
    } catch (error) {
        console.error('Delete component error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting component.',
            error: (error as Error).message
        });
    }
});

// @route   PUT /api/projects/:projectId/components/reorder
// @desc    Reorder components
// @access  Private (owner only)
router.put('/projects/:projectId/components/reorder', authorizeProjectOwner, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { componentIds } = req.body;

        if (!Array.isArray(componentIds)) {
            res.status(400).json({
                success: false,
                message: 'componentIds must be an array.'
            });
            return;
        }

        // Update order for each component
        const updatePromises = componentIds.map((id, index) =>
            ProjectComponent.findOneAndUpdate(
                { _id: id, projectId: req.params.projectId },
                { order: index },
                { new: true }
            )
        );

        await Promise.all(updatePromises);

        const components = await ProjectComponent.find({
            projectId: req.params.projectId
        })
            .populate('templateId')
            .sort({ order: 1 });

        res.status(200).json({
            success: true,
            message: 'Components reordered successfully.',
            data: { components }
        });
    } catch (error) {
        console.error('Reorder components error:', error);
        res.status(500).json({
            success: false,
            message: 'Error reordering components.',
            error: (error as Error).message
        });
    }
});

export default router;

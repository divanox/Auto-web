import express, { Router, Response } from 'express';
import { DynamicData, Module, ProjectModule } from '../models/index.js';
import { authenticateApiToken, AuthRequest } from '../middleware/auth.js';
import { validateDataAgainstSchema } from '../services/moduleDefinitions.js';

const router: Router = express.Router();

// All dynamic API routes require API token authentication
router.use('/:projectToken/:moduleName*', authenticateApiToken);

// @route   GET /api/v1/:projectToken/:moduleName
// @desc    Get all records for a module
// @access  Public (with valid API token)
router.get('/:projectToken/:moduleName', async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { moduleName } = req.params;

        // Find the module by slug
        const module = await Module.findOne({ slug: moduleName });
        if (!module) {
            res.status(404).json({
                success: false,
                message: `Module '${moduleName}' not found.`
            });
            return;
        }

        // Check if module is enabled for this project
        const projectModule = await ProjectModule.findOne({
            projectId: req.project!._id,
            moduleId: module._id
        });

        if (!projectModule) {
            res.status(403).json({
                success: false,
                message: `Module '${moduleName}' is not enabled for this project.`
            });
            return;
        }

        // Get all data for this module
        const records = await DynamicData.find({
            projectId: req.project!._id,
            moduleId: module._id
        }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: records.length,
            data: records.map(r => ({ id: r._id, ...r.data, createdAt: r.createdAt, updatedAt: r.updatedAt }))
        });
    } catch (error) {
        console.error('Get records error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching records.',
            error: (error as Error).message
        });
    }
});

// @route   POST /api/v1/:projectToken/:moduleName
// @desc    Create a new record
// @access  Public (with valid API token)
router.post('/:projectToken/:moduleName', async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { moduleName } = req.params;

        // Find the module
        const module = await Module.findOne({ slug: moduleName });
        if (!module) {
            res.status(404).json({
                success: false,
                message: `Module '${moduleName}' not found.`
            });
            return;
        }

        // Check if module is enabled
        const projectModule = await ProjectModule.findOne({
            projectId: req.project!._id,
            moduleId: module._id
        });

        if (!projectModule) {
            res.status(403).json({
                success: false,
                message: `Module '${moduleName}' is not enabled for this project.`
            });
            return;
        }

        // Validate data against schema
        const validation = validateDataAgainstSchema(req.body, module.schema);
        if (!validation.isValid) {
            res.status(400).json({
                success: false,
                message: 'Validation failed.',
                errors: validation.errors
            });
            return;
        }

        // Create record
        const record = await DynamicData.create({
            projectId: req.project!._id,
            moduleId: module._id,
            data: req.body
        });

        res.status(201).json({
            success: true,
            message: 'Record created successfully.',
            data: { id: record._id, ...record.data, createdAt: record.createdAt, updatedAt: record.updatedAt }
        });
    } catch (error) {
        console.error('Create record error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating record.',
            error: (error as Error).message
        });
    }
});

// @route   GET /api/v1/:projectToken/:moduleName/:id
// @desc    Get a single record
// @access  Public (with valid API token)
router.get('/:projectToken/:moduleName/:id', async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { moduleName, id } = req.params;

        // Find the module
        const module = await Module.findOne({ slug: moduleName });
        if (!module) {
            res.status(404).json({
                success: false,
                message: `Module '${moduleName}' not found.`
            });
            return;
        }

        // Get the record
        const record = await DynamicData.findOne({
            _id: id,
            projectId: req.project!._id,
            moduleId: module._id
        });

        if (!record) {
            res.status(404).json({
                success: false,
                message: 'Record not found.'
            });
            return;
        }

        res.status(200).json({
            success: true,
            data: { id: record._id, ...record.data, createdAt: record.createdAt, updatedAt: record.updatedAt }
        });
    } catch (error) {
        console.error('Get record error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching record.',
            error: (error as Error).message
        });
    }
});

// @route   PUT /api/v1/:projectToken/:moduleName/:id
// @desc    Update a record
// @access  Public (with valid API token)
router.put('/:projectToken/:moduleName/:id', async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { moduleName, id } = req.params;

        // Find the module
        const module = await Module.findOne({ slug: moduleName });
        if (!module) {
            res.status(404).json({
                success: false,
                message: `Module '${moduleName}' not found.`
            });
            return;
        }

        // Validate data against schema
        const validation = validateDataAgainstSchema(req.body, module.schema);
        if (!validation.isValid) {
            res.status(400).json({
                success: false,
                message: 'Validation failed.',
                errors: validation.errors
            });
            return;
        }

        // Update record
        const record = await DynamicData.findOneAndUpdate(
            {
                _id: id,
                projectId: req.project!._id,
                moduleId: module._id
            },
            { data: req.body },
            { new: true, runValidators: true }
        );

        if (!record) {
            res.status(404).json({
                success: false,
                message: 'Record not found.'
            });
            return;
        }

        res.status(200).json({
            success: true,
            message: 'Record updated successfully.',
            data: { id: record._id, ...record.data, createdAt: record.createdAt, updatedAt: record.updatedAt }
        });
    } catch (error) {
        console.error('Update record error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating record.',
            error: (error as Error).message
        });
    }
});

// @route   DELETE /api/v1/:projectToken/:moduleName/:id
// @desc    Delete a record
// @access  Public (with valid API token)
router.delete('/:projectToken/:moduleName/:id', async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { moduleName, id } = req.params;

        // Find the module
        const module = await Module.findOne({ slug: moduleName });
        if (!module) {
            res.status(404).json({
                success: false,
                message: `Module '${moduleName}' not found.`
            });
            return;
        }

        // Delete record
        const record = await DynamicData.findOneAndDelete({
            _id: id,
            projectId: req.project!._id,
            moduleId: module._id
        });

        if (!record) {
            res.status(404).json({
                success: false,
                message: 'Record not found.'
            });
            return;
        }

        res.status(200).json({
            success: true,
            message: 'Record deleted successfully.'
        });
    } catch (error) {
        console.error('Delete record error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting record.',
            error: (error as Error).message
        });
    }
});

export default router;

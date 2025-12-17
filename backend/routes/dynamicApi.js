import express from 'express';
import { DynamicData, Module, ProjectModule } from '../models/index.js';
import { authenticateApiToken } from '../middleware/auth.js';
import { validateDataAgainstSchema } from '../services/moduleDefinitions.js';

const router = express.Router();

// All dynamic API routes require API token authentication
router.use('/:projectToken/:moduleName*', authenticateApiToken);

// @route   GET /api/v1/:projectToken/:moduleName
// @desc    Get all records for a module
// @access  Public (with valid API token)
router.get('/:projectToken/:moduleName', async (req, res) => {
    try {
        const { moduleName } = req.params;

        // Find the module by slug
        const module = await Module.findOne({ slug: moduleName });
        if (!module) {
            return res.status(404).json({
                success: false,
                message: `Module '${moduleName}' not found.`
            });
        }

        // Check if module is enabled for this project
        const projectModule = await ProjectModule.findOne({
            projectId: req.project._id,
            moduleId: module._id
        });

        if (!projectModule) {
            return res.status(403).json({
                success: false,
                message: `Module '${moduleName}' is not enabled for this project.`
            });
        }

        // Get all data for this module
        const records = await DynamicData.find({
            projectId: req.project._id,
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
            error: error.message
        });
    }
});

// @route   POST /api/v1/:projectToken/:moduleName
// @desc    Create a new record
// @access  Public (with valid API token)
router.post('/:projectToken/:moduleName', async (req, res) => {
    try {
        const { moduleName } = req.params;

        // Find the module
        const module = await Module.findOne({ slug: moduleName });
        if (!module) {
            return res.status(404).json({
                success: false,
                message: `Module '${moduleName}' not found.`
            });
        }

        // Check if module is enabled
        const projectModule = await ProjectModule.findOne({
            projectId: req.project._id,
            moduleId: module._id
        });

        if (!projectModule) {
            return res.status(403).json({
                success: false,
                message: `Module '${moduleName}' is not enabled for this project.`
            });
        }

        // Validate data against schema
        const validation = validateDataAgainstSchema(req.body, module.schema);
        if (!validation.isValid) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed.',
                errors: validation.errors
            });
        }

        // Create record
        const record = await DynamicData.create({
            projectId: req.project._id,
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
            error: error.message
        });
    }
});

// @route   GET /api/v1/:projectToken/:moduleName/:id
// @desc    Get a single record
// @access  Public (with valid API token)
router.get('/:projectToken/:moduleName/:id', async (req, res) => {
    try {
        const { moduleName, id } = req.params;

        // Find the module
        const module = await Module.findOne({ slug: moduleName });
        if (!module) {
            return res.status(404).json({
                success: false,
                message: `Module '${moduleName}' not found.`
            });
        }

        // Get the record
        const record = await DynamicData.findOne({
            _id: id,
            projectId: req.project._id,
            moduleId: module._id
        });

        if (!record) {
            return res.status(404).json({
                success: false,
                message: 'Record not found.'
            });
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
            error: error.message
        });
    }
});

// @route   PUT /api/v1/:projectToken/:moduleName/:id
// @desc    Update a record
// @access  Public (with valid API token)
router.put('/:projectToken/:moduleName/:id', async (req, res) => {
    try {
        const { moduleName, id } = req.params;

        // Find the module
        const module = await Module.findOne({ slug: moduleName });
        if (!module) {
            return res.status(404).json({
                success: false,
                message: `Module '${moduleName}' not found.`
            });
        }

        // Validate data against schema
        const validation = validateDataAgainstSchema(req.body, module.schema);
        if (!validation.isValid) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed.',
                errors: validation.errors
            });
        }

        // Update record
        const record = await DynamicData.findOneAndUpdate(
            {
                _id: id,
                projectId: req.project._id,
                moduleId: module._id
            },
            { data: req.body },
            { new: true, runValidators: true }
        );

        if (!record) {
            return res.status(404).json({
                success: false,
                message: 'Record not found.'
            });
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
            error: error.message
        });
    }
});

// @route   DELETE /api/v1/:projectToken/:moduleName/:id
// @desc    Delete a record
// @access  Public (with valid API token)
router.delete('/:projectToken/:moduleName/:id', async (req, res) => {
    try {
        const { moduleName, id } = req.params;

        // Find the module
        const module = await Module.findOne({ slug: moduleName });
        if (!module) {
            return res.status(404).json({
                success: false,
                message: `Module '${moduleName}' not found.`
            });
        }

        // Delete record
        const record = await DynamicData.findOneAndDelete({
            _id: id,
            projectId: req.project._id,
            moduleId: module._id
        });

        if (!record) {
            return res.status(404).json({
                success: false,
                message: 'Record not found.'
            });
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
            error: error.message
        });
    }
});

export default router;

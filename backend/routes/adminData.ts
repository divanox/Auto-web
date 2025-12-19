import express, { Router, Response } from 'express';
import { DynamicData } from '../models/index.js';
import { authenticateUser, authorizeProjectOwner, AuthRequest } from '../middleware/auth.js';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const router: Router = express.Router();

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, '../../uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif|webp/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'));
        }
    }
});

// All routes require authentication
router.use(authenticateUser);

// @route   GET /api/projects/:projectId/admin/data/:dataType
// @desc    Get all items of a specific data type
// @access  Private (owner only)
router.get('/projects/:projectId/admin/data/:dataType', authorizeProjectOwner, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { projectId, dataType } = req.params;

        const items = await DynamicData.find({
            projectId,
            'data.dataType': dataType
        }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: items.length,
            data: { items }
        });
    } catch (error) {
        console.error('Get admin data error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching data.',
            error: (error as Error).message
        });
    }
});

// @route   GET /api/projects/:projectId/admin/data/:dataType/:itemId
// @desc    Get a single item
// @access  Private (owner only)
router.get('/projects/:projectId/admin/data/:dataType/:itemId', authorizeProjectOwner, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { projectId, itemId } = req.params;

        const item = await DynamicData.findOne({
            _id: itemId,
            projectId
        });

        if (!item) {
            res.status(404).json({
                success: false,
                message: 'Item not found.'
            });
            return;
        }

        res.status(200).json({
            success: true,
            data: { item }
        });
    } catch (error) {
        console.error('Get admin data item error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching item.',
            error: (error as Error).message
        });
    }
});

// @route   POST /api/projects/:projectId/admin/data/:dataType
// @desc    Create a new item
// @access  Private (owner only)
router.post('/projects/:projectId/admin/data/:dataType', authorizeProjectOwner, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { projectId, dataType } = req.params;
        const itemData = req.body;

        // Add dataType to the data object
        const data = {
            ...itemData,
            dataType
        };

        const item = await DynamicData.create({
            projectId,
            moduleId: null, // Not tied to a specific module
            data
        });

        res.status(201).json({
            success: true,
            message: 'Item created successfully.',
            data: { item }
        });
    } catch (error) {
        console.error('Create admin data error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating item.',
            error: (error as Error).message
        });
    }
});

// @route   PUT /api/projects/:projectId/admin/data/:dataType/:itemId
// @desc    Update an item
// @access  Private (owner only)
router.put('/projects/:projectId/admin/data/:dataType/:itemId', authorizeProjectOwner, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { projectId, dataType, itemId } = req.params;
        const itemData = req.body;

        const item = await DynamicData.findOne({
            _id: itemId,
            projectId
        });

        if (!item) {
            res.status(404).json({
                success: false,
                message: 'Item not found.'
            });
            return;
        }

        // Update data while preserving dataType
        item.data = {
            ...itemData,
            dataType
        };

        await item.save();

        res.status(200).json({
            success: true,
            message: 'Item updated successfully.',
            data: { item }
        });
    } catch (error) {
        console.error('Update admin data error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating item.',
            error: (error as Error).message
        });
    }
});

// @route   DELETE /api/projects/:projectId/admin/data/:dataType/:itemId
// @desc    Delete an item
// @access  Private (owner only)
router.delete('/projects/:projectId/admin/data/:dataType/:itemId', authorizeProjectOwner, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { projectId, itemId } = req.params;

        const item = await DynamicData.findOneAndDelete({
            _id: itemId,
            projectId
        });

        if (!item) {
            res.status(404).json({
                success: false,
                message: 'Item not found.'
            });
            return;
        }

        res.status(200).json({
            success: true,
            message: 'Item deleted successfully.'
        });
    } catch (error) {
        console.error('Delete admin data error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting item.',
            error: (error as Error).message
        });
    }
});

// @route   POST /api/projects/:projectId/admin/upload
// @desc    Upload an image
// @access  Private (owner only)
router.post('/projects/:projectId/admin/upload', authorizeProjectOwner, upload.single('image'), async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        if (!req.file) {
            res.status(400).json({
                success: false,
                message: 'No file uploaded.'
            });
            return;
        }

        const imageUrl = `/uploads/${req.file.filename}`;

        res.status(200).json({
            success: true,
            message: 'Image uploaded successfully.',
            data: {
                url: imageUrl,
                filename: req.file.filename,
                size: req.file.size
            }
        });
    } catch (error) {
        console.error('Upload image error:', error);
        res.status(500).json({
            success: false,
            message: 'Error uploading image.',
            error: (error as Error).message
        });
    }
});

export default router;

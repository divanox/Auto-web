import express, { Router, Response } from 'express';
import { Page } from '../models/index.js';
import { authenticateUser, authorizeProjectOwner, AuthRequest } from '../middleware/auth.js';

const router: Router = express.Router();

// All routes require authentication
router.use(authenticateUser);

// @route   GET /api/projects/:projectId/pages
// @desc    Get all pages for a project
// @access  Private (owner only)
router.get('/projects/:projectId/pages', authorizeProjectOwner, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const pages = await Page.find({ projectId: req.params.projectId }).sort({ order: 1 });

        res.status(200).json({
            success: true,
            count: pages.length,
            data: { pages }
        });
    } catch (error) {
        console.error('Get pages error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching pages.',
            error: (error as Error).message
        });
    }
});

// @route   POST /api/projects/:projectId/pages
// @desc    Create a new page
// @access  Private (owner only)
router.post('/projects/:projectId/pages', authorizeProjectOwner, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { name, slug, isHomePage, seoTitle, seoDescription, seoKeywords } = req.body;

        if (!name || !slug) {
            res.status(400).json({
                success: false,
                message: 'Name and slug are required.'
            });
            return;
        }

        // Get the highest order number
        const lastPage = await Page.findOne({ projectId: req.params.projectId }).sort({ order: -1 });
        const order = lastPage ? lastPage.order + 1 : 0;

        const page = await Page.create({
            projectId: req.params.projectId,
            name,
            slug,
            isHomePage: isHomePage || false,
            order,
            seoTitle: seoTitle || name,
            seoDescription: seoDescription || '',
            seoKeywords: seoKeywords || ''
        });

        res.status(201).json({
            success: true,
            message: 'Page created successfully.',
            data: { page }
        });
    } catch (error) {
        console.error('Create page error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating page.',
            error: (error as Error).message
        });
    }
});

// @route   GET /api/projects/:projectId/pages/:pageId
// @desc    Get a single page
// @access  Private (owner only)
router.get('/projects/:projectId/pages/:pageId', authorizeProjectOwner, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const page = await Page.findOne({
            _id: req.params.pageId,
            projectId: req.params.projectId
        });

        if (!page) {
            res.status(404).json({
                success: false,
                message: 'Page not found.'
            });
            return;
        }

        res.status(200).json({
            success: true,
            data: { page }
        });
    } catch (error) {
        console.error('Get page error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching page.',
            error: (error as Error).message
        });
    }
});

// @route   PUT /api/projects/:projectId/pages/:pageId
// @desc    Update a page
// @access  Private (owner only)
router.put('/projects/:projectId/pages/:pageId', authorizeProjectOwner, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { name, slug, isHomePage, isPublished, seoTitle, seoDescription, seoKeywords } = req.body;

        const page = await Page.findOne({
            _id: req.params.pageId,
            projectId: req.params.projectId
        });

        if (!page) {
            res.status(404).json({
                success: false,
                message: 'Page not found.'
            });
            return;
        }

        if (name !== undefined) page.name = name;
        if (slug !== undefined) page.slug = slug;
        if (isHomePage !== undefined) page.isHomePage = isHomePage;
        if (isPublished !== undefined) page.isPublished = isPublished;
        if (seoTitle !== undefined) page.seoTitle = seoTitle;
        if (seoDescription !== undefined) page.seoDescription = seoDescription;
        if (seoKeywords !== undefined) page.seoKeywords = seoKeywords;

        await page.save();

        res.status(200).json({
            success: true,
            message: 'Page updated successfully.',
            data: { page }
        });
    } catch (error) {
        console.error('Update page error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating page.',
            error: (error as Error).message
        });
    }
});

// @route   DELETE /api/projects/:projectId/pages/:pageId
// @desc    Delete a page
// @access  Private (owner only)
router.delete('/projects/:projectId/pages/:pageId', authorizeProjectOwner, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const page = await Page.findOneAndDelete({
            _id: req.params.pageId,
            projectId: req.params.projectId
        });

        if (!page) {
            res.status(404).json({
                success: false,
                message: 'Page not found.'
            });
            return;
        }

        res.status(200).json({
            success: true,
            message: 'Page deleted successfully.'
        });
    } catch (error) {
        console.error('Delete page error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting page.',
            error: (error as Error).message
        });
    }
});

// @route   PUT /api/projects/:projectId/pages/reorder
// @desc    Reorder pages
// @access  Private (owner only)
router.put('/projects/:projectId/pages/reorder', authorizeProjectOwner, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { pageIds } = req.body;

        if (!Array.isArray(pageIds)) {
            res.status(400).json({
                success: false,
                message: 'pageIds must be an array.'
            });
            return;
        }

        // Update order for each page
        const updatePromises = pageIds.map((id, index) =>
            Page.findOneAndUpdate(
                { _id: id, projectId: req.params.projectId },
                { order: index },
                { new: true }
            )
        );

        await Promise.all(updatePromises);

        const pages = await Page.find({ projectId: req.params.projectId }).sort({ order: 1 });

        res.status(200).json({
            success: true,
            message: 'Pages reordered successfully.',
            data: { pages }
        });
    } catch (error) {
        console.error('Reorder pages error:', error);
        res.status(500).json({
            success: false,
            message: 'Error reordering pages.',
            error: (error as Error).message
        });
    }
});

export default router;

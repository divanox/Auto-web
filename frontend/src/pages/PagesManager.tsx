import { useState, useEffect, FormEvent } from 'react';
import { useParams, Link } from 'react-router-dom';
import { pagesAPI, Page } from '../services/api';
import Layout from '../components/Layout';
import { ArrowLeft, Plus, Edit, Trash2, Home, Eye, EyeOff, GripVertical } from 'lucide-react';

const PagesManager = () => {
    const { id } = useParams<{ id: string }>();
    const [pages, setPages] = useState<Page[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingPage, setEditingPage] = useState<Page | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        isHomePage: false,
        seoTitle: '',
        seoDescription: '',
        seoKeywords: ''
    });

    useEffect(() => {
        if (id) {
            fetchPages();
        }
    }, [id]);

    const fetchPages = async () => {
        if (!id) return;

        try {
            const response = await pagesAPI.getAll(id);
            setPages(response.data.data.pages);
        } catch (error) {
            console.error('Error fetching pages:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (page?: Page) => {
        if (page) {
            setEditingPage(page);
            setFormData({
                name: page.name,
                slug: page.slug,
                isHomePage: page.isHomePage,
                seoTitle: page.seoTitle,
                seoDescription: page.seoDescription,
                seoKeywords: page.seoKeywords
            });
        } else {
            setEditingPage(null);
            setFormData({
                name: '',
                slug: '',
                isHomePage: false,
                seoTitle: '',
                seoDescription: '',
                seoKeywords: ''
            });
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingPage(null);
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!id) return;

        try {
            if (editingPage) {
                await pagesAPI.update(id, editingPage._id, formData);
            } else {
                await pagesAPI.create(id, formData);
            }
            handleCloseModal();
            fetchPages();
        } catch (error) {
            console.error('Error saving page:', error);
            alert('Failed to save page');
        }
    };

    const handleDelete = async (pageId: string) => {
        if (!id) return;
        if (!confirm('Are you sure you want to delete this page?')) return;

        try {
            await pagesAPI.delete(id, pageId);
            fetchPages();
        } catch (error) {
            console.error('Error deleting page:', error);
            alert('Failed to delete page');
        }
    };

    const handleTogglePublish = async (page: Page) => {
        if (!id) return;

        try {
            await pagesAPI.update(id, page._id, { isPublished: !page.isPublished });
            fetchPages();
        } catch (error) {
            console.error('Error toggling publish:', error);
            alert('Failed to update page');
        }
    };

    const generateSlug = (name: string) => {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    };

    if (loading) {
        return (
            <Layout>
                <div className="flex justify-center items-center min-h-[60vh]">
                    <div className="spinner"></div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="max-w-7xl mx-auto animate-fade-in">
                {/* Header */}
                <div className="mb-8">
                    <Link to={`/projects/${id}`} className="text-gray-600 hover:text-gray-800 mb-4 inline-block">
                        ← Back to Project
                    </Link>
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-4xl font-bold text-gray-800 mb-2">Pages</h1>
                            <p className="text-gray-600">Manage your website pages</p>
                        </div>
                        <button
                            onClick={() => handleOpenModal()}
                            className="flex items-center gap-2 bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all"
                        >
                            <Plus className="w-5 h-5" />
                            New Page
                        </button>
                    </div>
                </div>

                {/* Pages List */}
                {pages.length === 0 ? (
                    <div className="glass rounded-2xl p-12 text-center">
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">No pages yet</h3>
                        <p className="text-gray-600 mb-6">Create your first page to get started</p>
                        <button
                            onClick={() => handleOpenModal()}
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all"
                        >
                            <Plus className="w-5 h-5" />
                            Create Page
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {pages.map((page) => (
                            <div key={page._id} className="glass rounded-2xl p-6 card-hover">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4 flex-1">
                                        <GripVertical className="w-5 h-5 text-gray-400 cursor-move" />
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="text-lg font-bold text-gray-800">{page.name}</h3>
                                                {page.isHomePage && (
                                                    <span className="bg-primary-100 text-primary-700 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                                                        <Home className="w-3 h-3" />
                                                        Home
                                                    </span>
                                                )}
                                                {!page.isPublished && (
                                                    <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                                                        Draft
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-sm text-gray-600">/{page.slug}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleTogglePublish(page)}
                                            className="p-2 text-gray-600 hover:text-primary-600 transition-colors"
                                            title={page.isPublished ? 'Unpublish' : 'Publish'}
                                        >
                                            {page.isPublished ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                                        </button>
                                        <Link
                                            to={`/projects/${id}/pages/${page._id}/components`}
                                            className="px-4 py-2 bg-white/50 hover:bg-white text-gray-700 rounded-lg transition-all text-sm"
                                        >
                                            Manage Components
                                        </Link>
                                        <button
                                            onClick={() => handleOpenModal(page)}
                                            className="p-2 text-gray-600 hover:text-primary-600 transition-colors"
                                        >
                                            <Edit className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(page._id)}
                                            className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Create/Edit Modal */}
                {showModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fade-in">
                        <div className="glass rounded-2xl p-8 max-w-2xl w-full animate-scale-in max-h-[90vh] overflow-y-auto">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">
                                {editingPage ? 'Edit Page' : 'Create New Page'}
                            </h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Page Name *
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => {
                                                setFormData({ ...formData, name: e.target.value });
                                                if (!editingPage) {
                                                    setFormData(prev => ({ ...prev, slug: generateSlug(e.target.value) }));
                                                }
                                            }}
                                            required
                                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none"
                                            placeholder="Home"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            URL Slug *
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.slug}
                                            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                            required
                                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none"
                                            placeholder="home"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={formData.isHomePage}
                                            onChange={(e) => setFormData({ ...formData, isHomePage: e.target.checked })}
                                            className="w-5 h-5 text-primary-600 rounded"
                                        />
                                        <span className="text-sm font-medium text-gray-700">Set as home page</span>
                                    </label>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        SEO Title
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.seoTitle}
                                        onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none"
                                        placeholder="Page title for search engines"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        SEO Description
                                    </label>
                                    <textarea
                                        value={formData.seoDescription}
                                        onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
                                        rows={3}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none resize-none"
                                        placeholder="Brief description for search engines"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        SEO Keywords
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.seoKeywords}
                                        onChange={(e) => setFormData({ ...formData, seoKeywords: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none"
                                        placeholder="keyword1, keyword2, keyword3"
                                    />
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={handleCloseModal}
                                        className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 px-4 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-xl hover:shadow-lg transition-all"
                                    >
                                        {editingPage ? 'Update Page' : 'Create Page'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default PagesManager;

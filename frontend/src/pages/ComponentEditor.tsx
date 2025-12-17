import { useState, useEffect, FormEvent } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { projectComponentsAPI, ProjectComponent } from '../services/api';
import Layout from '../components/Layout';
import { ArrowLeft, Save, Eye, Palette, FileText, Trash2 } from 'lucide-react';

const ComponentEditor = () => {
    const { id, componentId } = useParams<{ id: string; componentId: string }>();
    const navigate = useNavigate();
    const [component, setComponent] = useState<ProjectComponent | null>(null);
    const [content, setContent] = useState<Record<string, any>>({});
    const [configuration, setConfiguration] = useState<Record<string, any>>({});
    const [activeTab, setActiveTab] = useState<'content' | 'design'>('content');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (id && componentId) {
            fetchComponent();
        }
    }, [id, componentId]);

    const fetchComponent = async () => {
        if (!id || !componentId) return;

        try {
            const response = await projectComponentsAPI.getAll(id);
            const comp = response.data.data.components.find((c: ProjectComponent) => c._id === componentId);

            if (comp) {
                setComponent(comp);
                setContent(comp.content || {});
                setConfiguration(comp.configuration || {});
            }
        } catch (error) {
            console.error('Error fetching component:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e: FormEvent) => {
        e.preventDefault();
        if (!id || !componentId) return;

        setSaving(true);
        try {
            await projectComponentsAPI.update(id, componentId, {
                content,
                configuration
            });
            alert('Component saved successfully!');
        } catch (error) {
            console.error('Error saving component:', error);
            alert('Failed to save component');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!id || !componentId) return;
        if (!confirm('Are you sure you want to delete this component?')) return;

        try {
            await projectComponentsAPI.delete(id, componentId);
            navigate(`/projects/${id}/components`);
        } catch (error) {
            console.error('Error deleting component:', error);
            alert('Failed to delete component');
        }
    };

    const handleContentChange = (fieldName: string, value: any) => {
        setContent(prev => ({ ...prev, [fieldName]: value }));
    };

    const handleColorChange = (colorKey: string, value: string) => {
        setConfiguration(prev => ({
            ...prev,
            colors: {
                ...(prev.colors || {}),
                [colorKey]: value
            }
        }));
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

    if (!component) {
        return (
            <Layout>
                <div className="text-center py-12">
                    <p className="text-gray-600">Component not found</p>
                    <Link to={`/projects/${id}/components`} className="text-primary-600 hover:text-primary-700 mt-4 inline-block">
                        ← Back to Components
                    </Link>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="max-w-5xl mx-auto animate-fade-in">
                {/* Header */}
                <div className="mb-8">
                    <Link to={`/projects/${id}/components`} className="text-gray-600 hover:text-gray-800 mb-4 inline-flex items-center gap-2">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Components
                    </Link>
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-4xl font-bold text-gray-800 mb-2">
                                Edit {component.templateId.name}
                            </h1>
                            <p className="text-gray-600">{component.templateId.description}</p>
                        </div>
                        <button
                            onClick={handleDelete}
                            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
                        >
                            <Trash2 className="w-4 h-4" />
                            Delete
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="glass rounded-2xl p-2 mb-6 flex gap-2">
                    <button
                        onClick={() => setActiveTab('content')}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl transition-all ${activeTab === 'content'
                                ? 'bg-white shadow-lg text-primary-600'
                                : 'text-gray-600 hover:bg-white/50'
                            }`}
                    >
                        <FileText className="w-5 h-5" />
                        Content
                    </button>
                    <button
                        onClick={() => setActiveTab('design')}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl transition-all ${activeTab === 'design'
                                ? 'bg-white shadow-lg text-primary-600'
                                : 'text-gray-600 hover:bg-white/50'
                            }`}
                    >
                        <Palette className="w-5 h-5" />
                        Design
                    </button>
                </div>

                {/* Editor Form */}
                <form onSubmit={handleSave}>
                    <div className="glass rounded-2xl p-8 mb-6">
                        {activeTab === 'content' && (
                            <div className="space-y-6">
                                <h2 className="text-xl font-bold text-gray-800 mb-4">Component Content</h2>

                                {component.templateId.fieldSchema.fields.map((field) => (
                                    <div key={field.name}>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            {field.label}
                                            {field.required && <span className="text-red-500 ml-1">*</span>}
                                        </label>

                                        {field.type === 'text' && (
                                            <input
                                                type="text"
                                                value={content[field.name] || ''}
                                                onChange={(e) => handleContentChange(field.name, e.target.value)}
                                                placeholder={field.placeholder}
                                                required={field.required}
                                                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none"
                                            />
                                        )}

                                        {field.type === 'textarea' && (
                                            <textarea
                                                value={content[field.name] || ''}
                                                onChange={(e) => handleContentChange(field.name, e.target.value)}
                                                placeholder={field.placeholder}
                                                required={field.required}
                                                rows={4}
                                                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none resize-none"
                                            />
                                        )}

                                        {field.type === 'url' && (
                                            <input
                                                type="url"
                                                value={content[field.name] || ''}
                                                onChange={(e) => handleContentChange(field.name, e.target.value)}
                                                placeholder={field.placeholder}
                                                required={field.required}
                                                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none"
                                            />
                                        )}

                                        {field.type === 'boolean' && (
                                            <label className="flex items-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    checked={content[field.name] || false}
                                                    onChange={(e) => handleContentChange(field.name, e.target.checked)}
                                                    className="w-5 h-5 text-primary-600 rounded"
                                                />
                                                <span className="text-sm text-gray-600">Enable this option</span>
                                            </label>
                                        )}

                                        {field.type === 'select' && field.options && (
                                            <select
                                                value={content[field.name] || ''}
                                                onChange={(e) => handleContentChange(field.name, e.target.value)}
                                                required={field.required}
                                                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none"
                                            >
                                                <option value="">Select...</option>
                                                {field.options.map(option => (
                                                    <option key={option} value={option}>{option}</option>
                                                ))}
                                            </select>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        {activeTab === 'design' && (
                            <div className="space-y-6">
                                <h2 className="text-xl font-bold text-gray-800 mb-4">Design Customization</h2>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Primary Color
                                    </label>
                                    <input
                                        type="color"
                                        value={configuration.colors?.primary || '#0ea5e9'}
                                        onChange={(e) => handleColorChange('primary', e.target.value)}
                                        className="w-full h-12 rounded-xl border border-gray-300 cursor-pointer"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Secondary Color
                                    </label>
                                    <input
                                        type="color"
                                        value={configuration.colors?.secondary || '#d946ef'}
                                        onChange={(e) => handleColorChange('secondary', e.target.value)}
                                        className="w-full h-12 rounded-xl border border-gray-300 cursor-pointer"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Background Color
                                    </label>
                                    <input
                                        type="color"
                                        value={configuration.colors?.background || '#ffffff'}
                                        onChange={(e) => handleColorChange('background', e.target.value)}
                                        className="w-full h-12 rounded-xl border border-gray-300 cursor-pointer"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Text Color
                                    </label>
                                    <input
                                        type="color"
                                        value={configuration.colors?.text || '#1e293b'}
                                        onChange={(e) => handleColorChange('text', e.target.value)}
                                        className="w-full h-12 rounded-xl border border-gray-300 cursor-pointer"
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-4">
                        <button
                            type="submit"
                            disabled={saving}
                            className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-primary-500 to-secondary-500 text-white py-3 px-6 rounded-xl hover:shadow-lg transition-all disabled:opacity-50"
                        >
                            <Save className="w-5 h-5" />
                            {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                        <Link
                            to={`/projects/${id}/preview`}
                            className="flex items-center justify-center gap-2 bg-white text-gray-700 py-3 px-6 rounded-xl border-2 border-gray-300 hover:border-primary-500 transition-all"
                        >
                            <Eye className="w-5 h-5" />
                            Preview
                        </Link>
                    </div>
                </form>
            </div>
        </Layout>
    );
};

export default ComponentEditor;

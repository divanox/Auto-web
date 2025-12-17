import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { componentTemplatesAPI, projectComponentsAPI, ComponentTemplate, ProjectComponent } from '../services/api';
import Layout from '../components/Layout';
import { Plus, Sparkles, Grid3x3, Mail, Info, MessageSquare, DollarSign, LayoutIcon } from 'lucide-react';

const iconMap: Record<string, any> = {
    Sparkles,
    Grid3x3,
    Mail,
    Info,
    MessageSquare,
    DollarSign,
    Layout: LayoutIcon,
};

const ComponentLibrary = () => {
    const { id } = useParams<{ id: string }>();
    const [templates, setTemplates] = useState<ComponentTemplate[]>([]);
    const [projectComponents, setProjectComponents] = useState<ProjectComponent[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            fetchData();
        }
    }, [id]);

    const fetchData = async () => {
        if (!id) return;

        try {
            const [templatesRes, componentsRes] = await Promise.all([
                componentTemplatesAPI.getAll(),
                projectComponentsAPI.getAll(id)
            ]);

            setTemplates(templatesRes.data.data.templates);
            setProjectComponents(componentsRes.data.data.components);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddComponent = async (templateId: string) => {
        if (!id) return;

        try {
            await projectComponentsAPI.create(id, { templateId });
            fetchData();
        } catch (error) {
            console.error('Error adding component:', error);
            alert('Failed to add component');
        }
    };

    const getAddedCount = (templateId: string) => {
        return projectComponents.filter(c => c.templateId._id === templateId).length;
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

    const categories = Array.from(new Set(templates.map(t => t.category)));

    return (
        <Layout>
            <div className="max-w-7xl mx-auto animate-fade-in">
                {/* Header */}
                <div className="mb-8">
                    <Link to={`/projects/${id}`} className="text-gray-600 hover:text-gray-800 mb-4 inline-block">
                        ← Back to Project
                    </Link>
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">Component Library</h1>
                    <p className="text-gray-600">Choose components to build your website</p>
                </div>

                {/* Categories */}
                {categories.map((category) => {
                    const categoryTemplates = templates.filter(t => t.category === category);

                    return (
                        <div key={category} className="mb-12">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6 capitalize">{category} Components</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {categoryTemplates.map((template) => {
                                    const Icon = iconMap[template.icon] || Sparkles;
                                    const addedCount = getAddedCount(template._id);

                                    return (
                                        <div
                                            key={template._id}
                                            className="glass rounded-2xl p-6 card-hover"
                                        >
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center">
                                                    <Icon className="w-6 h-6 text-white" />
                                                </div>
                                                {addedCount > 0 && (
                                                    <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
                                                        {addedCount} added
                                                    </span>
                                                )}
                                            </div>

                                            <h3 className="text-lg font-bold text-gray-800 mb-2">{template.name}</h3>
                                            <p className="text-sm text-gray-600 mb-4">{template.description}</p>

                                            <button
                                                onClick={() => handleAddComponent(template._id)}
                                                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-primary-500 to-secondary-500 text-white py-2 px-4 rounded-lg hover:shadow-lg transition-all"
                                            >
                                                <Plus className="w-4 h-4" />
                                                Add Component
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}

                {/* Active Components Summary */}
                {projectComponents.length > 0 && (
                    <div className="glass rounded-2xl p-6 mt-8">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">
                            Active Components ({projectComponents.length})
                        </h2>
                        <div className="flex flex-wrap gap-2">
                            {projectComponents.map((component) => (
                                <Link
                                    key={component._id}
                                    to={`/projects/${id}/components/${component._id}/edit`}
                                    className="bg-white/50 px-4 py-2 rounded-lg hover:bg-white transition-all text-sm"
                                >
                                    {component.templateId.name}
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default ComponentLibrary;

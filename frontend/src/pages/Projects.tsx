import { useState, useEffect, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { projectsAPI, Project } from '../services/api';
import Layout from '../components/Layout';
import {
    Plus,
    FolderKanban,
    Trash2,
    ExternalLink,
    Copy,
    Check
} from 'lucide-react';

const Projects = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [newProject, setNewProject] = useState({ name: '', description: '', projectType: 'website' as 'api' | 'website' });
    const [copiedToken, setCopiedToken] = useState<string | null>(null);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const response = await projectsAPI.getAll();
            setProjects(response.data.data.projects);
        } catch (error) {
            console.error('Error fetching projects:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateProject = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await projectsAPI.create(newProject);
            setShowModal(false);
            setNewProject({ name: '', description: '', projectType: 'website' });
            fetchProjects();
        } catch (error) {
            console.error('Error creating project:', error);
            alert('Failed to create project');
        }
    };

    const handleDeleteProject = async (id: string) => {
        if (!confirm('Are you sure you want to delete this project?')) return;

        try {
            await projectsAPI.delete(id);
            fetchProjects();
        } catch (error) {
            console.error('Error deleting project:', error);
            alert('Failed to delete project');
        }
    };

    const copyToClipboard = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopiedToken(id);
        setTimeout(() => setCopiedToken(null), 2000);
    };

    return (
        <Layout>
            <div className="max-w-7xl mx-auto animate-fade-in">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-800 mb-2">Projects</h1>
                        <p className="text-gray-600">Manage your API projects and websites</p>
                    </div>
                    <button
                        onClick={() => setShowModal(true)}
                        className="flex items-center gap-2 bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-6 py-3 rounded-xl hover:shadow-lg hover:scale-105 transition-all"
                    >
                        <Plus className="w-5 h-5" />
                        New Project
                    </button>
                </div>

                {/* Projects Grid */}
                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="spinner"></div>
                    </div>
                ) : projects.length === 0 ? (
                    <div className="glass rounded-2xl p-12 text-center">
                        <FolderKanban className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">No projects yet</h3>
                        <p className="text-gray-600 mb-6">Create your first project to get started</p>
                        <button
                            onClick={() => setShowModal(true)}
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-6 py-3 rounded-xl hover:shadow-lg hover:scale-105 transition-all"
                        >
                            <Plus className="w-5 h-5" />
                            Create Project
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {projects.map((project, index) => (
                            <div
                                key={project._id}
                                className="glass rounded-2xl p-6 card-hover animate-slide-up"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center mb-2">
                                            <FolderKanban className="w-6 h-6 text-white" />
                                        </div>
                                        <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-full">
                                            {project.projectType === 'website' ? '🌐 Website' : '🔌 API'}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => handleDeleteProject(project._id)}
                                        className="text-gray-400 hover:text-red-500 transition-colors"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>

                                <h3 className="text-lg font-bold text-gray-800 mb-2">{project.name}</h3>
                                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                                    {project.description || 'No description'}
                                </p>

                                {project.projectType === 'api' && (
                                    <div className="space-y-2 mb-4">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-gray-500">API Token:</span>
                                            <code className="text-xs bg-gray-100 px-2 py-1 rounded flex-1 truncate">
                                                {project.apiToken.substring(0, 20)}...
                                            </code>
                                            <button
                                                onClick={() => copyToClipboard(project.apiToken, project._id)}
                                                className="text-gray-400 hover:text-primary-500 transition-colors"
                                            >
                                                {copiedToken === project._id ? (
                                                    <Check className="w-4 h-4 text-green-500" />
                                                ) : (
                                                    <Copy className="w-4 h-4" />
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                )}

                                <Link
                                    to={`/projects/${project._id}`}
                                    className="flex items-center justify-center gap-2 w-full bg-white/50 hover:bg-white text-gray-700 font-medium py-2 px-4 rounded-lg transition-all"
                                >
                                    <ExternalLink className="w-4 h-4" />
                                    {project.projectType === 'website' ? 'Build Website' : 'View Details'}
                                </Link>
                            </div>
                        ))}
                    </div>
                )}

                {/* Create Project Modal */}
                {showModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fade-in">
                        <div className="glass rounded-2xl p-8 max-w-md w-full animate-scale-in">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">Create New Project</h2>
                            <form onSubmit={handleCreateProject} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Project Type *
                                    </label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setNewProject({ ...newProject, projectType: 'website' })}
                                            className={`p-4 rounded-xl border-2 transition-all ${newProject.projectType === 'website'
                                                ? 'border-primary-500 bg-primary-50'
                                                : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                        >
                                            <div className="text-2xl mb-2">🌐</div>
                                            <div className="font-semibold">Website</div>
                                            <div className="text-xs text-gray-600">Visual builder</div>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setNewProject({ ...newProject, projectType: 'api' })}
                                            className={`p-4 rounded-xl border-2 transition-all ${newProject.projectType === 'api'
                                                ? 'border-primary-500 bg-primary-50'
                                                : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                        >
                                            <div className="text-2xl mb-2">🔌</div>
                                            <div className="font-semibold">API</div>
                                            <div className="text-xs text-gray-600">Backend only</div>
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Project Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={newProject.name}
                                        onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                                        required
                                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none"
                                        placeholder={newProject.projectType === 'website' ? 'My Website' : 'My API'}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Description
                                    </label>
                                    <textarea
                                        value={newProject.description}
                                        onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                                        rows={3}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none resize-none"
                                        placeholder="Brief description of your project"
                                    />
                                </div>
                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 px-4 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-xl hover:shadow-lg transition-all"
                                    >
                                        Create
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

export default Projects;

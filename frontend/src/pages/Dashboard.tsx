import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { projectsAPI, Project } from '../services/api';
import Layout from '../components/Layout';
import {
    FolderKanban,
    Plus,
    TrendingUp,
    Zap,
    ArrowRight
} from 'lucide-react';

const Dashboard = () => {
    const { user } = useAuth();
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);

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

    const stats = [
        {
            label: 'Total Projects',
            value: projects.length,
            icon: FolderKanban,
            color: 'from-blue-500 to-cyan-500',
        },
        {
            label: 'Active APIs',
            value: projects.length,
            icon: Zap,
            color: 'from-purple-500 to-pink-500',
        },
        {
            label: 'This Month',
            value: projects.filter(p => {
                const created = new Date(p.createdAt);
                const now = new Date();
                return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
            }).length,
            icon: TrendingUp,
            color: 'from-green-500 to-emerald-500',
        },
    ];

    return (
        <Layout>
            <div className="max-w-7xl mx-auto animate-fade-in">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">
                        Welcome back, {user?.name}! 👋
                    </h1>
                    <p className="text-gray-600 text-lg">
                        Manage your API projects and monitor performance
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {stats.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <div
                                key={index}
                                className="glass rounded-2xl p-6 card-hover animate-slide-up"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center`}>
                                        <Icon className="w-6 h-6 text-white" />
                                    </div>
                                </div>
                                <p className="text-gray-600 text-sm font-medium mb-1">{stat.label}</p>
                                <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
                            </div>
                        );
                    })}
                </div>

                {/* Quick Actions */}
                <div className="glass rounded-2xl p-6 mb-8 animate-slide-up">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Link
                            to="/projects"
                            className="flex items-center justify-between p-4 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl text-white hover:shadow-lg hover:scale-105 transition-all"
                        >
                            <div className="flex items-center gap-3">
                                <Plus className="w-6 h-6" />
                                <div>
                                    <p className="font-semibold">Create New Project</p>
                                    <p className="text-sm text-white/80">Start building your API</p>
                                </div>
                            </div>
                            <ArrowRight className="w-5 h-5" />
                        </Link>

                        <Link
                            to="/projects"
                            className="flex items-center justify-between p-4 glass-dark rounded-xl text-white hover:shadow-lg hover:scale-105 transition-all"
                        >
                            <div className="flex items-center gap-3">
                                <FolderKanban className="w-6 h-6" />
                                <div>
                                    <p className="font-semibold">View All Projects</p>
                                    <p className="text-sm text-white/80">Manage existing APIs</p>
                                </div>
                            </div>
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                </div>

                {/* Recent Projects */}
                <div className="glass rounded-2xl p-6 animate-slide-up">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-800">Recent Projects</h2>
                        <Link to="/projects" className="text-primary-600 hover:text-primary-700 font-semibold text-sm">
                            View All →
                        </Link>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-8">
                            <div className="spinner"></div>
                        </div>
                    ) : projects.length === 0 ? (
                        <div className="text-center py-12">
                            <FolderKanban className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-600 mb-4">No projects yet</p>
                            <Link
                                to="/projects"
                                className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-6 py-3 rounded-xl hover:shadow-lg hover:scale-105 transition-all"
                            >
                                <Plus className="w-5 h-5" />
                                Create Your First Project
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {projects.slice(0, 5).map((project) => (
                                <Link
                                    key={project._id}
                                    to={`/projects/${project._id}`}
                                    className="block p-4 bg-white/50 rounded-xl hover:bg-white/80 transition-all"
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="font-semibold text-gray-800">{project.name}</h3>
                                            <p className="text-sm text-gray-600">{project.description || 'No description'}</p>
                                        </div>
                                        <ArrowRight className="w-5 h-5 text-gray-400" />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default Dashboard;

import { useState, useEffect } from 'react';
import { useParams, Link, Outlet, useLocation } from 'react-router-dom';
import Layout from '../components/Layout';
import { Package, Briefcase, Users, Image, ArrowLeft, LayoutDashboard } from 'lucide-react';

const AdminPanel = () => {
    const { id } = useParams<{ id: string }>();
    const location = useLocation();
    const [projectName, setProjectName] = useState('');

    useEffect(() => {
        // Fetch project name
        const fetchProject = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/projects/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await response.json();
                if (data.success) {
                    setProjectName(data.data.project.name);
                }
            } catch (error) {
                console.error('Error fetching project:', error);
            }
        };

        if (id) {
            fetchProject();
        }
    }, [id]);

    const menuItems = [
        { path: `/projects/${id}/admin`, label: 'Dashboard', icon: LayoutDashboard, exact: true },
        { path: `/projects/${id}/admin/products`, label: 'Products', icon: Package },
        { path: `/projects/${id}/admin/services`, label: 'Services', icon: Briefcase },
        { path: `/projects/${id}/admin/team`, label: 'Team', icon: Users },
        { path: `/projects/${id}/admin/gallery`, label: 'Gallery', icon: Image },
    ];

    const isActive = (path: string, exact: boolean = false) => {
        if (exact) {
            return location.pathname === path;
        }
        return location.pathname.startsWith(path);
    };

    return (
        <Layout>
            <div className="max-w-7xl mx-auto animate-fade-in">
                {/* Header */}
                <div className="mb-8">
                    <Link to={`/projects/${id}`} className="text-gray-600 hover:text-gray-800 mb-4 inline-flex items-center gap-2">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Project
                    </Link>
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">Admin Panel</h1>
                    <p className="text-gray-600">{projectName || 'Manage your website content'}</p>
                </div>

                <div className="flex gap-6">
                    {/* Sidebar */}
                    <div className="w-64 flex-shrink-0">
                        <div className="glass rounded-2xl p-4 sticky top-4">
                            <nav className="space-y-2">
                                {menuItems.map((item) => {
                                    const Icon = item.icon;
                                    const active = isActive(item.path, item.exact);

                                    return (
                                        <Link
                                            key={item.path}
                                            to={item.path}
                                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${active
                                                    ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg'
                                                    : 'text-gray-700 hover:bg-white/50'
                                                }`}
                                        >
                                            <Icon className="w-5 h-5" />
                                            <span className="font-medium">{item.label}</span>
                                        </Link>
                                    );
                                })}
                            </nav>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1">
                        <Outlet />
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default AdminPanel;

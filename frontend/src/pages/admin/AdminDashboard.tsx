import { useParams } from 'react-router-dom';
import { Package, Briefcase, Users, Image, TrendingUp } from 'lucide-react';

const AdminDashboard = () => {
    const { id } = useParams<{ id: string }>();

    const stats = [
        { label: 'Products', value: '0', icon: Package, color: 'from-blue-500 to-cyan-500', link: `/projects/${id}/admin/products` },
        { label: 'Services', value: '0', icon: Briefcase, color: 'from-purple-500 to-pink-500', link: `/projects/${id}/admin/services` },
        { label: 'Team Members', value: '0', icon: Users, color: 'from-green-500 to-emerald-500', link: `/projects/${id}/admin/team` },
        { label: 'Gallery Images', value: '0', icon: Image, color: 'from-orange-500 to-red-500', link: `/projects/${id}/admin/gallery` },
    ];

    return (
        <div>
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Dashboard</h2>
                <p className="text-gray-600">Overview of your website content</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <div
                            key={stat.label}
                            className="glass rounded-2xl p-6 card-hover"
                        >
                            <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center mb-4`}>
                                <Icon className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-3xl font-bold text-gray-800 mb-1">{stat.value}</h3>
                            <p className="text-gray-600 text-sm">{stat.label}</p>
                        </div>
                    );
                })}
            </div>

            {/* Quick Actions */}
            <div className="glass rounded-2xl p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <a
                        href={`/projects/${id}/admin/products`}
                        className="flex items-center gap-4 p-4 bg-white/50 rounded-xl hover:bg-white transition-all"
                    >
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                            <Package className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-800">Add Product</h4>
                            <p className="text-sm text-gray-600">Create a new product listing</p>
                        </div>
                    </a>

                    <a
                        href={`/projects/${id}/admin/services`}
                        className="flex items-center gap-4 p-4 bg-white/50 rounded-xl hover:bg-white transition-all"
                    >
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                            <Briefcase className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-800">Add Service</h4>
                            <p className="text-sm text-gray-600">Create a new service offering</p>
                        </div>
                    </a>

                    <a
                        href={`/projects/${id}/admin/team`}
                        className="flex items-center gap-4 p-4 bg-white/50 rounded-xl hover:bg-white transition-all"
                    >
                        <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                            <Users className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-800">Add Team Member</h4>
                            <p className="text-sm text-gray-600">Add a new team member</p>
                        </div>
                    </a>

                    <a
                        href={`/projects/${id}/admin/gallery`}
                        className="flex items-center gap-4 p-4 bg-white/50 rounded-xl hover:bg-white transition-all"
                    >
                        <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                            <Image className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-800">Upload Images</h4>
                            <p className="text-sm text-gray-600">Add images to your gallery</p>
                        </div>
                    </a>
                </div>
            </div>

            {/* Getting Started */}
            <div className="glass rounded-2xl p-6 mt-6">
                <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center flex-shrink-0">
                        <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-800 mb-2">Getting Started</h3>
                        <p className="text-gray-600 mb-4">
                            Welcome to your admin panel! Here you can manage all the dynamic content for your website.
                        </p>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-primary-500 rounded-full"></div>
                                Add products, services, team members, or gallery images using the sidebar
                            </li>
                            <li className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-primary-500 rounded-full"></div>
                                Add components to your pages from the Component Library
                            </li>
                            <li className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-primary-500 rounded-full"></div>
                                Preview your website to see how the data appears
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;

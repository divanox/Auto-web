import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { adminDataAPI, AdminDataItem } from '../../services/adminDataAPI';
import { Plus, Edit2, Trash2, X, Upload, Loader } from 'lucide-react';

interface Service {
    name: string;
    description: string;
    icon?: string;
    features?: string[];
}

const ServiceManager = () => {
    const { id } = useParams<{ id: string }>();
    const [services, setServices] = useState<AdminDataItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingService, setEditingService] = useState<AdminDataItem | null>(null);

    const [formData, setFormData] = useState<Service>({
        name: '',
        description: '',
        icon: 'Briefcase',
        features: []
    });

    const [featureInput, setFeatureInput] = useState('');

    useEffect(() => {
        if (id) {
            fetchServices();
        }
    }, [id]);

    const fetchServices = async () => {
        if (!id) return;

        try {
            const response = await adminDataAPI.getAll(id, 'service');
            setServices(response.data.data.items);
        } catch (error) {
            console.error('Error fetching services:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!id) return;

        try {
            if (editingService) {
                await adminDataAPI.update(id, 'service', editingService._id, formData);
            } else {
                await adminDataAPI.create(id, 'service', formData);
            }

            fetchServices();
            closeModal();
        } catch (error) {
            console.error('Error saving service:', error);
            alert('Failed to save service');
        }
    };

    const handleDelete = async (serviceId: string) => {
        if (!id || !confirm('Are you sure you want to delete this service?')) return;

        try {
            await adminDataAPI.delete(id, 'service', serviceId);
            fetchServices();
        } catch (error) {
            console.error('Error deleting service:', error);
            alert('Failed to delete service');
        }
    };

    const addFeature = () => {
        if (featureInput.trim()) {
            setFormData({
                ...formData,
                features: [...(formData.features || []), featureInput.trim()]
            });
            setFeatureInput('');
        }
    };

    const removeFeature = (index: number) => {
        setFormData({
            ...formData,
            features: formData.features?.filter((_, i) => i !== index)
        });
    };

    const openModal = (service?: AdminDataItem) => {
        if (service) {
            setEditingService(service);
            setFormData(service.data as Service);
        } else {
            setEditingService(null);
            setFormData({
                name: '',
                description: '',
                icon: 'Briefcase',
                features: []
            });
        }
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingService(null);
        setFeatureInput('');
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Services</h2>
                    <p className="text-gray-600">Manage your service offerings</p>
                </div>
                <button
                    onClick={() => openModal()}
                    className="flex items-center gap-2 bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all"
                >
                    <Plus className="w-5 h-5" />
                    Add Service
                </button>
            </div>

            {services.length === 0 ? (
                <div className="glass rounded-2xl p-12 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Plus className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">No services yet</h3>
                    <p className="text-gray-600 mb-6">Get started by adding your first service</p>
                    <button
                        onClick={() => openModal()}
                        className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all"
                    >
                        Add Your First Service
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {services.map((service) => {
                        const data = service.data as Service;
                        return (
                            <div key={service._id} className="glass rounded-2xl p-6 card-hover">
                                <h3 className="text-lg font-bold text-gray-800 mb-2">{data.name}</h3>
                                <p className="text-gray-600 text-sm mb-4">{data.description}</p>
                                {data.features && data.features.length > 0 && (
                                    <ul className="space-y-1 mb-4">
                                        {data.features.slice(0, 3).map((feature, idx) => (
                                            <li key={idx} className="text-sm text-gray-600 flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 bg-primary-500 rounded-full"></div>
                                                {feature}
                                            </li>
                                        ))}
                                        {data.features.length > 3 && (
                                            <li className="text-sm text-gray-500">+{data.features.length - 3} more</li>
                                        )}
                                    </ul>
                                )}
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => openModal(service)}
                                        className="flex-1 flex items-center justify-center gap-2 bg-white/50 hover:bg-white text-gray-700 px-4 py-2 rounded-lg transition-all"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(service._id)}
                                        className="flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-lg transition-all"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
                            <h3 className="text-2xl font-bold text-gray-800">
                                {editingService ? 'Edit Service' : 'Add Service'}
                            </h3>
                            <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Service Name *</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    rows={3}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Features</label>
                                <div className="flex gap-2 mb-2">
                                    <input
                                        type="text"
                                        value={featureInput}
                                        onChange={(e) => setFeatureInput(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                                        placeholder="Add a feature"
                                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    />
                                    <button
                                        type="button"
                                        onClick={addFeature}
                                        className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600"
                                    >
                                        Add
                                    </button>
                                </div>
                                {formData.features && formData.features.length > 0 && (
                                    <div className="space-y-2">
                                        {formData.features.map((feature, idx) => (
                                            <div key={idx} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg">
                                                <span className="text-sm text-gray-700">{feature}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => removeFeature(idx)}
                                                    className="text-red-500 hover:text-red-700"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all"
                                >
                                    {editingService ? 'Update Service' : 'Add Service'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ServiceManager;

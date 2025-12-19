import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { adminDataAPI } from '../../services/adminDataAPI';
import { Briefcase } from 'lucide-react';

interface Service {
    name: string;
    description: string;
    icon?: string;
    features?: string[];
}

interface ServicesGridRendererProps {
    configuration?: {
        columns?: number;
        showFeatures?: boolean;
    };
}

const ServicesGridRenderer = ({ configuration }: ServicesGridRendererProps) => {
    const { id } = useParams<{ id: string }>();
    const [services, setServices] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

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

    if (loading) {
        return (
            <div className="py-12 text-center">
                <div className="spinner mx-auto"></div>
            </div>
        );
    }

    if (services.length === 0) {
        return (
            <div className="py-12 text-center">
                <p className="text-gray-500">No services available</p>
            </div>
        );
    }

    const columns = configuration?.columns || 3;
    const gridClass = columns === 2 ? 'md:grid-cols-2' : columns === 4 ? 'md:grid-cols-4' : 'md:grid-cols-3';

    return (
        <div className={`grid grid-cols-1 ${gridClass} gap-6`}>
            {services.map((item) => {
                const service = item.data as Service;
                return (
                    <div key={item._id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-shadow">
                        <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center mb-4">
                            <Briefcase className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-3">{service.name}</h3>
                        <p className="text-gray-600 mb-4">{service.description}</p>

                        {configuration?.showFeatures !== false && service.features && service.features.length > 0 && (
                            <ul className="space-y-2">
                                {service.features.map((feature, idx) => (
                                    <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                                        <div className="w-1.5 h-1.5 bg-primary-500 rounded-full mt-1.5 flex-shrink-0"></div>
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default ServicesGridRenderer;

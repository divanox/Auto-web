import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { adminDataAPI } from '../../services/adminDataAPI';

interface GalleryImage {
    url: string;
    caption?: string;
    alt?: string;
}

interface GalleryRendererProps {
    configuration?: {
        columns?: number;
        showCaptions?: boolean;
    };
}

const GalleryRenderer = ({ configuration }: GalleryRendererProps) => {
    const { id } = useParams<{ id: string }>();
    const [images, setImages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            fetchImages();
        }
    }, [id]);

    const fetchImages = async () => {
        if (!id) return;

        try {
            const response = await adminDataAPI.getAll(id, 'gallery');
            setImages(response.data.data.items);
        } catch (error) {
            console.error('Error fetching gallery images:', error);
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

    if (images.length === 0) {
        return (
            <div className="py-12 text-center">
                <p className="text-gray-500">No images available</p>
            </div>
        );
    }

    const columns = configuration?.columns || 3;
    const gridClass = columns === 2 ? 'md:grid-cols-2' : columns === 4 ? 'md:grid-cols-4' : 'md:grid-cols-3';

    return (
        <div className={`grid grid-cols-1 ${gridClass} gap-4`}>
            {images.map((item) => {
                const image = item.data as GalleryImage;
                return (
                    <div key={item._id} className="group relative overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-shadow">
                        <img
                            src={image.url}
                            alt={image.alt || 'Gallery image'}
                            className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        {configuration?.showCaptions !== false && image.caption && (
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                                <p className="text-white text-sm">{image.caption}</p>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default GalleryRenderer;

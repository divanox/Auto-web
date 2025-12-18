import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { adminDataAPI, AdminDataItem } from '../../services/adminDataAPI';
import { Plus, Trash2, Upload, Loader, X } from 'lucide-react';

interface GalleryImage {
    url: string;
    caption?: string;
    alt?: string;
}

const GalleryManager = () => {
    const { id } = useParams<{ id: string }>();
    const [images, setImages] = useState<AdminDataItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string>('');
    const [caption, setCaption] = useState('');
    const [alt, setAlt] = useState('');

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

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || !e.target.files[0] || !id) return;

        const file = e.target.files[0];
        setUploading(true);

        try {
            const response = await adminDataAPI.uploadImage(id, file);
            const imageUrl = `${import.meta.env.VITE_API_URL}${response.data.data.url}`;
            setSelectedImage(imageUrl);
            setShowModal(true);
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Failed to upload image');
        } finally {
            setUploading(false);
        }
    };

    const handleSaveImage = async () => {
        if (!id || !selectedImage) return;

        try {
            const imageData: GalleryImage = {
                url: selectedImage,
                caption: caption || '',
                alt: alt || ''
            };

            await adminDataAPI.create(id, 'gallery', imageData);
            fetchImages();
            closeModal();
        } catch (error) {
            console.error('Error saving image:', error);
            alert('Failed to save image');
        }
    };

    const handleDelete = async (imageId: string) => {
        if (!id || !confirm('Are you sure you want to delete this image?')) return;

        try {
            await adminDataAPI.delete(id, 'gallery', imageId);
            fetchImages();
        } catch (error) {
            console.error('Error deleting image:', error);
            alert('Failed to delete image');
        }
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedImage('');
        setCaption('');
        setAlt('');
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
                    <h2 className="text-2xl font-bold text-gray-800">Gallery</h2>
                    <p className="text-gray-600">Manage your image gallery</p>
                </div>
                <label className="flex items-center gap-2 bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all cursor-pointer">
                    {uploading ? (
                        <>
                            <Loader className="w-5 h-5 animate-spin" />
                            Uploading...
                        </>
                    ) : (
                        <>
                            <Plus className="w-5 h-5" />
                            Upload Image
                        </>
                    )}
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        disabled={uploading}
                    />
                </label>
            </div>

            {images.length === 0 ? (
                <div className="glass rounded-2xl p-12 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Plus className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">No images yet</h3>
                    <p className="text-gray-600 mb-6">Get started by uploading your first image</p>
                    <label className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all cursor-pointer">
                        <Upload className="w-5 h-5" />
                        Upload Your First Image
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                        />
                    </label>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {images.map((image) => {
                        const data = image.data as GalleryImage;
                        return (
                            <div key={image._id} className="glass rounded-xl overflow-hidden group relative">
                                <img
                                    src={data.url}
                                    alt={data.alt || 'Gallery image'}
                                    className="w-full h-48 object-cover"
                                />
                                {data.caption && (
                                    <div className="p-3">
                                        <p className="text-sm text-gray-600 line-clamp-2">{data.caption}</p>
                                    </div>
                                )}
                                <button
                                    onClick={() => handleDelete(image._id)}
                                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Image Details Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-2xl w-full">
                        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                            <h3 className="text-2xl font-bold text-gray-800">Add Image Details</h3>
                            <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div>
                                <img
                                    src={selectedImage}
                                    alt="Preview"
                                    className="w-full h-64 object-cover rounded-lg mb-4"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Caption</label>
                                <input
                                    type="text"
                                    value={caption}
                                    onChange={(e) => setCaption(e.target.value)}
                                    placeholder="Add a caption for this image"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Alt Text</label>
                                <input
                                    type="text"
                                    value={alt}
                                    onChange={(e) => setAlt(e.target.value)}
                                    placeholder="Describe the image for accessibility"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                />
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
                                    onClick={handleSaveImage}
                                    className="flex-1 bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all"
                                >
                                    Save Image
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GalleryManager;

import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { adminDataAPI, AdminDataItem } from '../../services/adminDataAPI';
import { Plus, Edit2, Trash2, X, Upload, Loader } from 'lucide-react';

interface Product {
    name: string;
    description: string;
    price: number;
    image: string;
    category?: string;
    sku?: string;
    inStock?: boolean;
}

const ProductManager = () => {
    const { id } = useParams<{ id: string }>();
    const [products, setProducts] = useState<AdminDataItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState<AdminDataItem | null>(null);
    const [uploading, setUploading] = useState(false);

    const [formData, setFormData] = useState<Product>({
        name: '',
        description: '',
        price: 0,
        image: '',
        category: '',
        sku: '',
        inStock: true
    });

    useEffect(() => {
        if (id) {
            fetchProducts();
        }
    }, [id]);

    const fetchProducts = async () => {
        if (!id) return;

        try {
            const response = await adminDataAPI.getAll(id, 'product');
            setProducts(response.data.data.items);
        } catch (error) {
            console.error('Error fetching products:', error);
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
            setFormData({ ...formData, image: imageUrl });
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Failed to upload image');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!id) return;

        try {
            if (editingProduct) {
                await adminDataAPI.update(id, 'product', editingProduct._id, formData);
            } else {
                await adminDataAPI.create(id, 'product', formData);
            }

            fetchProducts();
            closeModal();
        } catch (error) {
            console.error('Error saving product:', error);
            alert('Failed to save product');
        }
    };

    const handleDelete = async (productId: string) => {
        if (!id || !confirm('Are you sure you want to delete this product?')) return;

        try {
            await adminDataAPI.delete(id, 'product', productId);
            fetchProducts();
        } catch (error) {
            console.error('Error deleting product:', error);
            alert('Failed to delete product');
        }
    };

    const openModal = (product?: AdminDataItem) => {
        if (product) {
            setEditingProduct(product);
            setFormData(product.data as Product);
        } else {
            setEditingProduct(null);
            setFormData({
                name: '',
                description: '',
                price: 0,
                image: '',
                category: '',
                sku: '',
                inStock: true
            });
        }
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingProduct(null);
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
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Products</h2>
                    <p className="text-gray-600">Manage your product catalog</p>
                </div>
                <button
                    onClick={() => openModal()}
                    className="flex items-center gap-2 bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all"
                >
                    <Plus className="w-5 h-5" />
                    Add Product
                </button>
            </div>

            {/* Products Grid */}
            {products.length === 0 ? (
                <div className="glass rounded-2xl p-12 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Plus className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">No products yet</h3>
                    <p className="text-gray-600 mb-6">Get started by adding your first product</p>
                    <button
                        onClick={() => openModal()}
                        className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all"
                    >
                        Add Your First Product
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product) => {
                        const data = product.data as Product;
                        return (
                            <div key={product._id} className="glass rounded-2xl overflow-hidden card-hover">
                                {data.image && (
                                    <img
                                        src={data.image}
                                        alt={data.name}
                                        className="w-full h-48 object-cover"
                                    />
                                )}
                                <div className="p-6">
                                    <h3 className="text-lg font-bold text-gray-800 mb-2">{data.name}</h3>
                                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{data.description}</p>
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-2xl font-bold text-primary-500">${data.price}</span>
                                        {data.inStock ? (
                                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">In Stock</span>
                                        ) : (
                                            <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">Out of Stock</span>
                                        )}
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => openModal(product)}
                                            className="flex-1 flex items-center justify-center gap-2 bg-white/50 hover:bg-white text-gray-700 px-4 py-2 rounded-lg transition-all"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(product._id)}
                                            className="flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-lg transition-all"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
                            <h3 className="text-2xl font-bold text-gray-800">
                                {editingProduct ? 'Edit Product' : 'Add Product'}
                            </h3>
                            <button
                                onClick={closeModal}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Product Name *
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Description *
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    rows={3}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Price *
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        SKU
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.sku}
                                        onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Category
                                </label>
                                <input
                                    type="text"
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Product Image
                                </label>
                                <div className="flex items-center gap-4">
                                    {formData.image && (
                                        <img
                                            src={formData.image}
                                            alt="Preview"
                                            className="w-24 h-24 object-cover rounded-lg"
                                        />
                                    )}
                                    <label className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg cursor-pointer transition-all">
                                        {uploading ? (
                                            <>
                                                <Loader className="w-5 h-5 animate-spin" />
                                                Uploading...
                                            </>
                                        ) : (
                                            <>
                                                <Upload className="w-5 h-5" />
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
                            </div>

                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="inStock"
                                    checked={formData.inStock}
                                    onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                                    className="w-4 h-4 text-primary-500 rounded focus:ring-primary-500"
                                />
                                <label htmlFor="inStock" className="text-sm font-medium text-gray-700">
                                    In Stock
                                </label>
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
                                    {editingProduct ? 'Update Product' : 'Add Product'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductManager;

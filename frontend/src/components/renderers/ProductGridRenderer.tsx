import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { adminDataAPI } from '../../services/adminDataAPI';

interface Product {
    name: string;
    description: string;
    price: number;
    image: string;
    category?: string;
    sku?: string;
    inStock?: boolean;
}

interface ProductGridRendererProps {
    configuration?: {
        layout?: string;
        columns?: number;
        showPrice?: boolean;
        showStock?: boolean;
    };
}

const ProductGridRenderer = ({ configuration }: ProductGridRendererProps) => {
    const { id } = useParams<{ id: string }>();
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

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

    if (loading) {
        return (
            <div className="py-12 text-center">
                <div className="spinner mx-auto"></div>
            </div>
        );
    }

    if (products.length === 0) {
        return (
            <div className="py-12 text-center">
                <p className="text-gray-500">No products available</p>
            </div>
        );
    }

    const columns = configuration?.columns || 3;
    const gridClass = columns === 2 ? 'md:grid-cols-2' : columns === 4 ? 'md:grid-cols-4' : 'md:grid-cols-3';

    return (
        <div className={`grid grid-cols-1 ${gridClass} gap-6`}>
            {products.map((item) => {
                const product = item.data as Product;
                return (
                    <div key={item._id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow">
                        {product.image && (
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-48 object-cover"
                            />
                        )}
                        <div className="p-6">
                            <h3 className="text-xl font-bold text-gray-800 mb-2">{product.name}</h3>
                            <p className="text-gray-600 text-sm mb-4 line-clamp-3">{product.description}</p>

                            <div className="flex items-center justify-between">
                                {configuration?.showPrice !== false && (
                                    <span className="text-2xl font-bold text-primary-500">${product.price}</span>
                                )}
                                {configuration?.showStock !== false && product.inStock !== undefined && (
                                    <span className={`text-xs px-3 py-1 rounded-full ${product.inStock
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-red-100 text-red-700'
                                        }`}>
                                        {product.inStock ? 'In Stock' : 'Out of Stock'}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default ProductGridRenderer;

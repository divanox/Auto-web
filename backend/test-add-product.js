const axios = require('axios');
const jwt = require('jsonwebtoken');

const token = jwt.sign(
    { userId: '6942ee99c3e4778e84c44a2d' },
    'your-super-secret-jwt-key-change-this-in-production-12345'
);

const productData = {
    name: 'Premium Laptop',
    description: 'High-performance laptop for professionals',
    price: 1299,
    inStock: true,
    category: 'Electronics'
};

axios.post(
    'http://localhost:5000/api/projects/694577b994f003891ee5267a/admin/data/product',
    productData,
    {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    }
)
    .then(response => {
        console.log('Product added successfully:');
        console.log(JSON.stringify(response.data, null, 2));
    })
    .catch(error => {
        console.error('Error adding product:');
        console.error(error.response?.data || error.message);
    });

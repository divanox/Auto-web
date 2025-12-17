// Predefined module schemas for the API Builder

interface FieldConfig {
    type: string;
    required: boolean;
    label: string;
    default?: any;
    options?: string[];
}

interface ModuleSchema {
    [key: string]: FieldConfig;
}

export interface ModuleDefinition {
    name: string;
    slug: string;
    description: string;
    icon: string;
    schema: ModuleSchema;
}

export const moduleDefinitions: ModuleDefinition[] = [
    {
        name: 'Product Catalog',
        slug: 'products',
        description: 'Manage your product inventory with pricing, SKUs, and stock levels',
        icon: 'Package',
        schema: {
            name: { type: 'string', required: true, label: 'Product Name' },
            description: { type: 'text', required: false, label: 'Description' },
            price: { type: 'number', required: true, label: 'Price' },
            sku: { type: 'string', required: true, label: 'SKU' },
            category: { type: 'string', required: false, label: 'Category' },
            imageUrl: { type: 'url', required: false, label: 'Image URL' },
            inStock: { type: 'boolean', required: true, default: true, label: 'In Stock' }
        }
    },
    {
        name: 'Blog / News',
        slug: 'blog',
        description: 'Create and manage blog posts and news articles',
        icon: 'FileText',
        schema: {
            title: { type: 'string', required: true, label: 'Title' },
            content: { type: 'text', required: true, label: 'Content' },
            author: { type: 'string', required: true, label: 'Author' },
            publishedDate: { type: 'date', required: true, label: 'Published Date' },
            category: { type: 'string', required: false, label: 'Category' },
            tags: { type: 'array', required: false, label: 'Tags' },
            featured: { type: 'boolean', required: false, default: false, label: 'Featured' }
        }
    },
    {
        name: 'Customer Database',
        slug: 'customers',
        description: 'Store and manage customer information and contacts',
        icon: 'Users',
        schema: {
            firstName: { type: 'string', required: true, label: 'First Name' },
            lastName: { type: 'string', required: true, label: 'Last Name' },
            email: { type: 'email', required: true, label: 'Email' },
            phone: { type: 'string', required: false, label: 'Phone' },
            company: { type: 'string', required: false, label: 'Company' },
            address: { type: 'text', required: false, label: 'Address' },
            notes: { type: 'text', required: false, label: 'Notes' }
        }
    },
    {
        name: 'Orders / Services',
        slug: 'orders',
        description: 'Track orders, services, and transactions',
        icon: 'ShoppingCart',
        schema: {
            orderNumber: { type: 'string', required: true, label: 'Order Number' },
            customerName: { type: 'string', required: true, label: 'Customer Name' },
            items: { type: 'array', required: true, label: 'Items' },
            totalAmount: { type: 'number', required: true, label: 'Total Amount' },
            status: {
                type: 'select',
                required: true,
                options: ['pending', 'processing', 'completed', 'cancelled'],
                default: 'pending',
                label: 'Status'
            },
            orderDate: { type: 'date', required: true, label: 'Order Date' }
        }
    }
];

interface ValidationResult {
    isValid: boolean;
    errors: string[];
}

// Validation function to check if data matches schema
export const validateDataAgainstSchema = (data: Record<string, any>, schema: ModuleSchema): ValidationResult => {
    const errors: string[] = [];

    for (const [fieldName, fieldConfig] of Object.entries(schema)) {
        const value = data[fieldName];

        // Check required fields
        if (fieldConfig.required && (value === undefined || value === null || value === '')) {
            errors.push(`${fieldConfig.label || fieldName} is required`);
            continue;
        }

        // Skip validation if field is not required and not provided
        if (!fieldConfig.required && (value === undefined || value === null)) {
            continue;
        }

        // Type validation
        switch (fieldConfig.type) {
            case 'string':
            case 'text':
                if (typeof value !== 'string') {
                    errors.push(`${fieldConfig.label || fieldName} must be a string`);
                }
                break;
            case 'number':
                if (typeof value !== 'number' && isNaN(Number(value))) {
                    errors.push(`${fieldConfig.label || fieldName} must be a number`);
                }
                break;
            case 'boolean':
                if (typeof value !== 'boolean') {
                    errors.push(`${fieldConfig.label || fieldName} must be a boolean`);
                }
                break;
            case 'email':
                const emailRegex = /^\S+@\S+\.\S+$/;
                if (!emailRegex.test(value)) {
                    errors.push(`${fieldConfig.label || fieldName} must be a valid email`);
                }
                break;
            case 'url':
                try {
                    new URL(value);
                } catch {
                    errors.push(`${fieldConfig.label || fieldName} must be a valid URL`);
                }
                break;
            case 'date':
                if (isNaN(Date.parse(value))) {
                    errors.push(`${fieldConfig.label || fieldName} must be a valid date`);
                }
                break;
            case 'array':
                if (!Array.isArray(value)) {
                    errors.push(`${fieldConfig.label || fieldName} must be an array`);
                }
                break;
            case 'select':
                if (fieldConfig.options && !fieldConfig.options.includes(value)) {
                    errors.push(`${fieldConfig.label || fieldName} must be one of: ${fieldConfig.options.join(', ')}`);
                }
                break;
        }
    }

    return {
        isValid: errors.length === 0,
        errors
    };
};

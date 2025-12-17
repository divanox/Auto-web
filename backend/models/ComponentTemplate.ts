import mongoose, { Document, Schema } from 'mongoose';

export interface IComponentTemplate extends Document {
    name: string;
    slug: string;
    category: string;
    description: string;
    icon: string;
    fieldSchema: {
        fields: Array<{
            name: string;
            type: string;
            label: string;
            required: boolean;
            default?: any;
            placeholder?: string;
            options?: string[];
        }>;
    };
    previewImage: string;
    defaultConfig: {
        layout?: string;
        colors?: {
            primary?: string;
            secondary?: string;
            background?: string;
            text?: string;
        };
        spacing?: Record<string, any>;
    };
    createdAt: Date;
    updatedAt: Date;
}

const componentTemplateSchema = new Schema<IComponentTemplate>({
    name: {
        type: String,
        required: true,
        unique: true
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    category: {
        type: String,
        required: true,
        enum: ['header', 'content', 'footer', 'form', 'media']
    },
    description: {
        type: String,
        required: true
    },
    icon: {
        type: String,
        default: 'Box'
    },
    fieldSchema: {
        fields: [{
            name: { type: String, required: true },
            type: {
                type: String,
                required: true,
                enum: ['text', 'textarea', 'image', 'url', 'color', 'select', 'number', 'boolean']
            },
            label: { type: String, required: true },
            required: { type: Boolean, default: false },
            default: Schema.Types.Mixed,
            placeholder: String,
            options: [String]
        }]
    },
    previewImage: {
        type: String,
        default: ''
    },
    defaultConfig: {
        type: Schema.Types.Mixed,
        default: {}
    }
}, {
    timestamps: true
});

const ComponentTemplate = mongoose.model<IComponentTemplate>('ComponentTemplate', componentTemplateSchema);

export default ComponentTemplate;

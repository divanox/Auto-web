import mongoose, { Document, Schema } from 'mongoose';

export interface IModule extends Document {
    name: string;
    slug: string;
    description: string;
    icon: string;
    schema: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}

const moduleSchema = new Schema<IModule>({
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
    description: {
        type: String,
        required: true
    },
    icon: {
        type: String,
        default: 'Box'
    },
    schema: {
        type: Schema.Types.Mixed,
        required: true
    }
}, {
    timestamps: true
});

const Module = mongoose.model<IModule>('Module', moduleSchema);

export default Module;

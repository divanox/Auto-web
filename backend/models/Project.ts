import mongoose, { Document, Schema } from 'mongoose';
import { nanoid } from 'nanoid';

export interface IProject extends Document {
    userId: mongoose.Types.ObjectId;
    name: string;
    description: string;
    apiToken: string;
    baseUrl: string;
    createdAt: Date;
    updatedAt: Date;
}

const projectSchema = new Schema<IProject>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    name: {
        type: String,
        required: [true, 'Project name is required'],
        trim: true
    },
    description: {
        type: String,
        trim: true,
        default: ''
    },
    apiToken: {
        type: String,
        unique: true,
        default: () => nanoid(32),
        index: true
    },
    baseUrl: {
        type: String,
        default: function (this: IProject) {
            return `${process.env.API_BASE_URL}/api/v1/${this.apiToken}`;
        }
    }
}, {
    timestamps: true
});

// Generate base URL before saving
projectSchema.pre('save', function (next) {
    if (!this.baseUrl || this.isModified('apiToken')) {
        this.baseUrl = `${process.env.API_BASE_URL}/api/v1/${this.apiToken}`;
    }
    next();
});

const Project = mongoose.model<IProject>('Project', projectSchema);

export default Project;

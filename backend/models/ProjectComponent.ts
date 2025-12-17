import mongoose, { Document, Schema } from 'mongoose';

export interface IProjectComponent extends Document {
    projectId: mongoose.Types.ObjectId;
    templateId: mongoose.Types.ObjectId;
    order: number;
    isActive: boolean;
    configuration: {
        layout?: string;
        colors?: {
            primary?: string;
            secondary?: string;
            background?: string;
            text?: string;
        };
        spacing?: Record<string, any>;
        customCSS?: string;
    };
    content: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}

const projectComponentSchema = new Schema<IProjectComponent>({
    projectId: {
        type: Schema.Types.ObjectId,
        ref: 'Project',
        required: true,
        index: true
    },
    templateId: {
        type: Schema.Types.ObjectId,
        ref: 'ComponentTemplate',
        required: true
    },
    order: {
        type: Number,
        required: true,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    },
    configuration: {
        layout: String,
        colors: {
            primary: String,
            secondary: String,
            background: String,
            text: String
        },
        spacing: Schema.Types.Mixed,
        customCSS: String
    },
    content: {
        type: Schema.Types.Mixed,
        required: true,
        default: {}
    }
}, {
    timestamps: true
});

// Compound index for efficient queries
projectComponentSchema.index({ projectId: 1, order: 1 });

const ProjectComponent = mongoose.model<IProjectComponent>('ProjectComponent', projectComponentSchema);

export default ProjectComponent;

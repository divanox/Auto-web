import mongoose, { Document, Schema } from 'mongoose';

export interface IProjectModule extends Document {
    projectId: mongoose.Types.ObjectId;
    moduleId: mongoose.Types.ObjectId;
    configuration: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}

const projectModuleSchema = new Schema<IProjectModule>({
    projectId: {
        type: Schema.Types.ObjectId,
        ref: 'Project',
        required: true,
        index: true
    },
    moduleId: {
        type: Schema.Types.ObjectId,
        ref: 'Module',
        required: true,
        index: true
    },
    configuration: {
        type: Schema.Types.Mixed,
        default: {}
    }
}, {
    timestamps: true
});

// Compound index to ensure a module is only added once per project
projectModuleSchema.index({ projectId: 1, moduleId: 1 }, { unique: true });

const ProjectModule = mongoose.model<IProjectModule>('ProjectModule', projectModuleSchema);

export default ProjectModule;

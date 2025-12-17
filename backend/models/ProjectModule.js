import mongoose from 'mongoose';

const projectModuleSchema = new mongoose.Schema({
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true,
        index: true
    },
    moduleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Module',
        required: true,
        index: true
    },
    configuration: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    }
}, {
    timestamps: true
});

// Compound index to ensure a module is only added once per project
projectModuleSchema.index({ projectId: 1, moduleId: 1 }, { unique: true });

const ProjectModule = mongoose.model('ProjectModule', projectModuleSchema);

export default ProjectModule;

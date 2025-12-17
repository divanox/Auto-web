import mongoose from 'mongoose';

const dynamicDataSchema = new mongoose.Schema({
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
    data: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    }
}, {
    timestamps: true
});

// Compound index for efficient queries
dynamicDataSchema.index({ projectId: 1, moduleId: 1 });

const DynamicData = mongoose.model('DynamicData', dynamicDataSchema);

export default DynamicData;

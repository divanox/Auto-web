import mongoose, { Document, Schema } from 'mongoose';

export interface IDynamicData extends Document {
    projectId: mongoose.Types.ObjectId;
    moduleId: mongoose.Types.ObjectId;
    data: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}

const dynamicDataSchema = new Schema<IDynamicData>({
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
    data: {
        type: Schema.Types.Mixed,
        required: true
    }
}, {
    timestamps: true
});

// Compound index for efficient queries
dynamicDataSchema.index({ projectId: 1, moduleId: 1 });

const DynamicData = mongoose.model<IDynamicData>('DynamicData', dynamicDataSchema);

export default DynamicData;

import mongoose from 'mongoose';

const moduleSchema = new mongoose.Schema({
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
        type: mongoose.Schema.Types.Mixed,
        required: true
    }
}, {
    timestamps: true
});

const Module = mongoose.model('Module', moduleSchema);

export default Module;

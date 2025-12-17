import mongoose, { Document, Schema } from 'mongoose';

export interface IPage extends Document {
    projectId: mongoose.Types.ObjectId;
    name: string;
    slug: string;
    isHomePage: boolean;
    order: number;
    isPublished: boolean;
    seoTitle: string;
    seoDescription: string;
    seoKeywords: string;
    createdAt: Date;
    updatedAt: Date;
}

const pageSchema = new Schema<IPage>({
    projectId: {
        type: Schema.Types.ObjectId,
        ref: 'Project',
        required: true,
        index: true
    },
    name: {
        type: String,
        required: [true, 'Page name is required'],
        trim: true
    },
    slug: {
        type: String,
        required: [true, 'Page slug is required'],
        trim: true,
        lowercase: true
    },
    isHomePage: {
        type: Boolean,
        default: false
    },
    order: {
        type: Number,
        default: 0
    },
    isPublished: {
        type: Boolean,
        default: true
    },
    seoTitle: {
        type: String,
        trim: true,
        default: ''
    },
    seoDescription: {
        type: String,
        trim: true,
        default: ''
    },
    seoKeywords: {
        type: String,
        trim: true,
        default: ''
    }
}, {
    timestamps: true
});

// Ensure only one home page per project
pageSchema.pre('save', async function (next) {
    if (this.isHomePage) {
        await mongoose.model('Page').updateMany(
            { projectId: this.projectId, _id: { $ne: this._id } },
            { isHomePage: false }
        );
    }
    next();
});

// Compound index for project + slug uniqueness
pageSchema.index({ projectId: 1, slug: 1 }, { unique: true });

const Page = mongoose.model<IPage>('Page', pageSchema);

export default Page;

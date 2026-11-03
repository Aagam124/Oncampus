import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema(
  {
    provider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Service title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Service description is required'],
      maxlength: 2000,
    },
    category: {
      type: String,
      required: true,
      enum: [
        'web-development',
        'mobile-development',
        'ui-ux-design',
        'graphic-design',
        'video-editing',
        'content-writing',
        'data-analysis',
        'tutoring',
        'presentation',
        'research',
        'other',
      ],
    },
    tags: {
      type: [String],
      default: [],
    },
    pricing: {
      type: {
        type: String,
        enum: ['fixed', 'hourly', 'negotiable'],
        required: true,
      },
      amount: {
        type: Number,
        required: true,
        min: 0,
      },
    },
    deliveryTime: {
      type: Number,
      required: true,
      min: 1,
    },
    images: {
      type: [String],
      default: [],
    },
    rating: {
      type: Number,
      default: 0,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    orderCount: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['active', 'paused', 'under-review', 'rejected', 'inactive'],
      default: 'active',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    portalStatus: {
      type: String,
      enum: ['published', 'hidden', 'archived', 'removed'],
      default: 'published',
    },
    archivedAt: {
      type: Date,
      default: null,
    },
    archivedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    archiveReason: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

serviceSchema.index({ title: 'text', description: 'text', tags: 'text' });

const Service = mongoose.model('Service', serviceSchema);
export default Service;

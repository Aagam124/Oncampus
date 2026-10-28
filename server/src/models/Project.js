import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Project description is required'],
      maxlength: 3000,
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
    skills: {
      type: [String],
      default: [],
    },
    type: {
      type: String,
      enum: ['collaboration', 'hiring'],
      default: 'collaboration',
    },
    budget: {
      min: { type: Number, default: 0 },
      max: { type: Number, default: 0 },
      currency: { type: String, default: 'INR' },
    },
    timeline: {
      type: String,
      default: '',
    },
    maxCollaborators: {
      type: Number,
      default: 5,
    },
    applications: [
      {
        applicant: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        message: {
          type: String,
          default: '',
        },
        status: {
          type: String,
          enum: ['pending', 'accepted', 'rejected'],
          default: 'pending',
        },
        appliedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    status: {
      type: String,
      enum: ['open', 'in-progress', 'completed', 'closed'],
      default: 'open',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

projectSchema.index({ title: 'text', description: 'text', skills: 'text' });

const Project = mongoose.model('Project', projectSchema);
export default Project;

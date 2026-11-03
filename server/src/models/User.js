import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
    },
    role: {
      type: String,
      enum: ['student', 'admin'],
      default: 'student',
    },
    avatar: {
      type: String,
      default: '',
    },
    headline: {
      type: String,
      maxlength: 120,
      default: '',
    },
    bio: {
      type: String,
      maxlength: 1000,
      default: '',
    },
    university: {
      type: String,
      default: '',
    },
    department: {
      type: String,
      default: '',
    },
    year: {
      type: Number,
      min: 1,
      max: 6,
    },
    skills: {
      type: [String],
      default: [],
    },
    education: [
      {
        institution: String,
        degree: String,
        field: String,
        startYear: Number,
        endYear: Number,
      },
    ],
    portfolio: [
      {
        title: String,
        description: String,
        url: String,
        image: String,
      },
    ],
    socialLinks: {
      github: { type: String, default: '' },
      linkedin: { type: String, default: '' },
      website: { type: String, default: '' },
      twitter: { type: String, default: '' },
    },
    savedProjects: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
      },
    ],
    rating: {
      type: Number,
      default: 0,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationStatus: {
      type: String,
      enum: ['unverified', 'pending', 'verified', 'rejected'],
      default: 'unverified',
    },
    verificationDetails: {
      universityEmail: { type: String, default: '' },
      documentUrl: { type: String, default: '' },
      documentType: { type: String, default: 'Student ID' },
      submittedAt: { type: Date, default: null },
      reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
      reviewedAt: { type: Date, default: null },
      rejectionReason: { type: String, default: '' },
    },
    adminRole: {
      type: String,
      enum: ['super_admin', 'admin', 'moderator', 'none'],
      default: function () {
        return this.role === 'admin' ? 'super_admin' : 'none';
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    suspensionDetails: {
      reason: { type: String, default: '' },
      suspendedAt: { type: Date, default: null },
      suspendedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    },
    portalStatus: {
      type: String,
      enum: ['published', 'hidden', 'archived', 'removed'],
      default: 'published',
    },
    refreshToken: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Return public profile (no sensitive fields)
userSchema.methods.toPublicProfile = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.refreshToken;
  return obj;
};

const User = mongoose.model('User', userSchema);
export default User;

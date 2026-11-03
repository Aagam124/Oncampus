import User from '../models/User.js';
import Service from '../models/Service.js';
import Review from '../models/Review.js';
import { success, error, paginated } from '../utils/apiResponse.js';

export const getUsers = async (req, res) => {
  try {
    const { search, skills, university, page = 1, limit = 12 } = req.query;
    const filter = {
      isActive: true,
      role: 'student',
      portalStatus: { $nin: ['hidden', 'archived', 'removed'] },
    };

    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { headline: { $regex: search, $options: 'i' } },
      ];
    }

    if (skills) {
      const skillsArray = skills.split(',').map((s) => s.trim());
      filter.skills = { $in: skillsArray };
    }

    if (university) {
      filter.university = { $regex: university, $options: 'i' };
    }

    if (req.query.department) {
      filter.department = { $regex: req.query.department, $options: 'i' };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await User.countDocuments(filter);
    const users = await User.find(filter)
      .select('-password -refreshToken')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    return paginated(res, users, page, limit, total);
  } catch (err) {
    return error(res, err.message, 500);
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password -refreshToken');
    if (!user) {
      return error(res, 'User not found.', 404);
    }

    // Suspended or removed students are not accessible on public portal (except to admins)
    if ((!user.isActive || ['hidden', 'archived', 'removed'].includes(user.portalStatus)) && req.user?.role !== 'admin') {
      return error(res, 'This user profile is no longer available on OnCampus.', 404);
    }

    return success(res, { user });
  } catch (err) {
    return error(res, err.message, 500);
  }
};

export const updateProfile = async (req, res) => {
  try {
    const allowedFields = [
      'firstName', 'lastName', 'headline', 'bio', 'university',
      'department', 'year', 'skills', 'education', 'portfolio',
      'socialLinks',
    ];

    const updates = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    }).select('-password -refreshToken');

    if (!user) {
      return error(res, 'User not found.', 404);
    }

    return success(res, { user });
  } catch (err) {
    return error(res, err.message, 500);
  }
};

export const updateAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return error(res, 'No image file provided.', 400);
    }

    const avatarPath = `/uploads/${req.file.filename}`;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar: avatarPath },
      { new: true }
    ).select('-password -refreshToken');

    return success(res, { user });
  } catch (err) {
    return error(res, err.message, 500);
  }
};

export const getUserServices = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || !user.isActive || ['hidden', 'archived', 'removed'].includes(user.portalStatus)) {
      return success(res, { services: [] });
    }

    const services = await Service.find({
      provider: req.params.id,
      isActive: true,
      status: 'active',
      portalStatus: { $nin: ['hidden', 'archived', 'removed'] },
    }).populate('provider', 'firstName lastName avatar headline');

    return success(res, { services });
  } catch (err) {
    return error(res, err.message, 500);
  }
};

export const getUserReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ reviewee: req.params.id })
      .populate('reviewer', 'firstName lastName avatar')
      .populate('service', 'title')
      .sort({ createdAt: -1 });

    return success(res, { reviews });
  } catch (err) {
    return error(res, err.message, 500);
  }
};

export const toggleFavorite = async (req, res) => {
  try {
    const { projectId } = req.params;
    const user = await User.findById(req.user._id);
    if (!user) {
      return error(res, 'User not found.', 404);
    }

    const index = user.savedProjects ? user.savedProjects.indexOf(projectId) : -1;
    let isFavorite = false;

    if (index > -1) {
      user.savedProjects.splice(index, 1);
      isFavorite = false;
    } else {
      if (!user.savedProjects) user.savedProjects = [];
      user.savedProjects.push(projectId);
      isFavorite = true;
    }

    await user.save();
    return success(res, { isFavorite, savedProjects: user.savedProjects });
  } catch (err) {
    return error(res, err.message, 500);
  }
};

export const getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: 'savedProjects',
      populate: { path: 'owner', select: 'firstName lastName avatar headline university' },
    });
    return success(res, { favorites: user?.savedProjects || [] });
  } catch (err) {
    return error(res, err.message, 500);
  }
};

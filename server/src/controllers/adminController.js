import User from '../models/User.js';
import Service from '../models/Service.js';
import Order from '../models/Order.js';
import Report from '../models/Report.js';
import { success, error } from '../utils/apiResponse.js';

export const getStats = async (req, res) => {
  try {
    const [totalUsers, totalServices, totalOrders, totalReports] = await Promise.all([
      User.countDocuments({ role: 'student' }),
      Service.countDocuments({ isActive: true }),
      Order.countDocuments(),
      Report.countDocuments({ status: 'pending' }),
    ]);

    // Revenue from completed orders
    const revenueResult = await Order.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

    // Recent signups (last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const recentSignups = await User.countDocuments({
      createdAt: { $gte: thirtyDaysAgo },
      role: 'student',
    });

    // Orders by status
    const ordersByStatus = await Order.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    return success(res, {
      totalUsers,
      totalServices,
      totalOrders,
      totalRevenue,
      totalReports,
      recentSignups,
      ordersByStatus,
    });
  } catch (err) {
    return error(res, err.message, 500);
  }
};

export const getAdminUsers = async (req, res) => {
  try {
    const { search, page = 1, limit = 20 } = req.query;
    const filter = {};

    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await User.countDocuments(filter);
    const users = await User.find(filter)
      .select('-password -refreshToken')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    return success(res, {
      users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (err) {
    return error(res, err.message, 500);
  }
};

export const updateUser = async (req, res) => {
  try {
    const { action } = req.body; // 'ban', 'unban', 'verify'
    const user = await User.findById(req.params.id);

    if (!user) {
      return error(res, 'User not found.', 404);
    }

    switch (action) {
      case 'ban':
        user.isActive = false;
        break;
      case 'unban':
        user.isActive = true;
        break;
      case 'verify':
        user.isVerified = true;
        break;
      default:
        return error(res, 'Invalid action. Use "ban", "unban", or "verify".', 400);
    }

    await user.save();

    return success(res, { user: user.toPublicProfile() });
  } catch (err) {
    return error(res, err.message, 500);
  }
};

export const getAdminServices = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Service.countDocuments(filter);
    const services = await Service.find(filter)
      .populate('provider', 'firstName lastName email avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    return success(res, {
      services,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (err) {
    return error(res, err.message, 500);
  }
};

export const updateServiceStatus = async (req, res) => {
  try {
    const { status } = req.body; // 'active' (approve) or 'rejected'
    if (!['active', 'rejected', 'under-review', 'paused'].includes(status)) {
      return error(res, 'Invalid status.', 400);
    }

    const service = await Service.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('provider', 'firstName lastName email');

    if (!service) {
      return error(res, 'Service not found.', 404);
    }

    return success(res, { service });
  } catch (err) {
    return error(res, err.message, 500);
  }
};

export const getReports = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Report.countDocuments(filter);
    const reports = await Report.find(filter)
      .populate('reporter', 'firstName lastName email avatar')
      .populate('resolvedBy', 'firstName lastName')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    return success(res, {
      reports,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (err) {
    return error(res, err.message, 500);
  }
};

export const updateReport = async (req, res) => {
  try {
    const { status, adminNote } = req.body;
    if (!['reviewed', 'resolved', 'dismissed'].includes(status)) {
      return error(res, 'Invalid status.', 400);
    }

    const report = await Report.findById(req.params.id);
    if (!report) {
      return error(res, 'Report not found.', 404);
    }

    report.status = status;
    if (adminNote) report.adminNote = adminNote;
    report.resolvedBy = req.user._id;
    await report.save();

    return success(res, { report });
  } catch (err) {
    return error(res, err.message, 500);
  }
};

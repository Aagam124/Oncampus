import mongoose from 'mongoose';
import User from '../models/User.js';
import Service from '../models/Service.js';
import Project from '../models/Project.js';
import Order from '../models/Order.js';
import Report from '../models/Report.js';
import Review from '../models/Review.js';
import Notification from '../models/Notification.js';
import Announcement from '../models/Announcement.js';
import AdminAuditLog from '../models/AdminAuditLog.js';
import { recordAuditLog } from '../utils/auditLogger.js';
import { success, error, paginated } from '../utils/apiResponse.js';

// ==========================================
// 1. OVERVIEW & ANALYTICS
// ==========================================

export const getStats = async (req, res) => {
  try {
    const [
      totalUsers,
      activeUsers,
      pendingVerifications,
      totalProjects,
      activeServices,
      totalOrders,
      completedOrders,
      pendingOrders,
      openDisputes,
      unresolvedReports,
    ] = await Promise.all([
      User.countDocuments({ role: 'student' }),
      User.countDocuments({ role: 'student', isActive: true }),
      User.countDocuments({
        role: 'student',
        $or: [{ verificationStatus: 'pending' }, { isVerified: false, 'verificationDetails.submittedAt': { $ne: null } }],
      }),
      Project.countDocuments({ isActive: true }),
      Service.countDocuments({ isActive: true, status: 'active', portalStatus: 'published' }),
      Order.countDocuments(),
      Order.countDocuments({ status: 'completed' }),
      Order.countDocuments({ status: { $in: ['pending', 'accepted', 'in-progress'] } }),
      Order.countDocuments({ status: 'disputed' }),
      Report.countDocuments({ status: { $in: ['pending', 'reviewed'] } }),
    ]);

    // Gross Volume from completed orders
    const revenueResult = await Order.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);
    const grossVolume = revenueResult.length > 0 ? revenueResult[0].total : 0;

    // Recent signups (last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const recentSignups = await User.countDocuments({
      createdAt: { $gte: thirtyDaysAgo },
      role: 'student',
    });

    return success(res, {
      totalUsers,
      activeUsers,
      pendingVerifications,
      totalProjects,
      activeServices,
      totalOrders,
      completedOrders,
      pendingOrders,
      openDisputes,
      unresolvedReports,
      grossVolume,
      recentSignups,
    });
  } catch (err) {
    return error(res, err.message, 500);
  }
};

export const getAnalytics = async (req, res) => {
  try {
    const { timeframe = '30d' } = req.query;
    let days = 30;
    if (timeframe === '7d') days = 7;
    else if (timeframe === '90d') days = 90;
    else if (timeframe === '12m') days = 365;

    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    // 1. Registrations over time
    const registrations = await User.aggregate([
      { $match: { createdAt: { $gte: startDate }, role: 'student' } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // 2. Project creation trends
    const projectTrends = await Project.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // 3. Service publication trends
    const serviceTrends = await Service.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // 4. Order status breakdown
    const orderStatusDistribution = await Order.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 }, volume: { $sum: '$amount' } } },
    ]);

    // 5. Revenue by day
    const revenueTrends = await Order.aggregate([
      { $match: { createdAt: { $gte: startDate }, status: 'completed' } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          amount: { $sum: '$amount' },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // 6. Most popular student skills
    const popularSkills = await User.aggregate([
      { $match: { role: 'student', skills: { $exists: true, $ne: [] } } },
      { $unwind: '$skills' },
      { $group: { _id: '$skills', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 8 },
    ]);

    return success(res, {
      timeframe,
      registrations,
      projectTrends,
      serviceTrends,
      orderStatusDistribution,
      revenueTrends,
      popularSkills,
    });
  } catch (err) {
    return error(res, err.message, 500);
  }
};

export const getNeedsAttention = async (req, res) => {
  try {
    const [pendingVerifications, unresolvedReports, openDisputes, suspendedUsers] = await Promise.all([
      User.find({
        role: 'student',
        $or: [{ verificationStatus: 'pending' }, { isVerified: false, 'verificationDetails.submittedAt': { $ne: null } }],
      })
        .select('firstName lastName email university department verificationDetails createdAt')
        .limit(6),
      Report.find({ status: { $in: ['pending', 'reviewed'] } })
        .populate('reporter', 'firstName lastName email avatar')
        .sort({ createdAt: -1 })
        .limit(6),
      Order.find({ status: 'disputed' })
        .populate('client', 'firstName lastName email')
        .populate('provider', 'firstName lastName email')
        .populate('service', 'title')
        .sort({ updatedAt: -1 })
        .limit(6),
      User.find({ role: 'student', isActive: false })
        .select('firstName lastName email university suspensionDetails updatedAt')
        .sort({ updatedAt: -1 })
        .limit(6),
    ]);

    return success(res, {
      pendingVerifications,
      unresolvedReports,
      openDisputes,
      suspendedUsers,
    });
  } catch (err) {
    return error(res, err.message, 500);
  }
};

export const getRecentActivity = async (req, res) => {
  try {
    const { limit = 15 } = req.query;

    const [recentUsers, recentServices, recentProjects, recentOrders, recentAudits] = await Promise.all([
      User.find({ role: 'student' })
        .select('firstName lastName email avatar createdAt')
        .sort({ createdAt: -1 })
        .limit(parseInt(limit)),
      Service.find()
        .populate('provider', 'firstName lastName')
        .select('title category pricing createdAt')
        .sort({ createdAt: -1 })
        .limit(parseInt(limit)),
      Project.find()
        .populate('owner', 'firstName lastName')
        .select('title category budget createdAt')
        .sort({ createdAt: -1 })
        .limit(parseInt(limit)),
      Order.find()
        .populate('client', 'firstName lastName')
        .populate('provider', 'firstName lastName')
        .select('amount status createdAt')
        .sort({ createdAt: -1 })
        .limit(parseInt(limit)),
      AdminAuditLog.find()
        .populate('admin', 'firstName lastName email')
        .sort({ createdAt: -1 })
        .limit(parseInt(limit)),
    ]);

    // Merge activities into a unified timeline
    const activities = [
      ...recentUsers.map((u) => ({
        type: 'USER_REGISTERED',
        id: u._id,
        title: `${u.firstName} ${u.lastName} joined OnCampus`,
        timestamp: u.createdAt,
        meta: { email: u.email },
      })),
      ...recentServices.map((s) => ({
        type: 'SERVICE_CREATED',
        id: s._id,
        title: `Service published: "${s.title}"`,
        timestamp: s.createdAt,
        meta: { provider: s.provider ? `${s.provider.firstName} ${s.provider.lastName}` : 'Student' },
      })),
      ...recentProjects.map((p) => ({
        type: 'PROJECT_CREATED',
        id: p._id,
        title: `Project posted: "${p.title}"`,
        timestamp: p.createdAt,
        meta: { owner: p.owner ? `${p.owner.firstName} ${p.owner.lastName}` : 'Client' },
      })),
      ...recentOrders.map((o) => ({
        type: 'ORDER_UPDATE',
        id: o._id,
        title: `Order #${String(o._id).slice(-6).toUpperCase()} status: ${o.status}`,
        timestamp: o.createdAt,
        meta: { amount: o.amount },
      })),
      ...recentAudits.map((a) => ({
        type: 'ADMIN_ACTION',
        id: a._id,
        title: `Admin Action: ${a.action} on ${a.entityType}`,
        timestamp: a.createdAt,
        meta: { admin: a.admin ? `${a.admin.firstName} ${a.admin.lastName}` : 'Admin', reason: a.reason },
      })),
    ];

    activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    return success(res, {
      activities: activities.slice(0, parseInt(limit)),
    });
  } catch (err) {
    return error(res, err.message, 500);
  }
};

// ==========================================
// 2. USER & STUDENT MANAGEMENT
// ==========================================

export const getAdminUsers = async (req, res) => {
  try {
    const {
      search,
      university,
      department,
      status, // 'active', 'suspended'
      verificationStatus, // 'verified', 'pending', 'unverified', 'rejected'
      sort = 'newest',
      page = 1,
      limit = 20,
    } = req.query;

    const filter = { role: 'student' };

    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { 'verificationDetails.universityEmail': { $regex: search, $options: 'i' } },
      ];
    }

    if (university) filter.university = { $regex: university, $options: 'i' };
    if (department) filter.department = { $regex: department, $options: 'i' };

    if (status === 'active') filter.isActive = true;
    else if (status === 'suspended') filter.isActive = false;

    if (verificationStatus) {
      if (verificationStatus === 'verified') {
        filter.$or = [{ isVerified: true }, { verificationStatus: 'verified' }];
      } else if (verificationStatus === 'pending') {
        filter.verificationStatus = 'pending';
      } else if (verificationStatus === 'unverified') {
        filter.isVerified = false;
        filter.verificationStatus = { $ne: 'verified' };
      } else if (verificationStatus === 'rejected') {
        filter.verificationStatus = 'rejected';
      }
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'oldest') sortOption = { createdAt: 1 };
    else if (sort === 'name-asc') sortOption = { firstName: 1, lastName: 1 };
    else if (sort === 'name-desc') sortOption = { firstName: -1, lastName: -1 };

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await User.countDocuments(filter);
    const users = await User.find(filter)
      .select('-password -refreshToken')
      .sort(sortOption)
      .skip(skip)
      .limit(parseInt(limit));

    return paginated(res, users, page, limit, total);
  } catch (err) {
    return error(res, err.message, 500);
  }
};

export const getAdminUserDetail = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password -refreshToken')
      .populate('suspensionDetails.suspendedBy', 'firstName lastName email')
      .populate('verificationDetails.reviewedBy', 'firstName lastName email');

    if (!user) {
      return error(res, 'Student not found.', 404);
    }

    const [services, projects, ordersAsClient, ordersAsProvider, auditLogs] = await Promise.all([
      Service.find({ provider: user._id }),
      Project.find({ owner: user._id }),
      Order.find({ client: user._id }).populate('service', 'title').limit(10),
      Order.find({ provider: user._id }).populate('service', 'title').limit(10),
      AdminAuditLog.find({ entityId: String(user._id) })
        .populate('admin', 'firstName lastName email')
        .sort({ createdAt: -1 })
        .limit(10),
    ]);

    return success(res, {
      user,
      services,
      projects,
      orders: {
        asClient: ordersAsClient,
        asProvider: ordersAsProvider,
      },
      auditLogs,
    });
  } catch (err) {
    return error(res, err.message, 500);
  }
};

export const updateUserStatus = async (req, res) => {
  try {
    const { action, reason = '' } = req.body; // 'suspend', 'reactivate', 'verify', 'unverify'
    const user = await User.findById(req.params.id);

    if (!user) {
      return error(res, 'User not found.', 404);
    }

    const previousState = {
      isActive: user.isActive,
      isVerified: user.isVerified,
      verificationStatus: user.verificationStatus,
      suspensionDetails: user.suspensionDetails,
    };

    switch (action) {
      case 'suspend':
      case 'ban':
        user.isActive = false;
        user.suspensionDetails = {
          reason: reason || 'Violation of platform community standards',
          suspendedAt: new Date(),
          suspendedBy: req.user._id,
        };
        break;
      case 'reactivate':
      case 'unban':
        user.isActive = true;
        user.suspensionDetails = { reason: '', suspendedAt: null, suspendedBy: null };
        break;
      case 'verify':
        user.isVerified = true;
        user.verificationStatus = 'verified';
        user.verificationDetails = {
          ...user.verificationDetails,
          reviewedBy: req.user._id,
          reviewedAt: new Date(),
          rejectionReason: '',
        };
        break;
      case 'unverify':
        user.isVerified = false;
        user.verificationStatus = 'unverified';
        break;
      default:
        return error(res, 'Invalid action. Supported: "suspend", "reactivate", "verify", "unverify"', 400);
    }

    await user.save();

    // Record audit log
    await recordAuditLog({
      admin: req.user._id,
      action: `USER_${action.toUpperCase()}`,
      entityType: 'User',
      entityId: user._id,
      entityTitle: `${user.firstName} ${user.lastName} (${user.email})`,
      previousState,
      newState: { isActive: user.isActive, isVerified: user.isVerified, verificationStatus: user.verificationStatus },
      reason,
      req,
    });

    // Notify user
    await Notification.create({
      recipient: user._id,
      type: 'system',
      title: action === 'suspend' ? 'Account Suspended' : action === 'verify' ? 'Account Verified!' : 'Account Status Updated',
      message:
        action === 'suspend'
          ? `Your account was suspended by administration. Reason: ${reason || 'Terms violation'}`
          : action === 'verify'
          ? 'Congratulations! Your student verification was approved by administration.'
          : 'Your account status has been updated by administration.',
    });

    return success(res, { user: user.toPublicProfile() });
  } catch (err) {
    return error(res, err.message, 500);
  }
};

export const verifyStudentDecision = async (req, res) => {
  try {
    const { decision, reason = '' } = req.body; // 'approve', 'reject', 'request_info'
    const user = await User.findById(req.params.id);

    if (!user) {
      return error(res, 'Student not found.', 404);
    }

    const previousStatus = user.verificationStatus;

    if (decision === 'approve') {
      user.isVerified = true;
      user.verificationStatus = 'verified';
      user.verificationDetails.reviewedBy = req.user._id;
      user.verificationDetails.reviewedAt = new Date();
      user.verificationDetails.rejectionReason = '';
    } else if (decision === 'reject') {
      user.isVerified = false;
      user.verificationStatus = 'rejected';
      user.verificationDetails.reviewedBy = req.user._id;
      user.verificationDetails.reviewedAt = new Date();
      user.verificationDetails.rejectionReason = reason || 'Documentation could not be validated';
    } else if (decision === 'request_info') {
      user.verificationStatus = 'pending';
      user.verificationDetails.rejectionReason = reason || 'Additional proof of campus affiliation required';
    } else {
      return error(res, 'Invalid decision. Use "approve", "reject", or "request_info".', 400);
    }

    await user.save();

    await recordAuditLog({
      admin: req.user._id,
      action: `VERIFICATION_${decision.toUpperCase()}`,
      entityType: 'User',
      entityId: user._id,
      entityTitle: `${user.firstName} ${user.lastName}`,
      previousState: { verificationStatus: previousStatus },
      newState: { verificationStatus: user.verificationStatus, isVerified: user.isVerified },
      reason,
      req,
    });

    await Notification.create({
      recipient: user._id,
      type: 'system',
      title: decision === 'approve' ? 'Student Verification Approved!' : 'Verification Update',
      message:
        decision === 'approve'
          ? 'Your campus verification has been approved. You now feature the verified badge!'
          : decision === 'reject'
          ? `Verification application rejected: ${reason}`
          : `Additional verification info requested: ${reason}`,
    });

    return success(res, { user: user.toPublicProfile() });
  } catch (err) {
    return error(res, err.message, 500);
  }
};

export const getVerifications = async (req, res) => {
  try {
    const { status = 'pending', page = 1, limit = 20 } = req.query;
    const filter = { role: 'student' };

    if (status === 'pending') {
      filter.$or = [{ verificationStatus: 'pending' }, { isVerified: false, 'verificationDetails.submittedAt': { $ne: null } }];
    } else if (status === 'verified') {
      filter.isVerified = true;
    } else if (status === 'rejected') {
      filter.verificationStatus = 'rejected';
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await User.countDocuments(filter);
    const verifications = await User.find(filter)
      .select('firstName lastName email university department avatar isVerified verificationStatus verificationDetails createdAt')
      .populate('verificationDetails.reviewedBy', 'firstName lastName email')
      .sort({ 'verificationDetails.submittedAt': -1, createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    return paginated(res, verifications, page, limit, total);
  } catch (err) {
    return error(res, err.message, 500);
  }
};

// ==========================================
// 3. MARKETPLACE: PROJECTS & SERVICES
// ==========================================

export const getAdminProjects = async (req, res) => {
  try {
    const { search, category, type, status, portalStatus, page = 1, limit = 20 } = req.query;
    const filter = {};

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    if (category) filter.category = category;
    if (type) filter.type = type;
    if (status) filter.status = status;
    if (portalStatus) filter.portalStatus = portalStatus;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Project.countDocuments(filter);
    const projects = await Project.find(filter)
      .populate('owner', 'firstName lastName email avatar university')
      .populate('archivedBy', 'firstName lastName')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    return paginated(res, projects, page, limit, total);
  } catch (err) {
    return error(res, err.message, 500);
  }
};

export const updateProjectPortalStatus = async (req, res) => {
  try {
    const { action, reason = '' } = req.body; // 'publish', 'hide', 'archive', 'restore'
    const project = await Project.findById(req.params.id);

    if (!project) {
      return error(res, 'Project not found.', 404);
    }

    const previousState = { portalStatus: project.portalStatus, isActive: project.isActive };

    switch (action) {
      case 'publish':
      case 'restore':
        project.portalStatus = 'published';
        project.isActive = true;
        project.archivedAt = null;
        project.archivedBy = null;
        project.archiveReason = '';
        break;
      case 'hide':
      case 'unpublish':
        project.portalStatus = 'hidden';
        project.isActive = false;
        break;
      case 'archive':
        project.portalStatus = 'archived';
        project.isActive = false;
        project.archivedAt = new Date();
        project.archivedBy = req.user._id;
        project.archiveReason = reason;
        break;
      case 'remove':
        project.portalStatus = 'removed';
        project.isActive = false;
        break;
      default:
        return error(res, 'Invalid action. Supported: "publish", "hide", "archive", "restore", "remove"', 400);
    }

    await project.save();

    await recordAuditLog({
      admin: req.user._id,
      action: `PROJECT_${action.toUpperCase()}`,
      entityType: 'Project',
      entityId: project._id,
      entityTitle: project.title,
      previousState,
      newState: { portalStatus: project.portalStatus, isActive: project.isActive },
      reason,
      req,
    });

    // Notify project owner
    await Notification.create({
      recipient: project.owner,
      type: 'project',
      title: `Project Status: ${action.charAt(0).toUpperCase() + action.slice(1)}`,
      message: `Your project "${project.title}" has been set to ${project.portalStatus} by administration.${reason ? ` Reason: ${reason}` : ''}`,
    });

    return success(res, { project });
  } catch (err) {
    return error(res, err.message, 500);
  }
};

export const getAdminServices = async (req, res) => {
  try {
    const { search, category, status, portalStatus, page = 1, limit = 20 } = req.query;
    const filter = {};

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } },
      ];
    }

    if (category) filter.category = category;
    if (status) filter.status = status;
    if (portalStatus) filter.portalStatus = portalStatus;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Service.countDocuments(filter);
    const services = await Service.find(filter)
      .populate('provider', 'firstName lastName email avatar university')
      .populate('archivedBy', 'firstName lastName')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    return paginated(res, services, page, limit, total);
  } catch (err) {
    return error(res, err.message, 500);
  }
};

export const updateServicePortalStatus = async (req, res) => {
  try {
    const { action, reason = '' } = req.body; // 'publish', 'hide', 'archive', 'restore', 'remove', 'approve', 'reject'
    const service = await Service.findById(req.params.id);

    if (!service) {
      return error(res, 'Service not found.', 404);
    }

    const previousState = { portalStatus: service.portalStatus, status: service.status, isActive: service.isActive };

    switch (action) {
      case 'publish':
      case 'restore':
      case 'approve':
        service.portalStatus = 'published';
        service.status = 'active';
        service.isActive = true;
        service.archivedAt = null;
        service.archivedBy = null;
        service.archiveReason = '';
        break;
      case 'hide':
      case 'unpublish':
        service.portalStatus = 'hidden';
        service.isActive = false;
        break;
      case 'archive':
        service.portalStatus = 'archived';
        service.isActive = false;
        service.archivedAt = new Date();
        service.archivedBy = req.user._id;
        service.archiveReason = reason;
        break;
      case 'reject':
        service.status = 'rejected';
        service.portalStatus = 'hidden';
        service.isActive = false;
        break;
      case 'remove':
        service.portalStatus = 'removed';
        service.isActive = false;
        break;
      default:
        return error(res, 'Invalid action.', 400);
    }

    await service.save();

    await recordAuditLog({
      admin: req.user._id,
      action: `SERVICE_${action.toUpperCase()}`,
      entityType: 'Service',
      entityId: service._id,
      entityTitle: service.title,
      previousState,
      newState: { portalStatus: service.portalStatus, status: service.status, isActive: service.isActive },
      reason,
      req,
    });

    await Notification.create({
      recipient: service.provider,
      type: 'system',
      title: `Service Status Updated: ${action.charAt(0).toUpperCase() + action.slice(1)}`,
      message: `Your service "${service.title}" has been updated to ${service.portalStatus} by administration.${reason ? ` Reason: ${reason}` : ''}`,
    });

    return success(res, { service });
  } catch (err) {
    return error(res, err.message, 500);
  }
};

// ==========================================
// 4. ORDERS & DISPUTES
// ==========================================

export const getAdminOrders = async (req, res) => {
  try {
    const { search, status, page = 1, limit = 20 } = req.query;
    const filter = {};

    if (status) filter.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Order.countDocuments(filter);
    const orders = await Order.find(filter)
      .populate('service', 'title category price pricing')
      .populate('client', 'firstName lastName email avatar')
      .populate('provider', 'firstName lastName email avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    return paginated(res, orders, page, limit, total);
  } catch (err) {
    return error(res, err.message, 500);
  }
};

export const getAdminOrderDetail = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('service')
      .populate('client', 'firstName lastName email avatar phone')
      .populate('provider', 'firstName lastName email avatar phone')
      .populate('messages.sender', 'firstName lastName avatar')
      .populate('disputeDetails.assignedAdmin', 'firstName lastName email')
      .populate('disputeDetails.openedBy', 'firstName lastName email');

    if (!order) {
      return error(res, 'Order not found.', 404);
    }

    return success(res, { order });
  } catch (err) {
    return error(res, err.message, 500);
  }
};

export const resolveDispute = async (req, res) => {
  try {
    const { resolution, resolutionNote, internalNotes } = req.body; // 'buyer', 'seller', 'closed'
    const order = await Order.findById(req.params.id);

    if (!order) {
      return error(res, 'Order not found.', 404);
    }

    if (!['buyer', 'seller', 'closed'].includes(resolution)) {
      return error(res, 'Invalid resolution. Must be "buyer", "seller", or "closed".', 400);
    }

    const previousStatus = order.status;

    order.disputeDetails = {
      ...order.disputeDetails,
      resolution,
      resolutionNote: resolutionNote || '',
      internalNotes: internalNotes || order.disputeDetails?.internalNotes || '',
      assignedAdmin: req.user._id,
      resolvedAt: new Date(),
    };

    if (resolution === 'buyer') {
      order.status = 'cancelled';
    } else if (resolution === 'seller') {
      order.status = 'completed';
    } else {
      order.status = 'cancelled';
    }

    await order.save();

    await recordAuditLog({
      admin: req.user._id,
      action: 'DISPUTE_RESOLVED',
      entityType: 'Order',
      entityId: order._id,
      entityTitle: `Order #${String(order._id).slice(-6).toUpperCase()}`,
      previousState: { status: previousStatus },
      newState: { status: order.status, resolution },
      reason: resolutionNote,
      req,
    });

    // Notify both client and provider
    const resolutionMessage = `Dispute resolved in favor of ${resolution}. Note: ${resolutionNote || 'Administrative adjudication.'}`;
    await Promise.all([
      Notification.create({
        recipient: order.client,
        type: 'order',
        title: 'Dispute Adjudicated',
        message: resolutionMessage,
      }),
      Notification.create({
        recipient: order.provider,
        type: 'order',
        title: 'Dispute Adjudicated',
        message: resolutionMessage,
      }),
    ]);

    return success(res, { order });
  } catch (err) {
    return error(res, err.message, 500);
  }
};

// ==========================================
// 5. PORTAL MANAGEMENT (MOST IMPORTANT FEATURE)
// ==========================================

export const getPortalContent = async (req, res) => {
  try {
    const { type = 'all', status, search, page = 1, limit = 20 } = req.query;

    let items = [];
    let total = 0;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    if (type === 'services' || type === 'all') {
      const sFilter = {};
      if (status) sFilter.portalStatus = status;
      if (search) sFilter.title = { $regex: search, $options: 'i' };

      const [services, sCount] = await Promise.all([
        Service.find(sFilter)
          .populate('provider', 'firstName lastName email avatar university')
          .sort({ updatedAt: -1 })
          .skip(type === 'services' ? skip : 0)
          .limit(type === 'services' ? parseInt(limit) : 10),
        Service.countDocuments(sFilter),
      ]);

      items.push(
        ...services.map((s) => ({
          _id: s._id,
          entityType: 'Service',
          title: s.title,
          category: s.category,
          owner: s.provider,
          portalStatus: s.portalStatus || 'published',
          isActive: s.isActive,
          createdAt: s.createdAt,
          updatedAt: s.updatedAt,
          details: { price: s.pricing?.amount || 0, rating: s.rating },
        }))
      );
      if (type === 'services') total = sCount;
    }

    if (type === 'projects' || type === 'all') {
      const pFilter = {};
      if (status) pFilter.portalStatus = status;
      if (search) pFilter.title = { $regex: search, $options: 'i' };

      const [projects, pCount] = await Promise.all([
        Project.find(pFilter)
          .populate('owner', 'firstName lastName email avatar university')
          .sort({ updatedAt: -1 })
          .skip(type === 'projects' ? skip : 0)
          .limit(type === 'projects' ? parseInt(limit) : 10),
        Project.countDocuments(pFilter),
      ]);

      items.push(
        ...projects.map((p) => ({
          _id: p._id,
          entityType: 'Project',
          title: p.title,
          category: p.category,
          owner: p.owner,
          portalStatus: p.portalStatus || 'published',
          isActive: p.isActive,
          createdAt: p.createdAt,
          updatedAt: p.updatedAt,
          details: { budget: p.budget?.min || p.budget?.max || 0, type: p.type },
        }))
      );
      if (type === 'projects') total = pCount;
    }

    if (type === 'students' || type === 'all') {
      const uFilter = { role: 'student' };
      if (status) uFilter.portalStatus = status;
      if (search) {
        uFilter.$or = [
          { firstName: { $regex: search, $options: 'i' } },
          { lastName: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
        ];
      }

      const [users, uCount] = await Promise.all([
        User.find(uFilter)
          .select('firstName lastName email avatar university department portalStatus isActive createdAt updatedAt')
          .sort({ updatedAt: -1 })
          .skip(type === 'students' ? skip : 0)
          .limit(type === 'students' ? parseInt(limit) : 10),
        User.countDocuments(uFilter),
      ]);

      items.push(
        ...users.map((u) => ({
          _id: u._id,
          entityType: 'Student',
          title: `${u.firstName} ${u.lastName}`,
          category: u.department || 'Student',
          owner: u,
          portalStatus: u.portalStatus || 'published',
          isActive: u.isActive,
          createdAt: u.createdAt,
          updatedAt: u.updatedAt,
          details: { university: u.university },
        }))
      );
      if (type === 'students') total = uCount;
    }

    if (type === 'all') {
      total = items.length;
      items.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
      items = items.slice(skip, skip + parseInt(limit));
    }

    return paginated(res, items, page, limit, total);
  } catch (err) {
    return error(res, err.message, 500);
  }
};

export const bulkPortalAction = async (req, res) => {
  try {
    const { action, items } = req.body; // items: [{ id, entityType }]
    if (!Array.isArray(items) || items.length === 0) {
      return error(res, 'No items provided for bulk operation.', 400);
    }

    if (!['hide', 'publish', 'archive', 'restore'].includes(action)) {
      return error(res, 'Invalid action. Supported: "hide", "publish", "archive", "restore"', 400);
    }

    const portalStatus = action === 'publish' || action === 'restore' ? 'published' : action === 'hide' ? 'hidden' : 'archived';
    const isActive = portalStatus === 'published';

    for (const item of items) {
      if (item.entityType === 'Service') {
        await Service.findByIdAndUpdate(item.id, { portalStatus, isActive });
      } else if (item.entityType === 'Project') {
        await Project.findByIdAndUpdate(item.id, { portalStatus, isActive });
      } else if (item.entityType === 'Student') {
        await User.findByIdAndUpdate(item.id, { portalStatus, isActive });
      }
    }

    await recordAuditLog({
      admin: req.user._id,
      action: `PORTAL_BULK_${action.toUpperCase()}`,
      entityType: 'Setting',
      entityId: 'BULK',
      entityTitle: `${items.length} items set to ${portalStatus}`,
      newState: { count: items.length, action, portalStatus },
      reason: `Bulk action applied to ${items.length} items.`,
      req,
    });

    return success(res, { message: `Successfully updated ${items.length} items to ${portalStatus}.` });
  } catch (err) {
    return error(res, err.message, 500);
  }
};

export const getArchivedContent = async (req, res) => {
  try {
    const [archivedServices, archivedProjects, archivedAnnouncements] = await Promise.all([
      Service.find({ portalStatus: 'archived' })
        .populate('provider', 'firstName lastName email avatar')
        .populate('archivedBy', 'firstName lastName')
        .sort({ archivedAt: -1 }),
      Project.find({ portalStatus: 'archived' })
        .populate('owner', 'firstName lastName email avatar')
        .populate('archivedBy', 'firstName lastName')
        .sort({ archivedAt: -1 }),
      Announcement.find({ status: 'archived' })
        .populate('author', 'firstName lastName')
        .sort({ updatedAt: -1 }),
    ]);

    const combined = [
      ...archivedServices.map((s) => ({
        _id: s._id,
        entityType: 'Service',
        title: s.title,
        owner: s.provider,
        archivedAt: s.archivedAt || s.updatedAt,
        archivedBy: s.archivedBy,
        archiveReason: s.archiveReason || 'Administrative archive',
      })),
      ...archivedProjects.map((p) => ({
        _id: p._id,
        entityType: 'Project',
        title: p.title,
        owner: p.owner,
        archivedAt: p.archivedAt || p.updatedAt,
        archivedBy: p.archivedBy,
        archiveReason: p.archiveReason || 'Administrative archive',
      })),
      ...archivedAnnouncements.map((a) => ({
        _id: a._id,
        entityType: 'Announcement',
        title: a.title,
        owner: a.author,
        archivedAt: a.updatedAt,
        archivedBy: a.author,
        archiveReason: 'Archived announcement',
      })),
    ];

    combined.sort((a, b) => new Date(b.archivedAt) - new Date(a.archivedAt));

    return success(res, { archivedContent: combined });
  } catch (err) {
    return error(res, err.message, 500);
  }
};

// ==========================================
// 6. REPORTS & CONTENT MODERATION
// ==========================================

export const getReports = async (req, res) => {
  try {
    const { status, targetType, page = 1, limit = 20 } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (targetType) filter.targetType = targetType;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Report.countDocuments(filter);
    const reports = await Report.find(filter)
      .populate('reporter', 'firstName lastName email avatar')
      .populate('resolvedBy', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    return paginated(res, reports, page, limit, total);
  } catch (err) {
    return error(res, err.message, 500);
  }
};

export const updateReport = async (req, res) => {
  try {
    const { status, adminNote, takeAction } = req.body; // takeAction: 'hide_content' | 'suspend_user' | 'none'
    const report = await Report.findById(req.params.id);

    if (!report) {
      return error(res, 'Report not found.', 404);
    }

    const previousStatus = report.status;
    report.status = status || report.status;
    if (adminNote) report.adminNote = adminNote;
    report.resolvedBy = req.user._id;

    // Optional enforcement action
    if (takeAction === 'hide_content') {
      if (report.targetType === 'service') {
        await Service.findByIdAndUpdate(report.targetId, { portalStatus: 'hidden', isActive: false });
      } else if (report.targetType === 'project') {
        await Project.findByIdAndUpdate(report.targetId, { portalStatus: 'hidden', isActive: false });
      }
    } else if (takeAction === 'suspend_user') {
      const targetUserId = report.targetType === 'user' ? report.targetId : null;
      if (targetUserId) {
        await User.findByIdAndUpdate(targetUserId, {
          isActive: false,
          'suspensionDetails.reason': `Suspended due to report #${String(report._id).slice(-6)}: ${report.reason}`,
          'suspensionDetails.suspendedAt': new Date(),
          'suspensionDetails.suspendedBy': req.user._id,
        });
      }
    }

    await report.save();

    await recordAuditLog({
      admin: req.user._id,
      action: `REPORT_${report.status.toUpperCase()}`,
      entityType: 'Report',
      entityId: report._id,
      entityTitle: `Report on ${report.targetType}: ${report.reason}`,
      previousState: { status: previousStatus },
      newState: { status: report.status, adminNote: report.adminNote, actionTaken: takeAction },
      reason: adminNote,
      req,
    });

    return success(res, { report });
  } catch (err) {
    return error(res, err.message, 500);
  }
};

// ==========================================
// 7. ANNOUNCEMENTS & NOTIFICATIONS
// ==========================================

export const getAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find()
      .populate('author', 'firstName lastName email')
      .sort({ createdAt: -1 });

    return success(res, { announcements });
  } catch (err) {
    return error(res, err.message, 500);
  }
};

export const createAnnouncement = async (req, res) => {
  try {
    const { title, content, targetAudience = 'all', priority = 'normal', status = 'published' } = req.body;

    const announcement = await Announcement.create({
      title,
      content,
      author: req.user._id,
      targetAudience,
      priority,
      status,
    });

    await recordAuditLog({
      admin: req.user._id,
      action: 'ANNOUNCEMENT_CREATED',
      entityType: 'Announcement',
      entityId: announcement._id,
      entityTitle: announcement.title,
      newState: { title, targetAudience, priority, status },
      reason: 'Platform announcement broadcast',
      req,
    });

    return success(res, { announcement }, 201);
  } catch (err) {
    return error(res, err.message, 500);
  }
};

export const updateAnnouncement = async (req, res) => {
  try {
    const { title, content, targetAudience, priority, status } = req.body;
    const announcement = await Announcement.findByIdAndUpdate(
      req.params.id,
      { title, content, targetAudience, priority, status },
      { new: true }
    );

    if (!announcement) {
      return error(res, 'Announcement not found.', 404);
    }

    return success(res, { announcement });
  } catch (err) {
    return error(res, err.message, 500);
  }
};

export const deleteAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findByIdAndDelete(req.params.id);
    if (!announcement) {
      return error(res, 'Announcement not found.', 404);
    }
    return success(res, { message: 'Announcement deleted.' });
  } catch (err) {
    return error(res, err.message, 500);
  }
};

export const broadcastNotification = async (req, res) => {
  try {
    const { title, content, targetGroup = 'all', type = 'system' } = req.body;

    const filter = { isActive: true };
    if (targetGroup === 'students') filter.role = 'student';
    else if (targetGroup === 'verified') filter.isVerified = true;

    const users = await User.find(filter).select('_id');
    const safeType = ['order', 'message', 'review', 'project', 'system'].includes(type) ? type : 'system';
    const notifications = users.map((u) => ({
      recipient: u._id,
      type: safeType,
      title: title || 'Campus Broadcast',
      message: content || 'Important announcement from campus administration.',
    }));

    await Notification.insertMany(notifications);

    await recordAuditLog({
      admin: req.user._id,
      action: 'NOTIFICATION_BROADCAST',
      entityType: 'Announcement',
      entityId: 'BROADCAST',
      entityTitle: title,
      newState: { targetGroup, recipientCount: users.length },
      reason: content,
      req,
    });

    return success(res, { message: `Notification broadcasted to ${users.length} users.` });
  } catch (err) {
    return error(res, err.message, 500);
  }
};

// ==========================================
// 8. PLATFORM HEALTH MONITOR
// ==========================================

export const getPlatformHealth = async (req, res) => {
  try {
    const dbState = mongoose.connection.readyState;
    const dbStateMap = {
      0: 'Disconnected',
      1: 'Connected & Optimal',
      2: 'Connecting',
      3: 'Disconnecting',
    };

    const startTime = Date.now();
    await mongoose.connection.db.admin().ping();
    const pingLatency = Date.now() - startTime;

    const memoryUsage = process.memoryUsage();
    const uptimeSeconds = process.uptime();

    return success(res, {
      api: {
        status: 'Operational',
        uptime: uptimeSeconds,
        nodeVersion: process.version,
        platform: process.platform,
      },
      database: {
        status: dbState === 1 ? 'Healthy' : 'Degraded',
        connectionState: dbStateMap[dbState] || 'Unknown',
        host: mongoose.connection.host || 'Atlas Cluster',
        latencyMs: pingLatency,
        lastCheck: new Date().toISOString(),
      },
      memory: {
        rssMb: Math.round(memoryUsage.rss / (1024 * 1024)),
        heapTotalMb: Math.round(memoryUsage.heapTotal / (1024 * 1024)),
        heapUsedMb: Math.round(memoryUsage.heapUsed / (1024 * 1024)),
      },
    });
  } catch (err) {
    return error(res, `Health check error: ${err.message}`, 500);
  }
};

// ==========================================
// 9. AUDIT LOGS & SECURITY ROLES
// ==========================================

export const getAuditLogs = async (req, res) => {
  try {
    const { action, entityType, adminId, page = 1, limit = 25 } = req.query;
    const filter = {};

    if (action) filter.action = { $regex: action, $options: 'i' };
    if (entityType) filter.entityType = entityType;
    if (adminId) filter.admin = adminId;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await AdminAuditLog.countDocuments(filter);
    const logs = await AdminAuditLog.find(filter)
      .populate('admin', 'firstName lastName email avatar role adminRole')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    return paginated(res, logs, page, limit, total);
  } catch (err) {
    return error(res, err.message, 500);
  }
};

export const getAdminRoles = async (req, res) => {
  try {
    const admins = await User.find({ role: 'admin' })
      .select('firstName lastName email avatar role adminRole isVerified isActive createdAt')
      .sort({ createdAt: 1 });

    return success(res, { admins });
  } catch (err) {
    return error(res, err.message, 500);
  }
};

export const updateAdminRole = async (req, res) => {
  try {
    const { adminRole } = req.body; // 'super_admin', 'admin', 'moderator'
    if (!['super_admin', 'admin', 'moderator'].includes(adminRole)) {
      return error(res, 'Invalid admin role.', 400);
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return error(res, 'User not found.', 404);
    }

    const previousRole = user.adminRole;
    user.role = 'admin';
    user.adminRole = adminRole;
    await user.save();

    await recordAuditLog({
      admin: req.user._id,
      action: 'ADMIN_ROLE_UPDATED',
      entityType: 'User',
      entityId: user._id,
      entityTitle: `${user.firstName} ${user.lastName}`,
      previousState: { adminRole: previousRole },
      newState: { adminRole },
      reason: 'Role permissions reassigned by Super Admin',
      req,
    });

    return success(res, { user: user.toPublicProfile() });
  } catch (err) {
    return error(res, err.message, 500);
  }
};

import Project from '../models/Project.js';
import Notification from '../models/Notification.js';
import { success, error, paginated } from '../utils/apiResponse.js';

export const getProjects = async (req, res) => {
  try {
    const { search, category, type, status, skills, page = 1, limit = 12 } = req.query;
    const filter = {
      isActive: true,
      portalStatus: { $nin: ['hidden', 'archived', 'removed'] },
    };

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    if (category) filter.category = category;
    if (type) filter.type = type;
    if (status) filter.status = status;
    if (skills) {
      const skillsArray = skills.split(',').map((s) => s.trim());
      filter.skills = { $in: skillsArray };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Project.countDocuments(filter);
    const projects = await Project.find(filter)
      .populate('owner', 'firstName lastName avatar headline university')
      .populate('members', 'firstName lastName avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    return paginated(res, projects, page, limit, total);
  } catch (err) {
    return error(res, err.message, 500);
  }
};

export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('owner', 'firstName lastName avatar headline university bio skills isActive portalStatus')
      .populate('members', 'firstName lastName avatar headline')
      .populate('applications.applicant', 'firstName lastName avatar headline skills');

    if (!project) {
      return error(res, 'Project not found.', 404);
    }

    if (
      (!project.isActive ||
        ['hidden', 'archived', 'removed'].includes(project.portalStatus) ||
        !project.owner?.isActive ||
        ['hidden', 'archived', 'removed'].includes(project.owner?.portalStatus)) &&
      req.user?.role !== 'admin'
    ) {
      return error(res, 'This project is currently unavailable or has been removed from the portal.', 404);
    }

    return success(res, { project });
  } catch (err) {
    return error(res, err.message, 500);
  }
};

export const createProject = async (req, res) => {
  try {
    const { title, description, category, skills, type, budget, timeline, maxCollaborators } = req.body;

    const project = new Project({
      owner: req.user._id,
      title,
      description,
      category,
      skills: skills || [],
      type: type || 'collaboration',
      budget: budget || {},
      timeline: timeline || '',
      maxCollaborators: maxCollaborators || 5,
      members: [req.user._id],
    });

    await project.save();
    await project.populate('owner', 'firstName lastName avatar headline');

    return success(res, { project }, 201);
  } catch (err) {
    return error(res, err.message, 500);
  }
};

export const updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return error(res, 'Project not found.', 404);
    }

    if (project.owner.toString() !== req.user._id.toString()) {
      return error(res, 'Not authorized to update this project.', 403);
    }

    const allowedFields = ['title', 'description', 'category', 'skills', 'type', 'budget', 'timeline', 'maxCollaborators', 'status'];
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        project[field] = req.body[field];
      }
    }

    await project.save();
    await project.populate('owner', 'firstName lastName avatar headline');

    return success(res, { project });
  } catch (err) {
    return error(res, err.message, 500);
  }
};

export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return error(res, 'Project not found.', 404);
    }

    const isOwner = project.owner.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return error(res, 'Not authorized to delete this project.', 403);
    }

    project.isActive = false;
    await project.save();

    return success(res, { message: 'Project deleted successfully.' });
  } catch (err) {
    return error(res, err.message, 500);
  }
};

export const applyToProject = async (req, res) => {
  try {
    const { message } = req.body;
    const project = await Project.findById(req.params.id);

    if (!project || !project.isActive) {
      return error(res, 'Project not found.', 404);
    }

    if (project.status !== 'open') {
      return error(res, 'Project is not accepting applications.', 400);
    }

    if (project.owner.toString() === req.user._id.toString()) {
      return error(res, 'You cannot apply to your own project.', 400);
    }

    // Check if already applied
    const alreadyApplied = project.applications.find(
      (app) => app.applicant.toString() === req.user._id.toString()
    );
    if (alreadyApplied) {
      return error(res, 'You have already applied to this project.', 400);
    }

    project.applications.push({
      applicant: req.user._id,
      message: message || '',
    });

    await project.save();

    // Notify project owner
    await Notification.create({
      recipient: project.owner,
      type: 'project',
      title: 'New Application',
      message: `Someone applied to your project "${project.title}".`,
      link: `/projects/${project._id}`,
    });

    return success(res, { message: 'Application submitted successfully.' });
  } catch (err) {
    return error(res, err.message, 500);
  }
};

export const handleApplication = async (req, res) => {
  try {
    const { status } = req.body; // 'accepted' or 'rejected'
    if (!['accepted', 'rejected'].includes(status)) {
      return error(res, 'Status must be "accepted" or "rejected".', 400);
    }

    const project = await Project.findById(req.params.id);
    if (!project) {
      return error(res, 'Project not found.', 404);
    }

    if (project.owner.toString() !== req.user._id.toString()) {
      return error(res, 'Only the project owner can manage applications.', 403);
    }

    const application = project.applications.id(req.params.applicationId);
    if (!application) {
      return error(res, 'Application not found.', 404);
    }

    application.status = status;

    if (status === 'accepted') {
      // Add to members if not already there
      if (!project.members.includes(application.applicant)) {
        project.members.push(application.applicant);
      }
    }

    await project.save();

    // Notify applicant
    await Notification.create({
      recipient: application.applicant,
      type: 'project',
      title: `Application ${status.charAt(0).toUpperCase() + status.slice(1)}`,
      message: `Your application to "${project.title}" was ${status}.`,
      link: `/projects/${project._id}`,
    });

    return success(res, { project });
  } catch (err) {
    return error(res, err.message, 500);
  }
};

export const getMyProjects = async (req, res) => {
  try {
    const projects = await Project.find({ owner: req.user._id })
      .populate('owner', 'firstName lastName avatar headline')
      .populate('members', 'firstName lastName avatar')
      .sort({ createdAt: -1 });

    return success(res, { projects });
  } catch (err) {
    return error(res, err.message, 500);
  }
};

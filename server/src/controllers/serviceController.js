import Service from '../models/Service.js';
import { success, error, paginated } from '../utils/apiResponse.js';

export const getServices = async (req, res) => {
  try {
    const {
      search, category, pricingType, minPrice, maxPrice,
      sort = 'newest', page = 1, limit = 12,
    } = req.query;

    const filter = { isActive: true, status: 'active' };

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } },
      ];
    }

    if (category) filter.category = category;
    if (pricingType) filter['pricing.type'] = pricingType;
    if (minPrice) filter['pricing.amount'] = { ...filter['pricing.amount'], $gte: parseFloat(minPrice) };
    if (maxPrice) filter['pricing.amount'] = { ...filter['pricing.amount'], $lte: parseFloat(maxPrice) };

    let sortOption = {};
    switch (sort) {
      case 'price-low': sortOption = { 'pricing.amount': 1 }; break;
      case 'price-high': sortOption = { 'pricing.amount': -1 }; break;
      case 'rating': sortOption = { rating: -1 }; break;
      case 'newest':
      default: sortOption = { createdAt: -1 }; break;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Service.countDocuments(filter);
    const services = await Service.find(filter)
      .populate('provider', 'firstName lastName avatar headline university rating')
      .sort(sortOption)
      .skip(skip)
      .limit(parseInt(limit));

    return paginated(res, services, page, limit, total);
  } catch (err) {
    return error(res, err.message, 500);
  }
};

export const getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id)
      .populate('provider', 'firstName lastName avatar headline university bio rating reviewCount skills socialLinks');

    if (!service) {
      return error(res, 'Service not found.', 404);
    }

    return success(res, { service });
  } catch (err) {
    return error(res, err.message, 500);
  }
};

export const createService = async (req, res) => {
  try {
    const { title, description, category, tags, pricing, deliveryTime, images } = req.body;

    const service = new Service({
      provider: req.user._id,
      title,
      description,
      category,
      tags: tags || [],
      pricing,
      deliveryTime,
      images: images || [],
    });

    await service.save();
    await service.populate('provider', 'firstName lastName avatar headline');

    return success(res, { service }, 201);
  } catch (err) {
    return error(res, err.message, 500);
  }
};

export const updateService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return error(res, 'Service not found.', 404);
    }

    if (service.provider.toString() !== req.user._id.toString()) {
      return error(res, 'Not authorized to update this service.', 403);
    }

    const allowedFields = ['title', 'description', 'category', 'tags', 'pricing', 'deliveryTime', 'images', 'status'];
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        service[field] = req.body[field];
      }
    }

    await service.save();
    await service.populate('provider', 'firstName lastName avatar headline');

    return success(res, { service });
  } catch (err) {
    return error(res, err.message, 500);
  }
};

export const deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return error(res, 'Service not found.', 404);
    }

    const isOwner = service.provider.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return error(res, 'Not authorized to delete this service.', 403);
    }

    service.isActive = false;
    await service.save();

    return success(res, { message: 'Service deleted successfully.' });
  } catch (err) {
    return error(res, err.message, 500);
  }
};

export const getMyServices = async (req, res) => {
  try {
    const services = await Service.find({ provider: req.user._id })
      .populate('provider', 'firstName lastName avatar headline')
      .sort({ createdAt: -1 });

    return success(res, { services });
  } catch (err) {
    return error(res, err.message, 500);
  }
};

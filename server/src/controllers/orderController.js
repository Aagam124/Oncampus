import Order from '../models/Order.js';
import Service from '../models/Service.js';
import Notification from '../models/Notification.js';
import { success, error } from '../utils/apiResponse.js';

export const createOrder = async (req, res) => {
  try {
    const { serviceId, requirements } = req.body;

    const service = await Service.findById(serviceId).populate('provider');
    if (!service || !service.isActive) {
      return error(res, 'Service not found or inactive.', 404);
    }

    if (service.provider._id.toString() === req.user._id.toString()) {
      return error(res, 'You cannot order your own service.', 400);
    }

    const order = new Order({
      service: service._id,
      client: req.user._id,
      provider: service.provider._id,
      requirements: requirements || '',
      amount: service.pricing.amount,
      deliveryDate: new Date(Date.now() + service.deliveryTime * 24 * 60 * 60 * 1000),
    });

    await order.save();

    // Update order count on service
    service.orderCount += 1;
    await service.save();

    // Create notification for provider
    await Notification.create({
      recipient: service.provider._id,
      type: 'order',
      title: 'New Order Received',
      message: `You have a new order for "${service.title}".`,
      link: `/orders/${order._id}`,
    });

    await order.populate([
      { path: 'client', select: 'firstName lastName avatar' },
      { path: 'provider', select: 'firstName lastName avatar' },
      { path: 'service', select: 'title pricing' },
    ]);

    return success(res, { order }, 201);
  } catch (err) {
    return error(res, err.message, 500);
  }
};

export const getOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const userId = req.user._id;

    const filter = {
      $or: [{ client: userId }, { provider: userId }],
    };

    if (status) filter.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Order.countDocuments(filter);

    const orders = await Order.find(filter)
      .populate('client', 'firstName lastName avatar')
      .populate('provider', 'firstName lastName avatar')
      .populate('service', 'title pricing images')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    return success(res, {
      orders,
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

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('client', 'firstName lastName avatar email')
      .populate('provider', 'firstName lastName avatar email')
      .populate('service', 'title description pricing images deliveryTime')
      .populate('messages.sender', 'firstName lastName avatar')
      .populate('clientReview')
      .populate('providerReview');

    if (!order) {
      return error(res, 'Order not found.', 404);
    }

    // Only client or provider can view the order
    const userId = req.user._id.toString();
    if (order.client._id.toString() !== userId && order.provider._id.toString() !== userId && req.user.role !== 'admin') {
      return error(res, 'Not authorized to view this order.', 403);
    }

    return success(res, { order });
  } catch (err) {
    return error(res, err.message, 500);
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return error(res, 'Order not found.', 404);
    }

    const userId = req.user._id.toString();
    const isClient = order.client.toString() === userId;
    const isProvider = order.provider.toString() === userId;

    if (!isClient && !isProvider) {
      return error(res, 'Not authorized.', 403);
    }

    // Validate status transitions
    const validTransitions = {
      pending: ['accepted', 'cancelled'],
      accepted: ['in-progress', 'cancelled'],
      'in-progress': ['delivered'],
      delivered: ['completed', 'disputed'],
      completed: [],
      cancelled: [],
      disputed: [],
    };

    if (!validTransitions[order.status]?.includes(status)) {
      return error(res, `Cannot transition from "${order.status}" to "${status}".`, 400);
    }

    // Role-based checks
    if (['accepted'].includes(status) && !isProvider) {
      return error(res, 'Only the provider can accept this order.', 403);
    }
    if (['in-progress', 'delivered'].includes(status) && !isProvider) {
      return error(res, 'Only the provider can update this status.', 403);
    }
    if (status === 'completed' && !isClient) {
      return error(res, 'Only the client can mark the order as completed.', 403);
    }
    if (status === 'cancelled' && !['pending', 'accepted'].includes(order.status)) {
      return error(res, 'Can only cancel pending or accepted orders.', 400);
    }

    order.status = status;
    await order.save();

    // Create notification
    const recipientId = isClient ? order.provider : order.client;
    await Notification.create({
      recipient: recipientId,
      type: 'order',
      title: 'Order Status Updated',
      message: `Order status changed to "${status}".`,
      link: `/orders/${order._id}`,
    });

    await order.populate([
      { path: 'client', select: 'firstName lastName avatar' },
      { path: 'provider', select: 'firstName lastName avatar' },
      { path: 'service', select: 'title pricing' },
    ]);

    return success(res, { order });
  } catch (err) {
    return error(res, err.message, 500);
  }
};

export const addOrderMessage = async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) {
      return error(res, 'Message content is required.', 400);
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return error(res, 'Order not found.', 404);
    }

    const userId = req.user._id.toString();
    if (order.client.toString() !== userId && order.provider.toString() !== userId) {
      return error(res, 'Not authorized.', 403);
    }

    order.messages.push({
      sender: req.user._id,
      content,
    });

    await order.save();
    await order.populate('messages.sender', 'firstName lastName avatar');

    return success(res, { messages: order.messages });
  } catch (err) {
    return error(res, err.message, 500);
  }
};

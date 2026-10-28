import Review from '../models/Review.js';
import Order from '../models/Order.js';
import User from '../models/User.js';
import Service from '../models/Service.js';
import { success, error } from '../utils/apiResponse.js';

export const createReview = async (req, res) => {
  try {
    const { orderId, rating, comment } = req.body;

    if (!orderId || !rating) {
      return error(res, 'Order ID and rating are required.', 400);
    }

    if (rating < 1 || rating > 5) {
      return error(res, 'Rating must be between 1 and 5.', 400);
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return error(res, 'Order not found.', 404);
    }

    if (order.status !== 'completed') {
      return error(res, 'Can only review completed orders.', 400);
    }

    const userId = req.user._id.toString();
    const isClient = order.client.toString() === userId;
    const isProvider = order.provider.toString() === userId;

    if (!isClient && !isProvider) {
      return error(res, 'Not authorized to review this order.', 403);
    }

    // Determine reviewer/reviewee
    let reviewee;
    if (isClient) {
      // Client reviews the provider
      if (order.clientReview) {
        return error(res, 'You have already reviewed this order.', 400);
      }
      reviewee = order.provider;
    } else {
      // Provider reviews the client
      if (order.providerReview) {
        return error(res, 'You have already reviewed this order.', 400);
      }
      reviewee = order.client;
    }

    const review = new Review({
      order: order._id,
      reviewer: req.user._id,
      reviewee,
      service: order.service,
      rating,
      comment: comment || '',
    });

    await review.save();

    // Link review to order
    if (isClient) {
      order.clientReview = review._id;
    } else {
      order.providerReview = review._id;
    }
    await order.save();

    // Update reviewee's average rating
    const userReviews = await Review.find({ reviewee });
    const avgRating = userReviews.reduce((sum, r) => sum + r.rating, 0) / userReviews.length;
    await User.findByIdAndUpdate(reviewee, {
      rating: Math.round(avgRating * 10) / 10,
      reviewCount: userReviews.length,
    });

    // Update service's average rating (only client reviews affect service rating)
    if (isClient) {
      const serviceReviews = await Review.find({
        service: order.service,
        reviewer: { $ne: reviewee }, // only client reviews
      });
      // Actually get all reviews for this service where the reviewer is a client
      const allServiceReviews = await Review.find({ service: order.service });
      if (allServiceReviews.length > 0) {
        const svcAvg = allServiceReviews.reduce((sum, r) => sum + r.rating, 0) / allServiceReviews.length;
        await Service.findByIdAndUpdate(order.service, {
          rating: Math.round(svcAvg * 10) / 10,
          reviewCount: allServiceReviews.length,
        });
      }
    }

    await review.populate([
      { path: 'reviewer', select: 'firstName lastName avatar' },
      { path: 'reviewee', select: 'firstName lastName avatar' },
    ]);

    return success(res, { review }, 201);
  } catch (err) {
    return error(res, err.message, 500);
  }
};

export const getUserReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ reviewee: req.params.userId })
      .populate('reviewer', 'firstName lastName avatar')
      .populate('service', 'title')
      .sort({ createdAt: -1 });

    return success(res, { reviews });
  } catch (err) {
    return error(res, err.message, 500);
  }
};

export const getServiceReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ service: req.params.serviceId })
      .populate('reviewer', 'firstName lastName avatar')
      .sort({ createdAt: -1 });

    return success(res, { reviews });
  } catch (err) {
    return error(res, err.message, 500);
  }
};

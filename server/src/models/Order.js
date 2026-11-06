import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
      required: true,
    },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    provider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    requirements: {
      type: String,
      default: '',
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: [
        'pending',
        'accepted',
        'in-progress',
        'delivered',
        'completed',
        'cancelled',
        'disputed',
      ],
      default: 'pending',
    },
    deliveryDate: {
      type: Date,
    },
    messages: [
      {
        sender: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        content: {
          type: String,
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    clientReview: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Review',
      default: null,
    },
    providerReview: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Review',
      default: null,
    },
    disputeDetails: {
      openedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
      reason: { type: String, default: '' },
      evidence: { type: [String], default: [] },
      internalNotes: { type: String, default: '' },
      assignedAdmin: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
      resolvedAt: { type: Date, default: null },
      resolution: { type: String, enum: ['buyer', 'seller', 'closed', null], default: null },
      resolutionNote: { type: String, default: '' },
    },
  },
  { timestamps: true }
);

orderSchema.index({ client: 1, status: 1, createdAt: -1 });
orderSchema.index({ provider: 1, status: 1, createdAt: -1 });
orderSchema.index({ status: 1, createdAt: -1 });
orderSchema.index({ service: 1 });

const Order = mongoose.model('Order', orderSchema);
export default Order;

import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';
import Notification from '../models/Notification.js';
import { success, error } from '../utils/apiResponse.js';

export const getConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({
      participants: req.user._id,
    })
      .populate('participants', 'firstName lastName avatar headline')
      .populate('lastMessage.sender', 'firstName lastName')
      .sort({ updatedAt: -1 })
      .lean();

    return success(res, { conversations });
  } catch (err) {
    return error(res, err.message, 500);
  }
};

export const createOrGetConversation = async (req, res) => {
  try {
    const participantId = req.body.participantId || req.body.recipientId;

    if (!participantId) {
      return error(res, 'Participant ID is required.', 400);
    }

    if (participantId === req.user._id.toString()) {
      return error(res, 'Cannot start a conversation with yourself.', 400);
    }

    // Check if conversation already exists
    let conversation = await Conversation.findOne({
      participants: { $all: [req.user._id, participantId], $size: 2 },
    }).populate('participants', 'firstName lastName avatar headline');

    if (!conversation) {
      conversation = new Conversation({
        participants: [req.user._id, participantId],
      });
      await conversation.save();
      await conversation.populate('participants', 'firstName lastName avatar headline');
    }

    return success(res, { conversation });
  } catch (err) {
    return error(res, err.message, 500);
  }
};

export const getMessages = async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const conversation = await Conversation.findById(req.params.id);

    if (!conversation) {
      return error(res, 'Conversation not found.', 404);
    }

    if (!conversation.participants.includes(req.user._id)) {
      return error(res, 'Not authorized.', 403);
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const messages = await Message.find({ conversation: req.params.id })
      .populate('sender', 'firstName lastName avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    // Mark unread messages as read
    await Message.updateMany(
      {
        conversation: req.params.id,
        sender: { $ne: req.user._id },
        readAt: null,
      },
      { readAt: new Date() }
    );

    return success(res, { messages: messages.reverse() });
  } catch (err) {
    return error(res, err.message, 500);
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) {
      return error(res, 'Message content is required.', 400);
    }

    const conversation = await Conversation.findById(req.params.id);
    if (!conversation) {
      return error(res, 'Conversation not found.', 404);
    }

    if (!conversation.participants.includes(req.user._id)) {
      return error(res, 'Not authorized.', 403);
    }

    const message = new Message({
      conversation: conversation._id,
      sender: req.user._id,
      content,
    });

    await message.save();

    // Update last message on conversation
    conversation.lastMessage = {
      content,
      sender: req.user._id,
      createdAt: new Date(),
    };
    await conversation.save();

    await message.populate('sender', 'firstName lastName avatar');

    // Notify the other participant
    const otherParticipant = conversation.participants.find(
      (p) => p.toString() !== req.user._id.toString()
    );

    await Notification.create({
      recipient: otherParticipant,
      type: 'message',
      title: 'New Message',
      message: `${req.user.firstName} sent you a message.`,
      link: `/conversations/${conversation._id}`,
    });

    return success(res, { message }, 201);
  } catch (err) {
    return error(res, err.message, 500);
  }
};

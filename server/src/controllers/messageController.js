import asyncHandler from 'express-async-handler';
import { sendMessageService, getMessagesService } from '../services/messageService.js';

// @desc    Send a message
// @route   POST /api/messages
// @access  Private
export const sendMessage = asyncHandler(async (req, res) => {
  const message = await sendMessageService(req.body, req.user._id);
  res.status(201).json(message);
});

// @desc    Get user messages
// @route   GET /api/messages
// @access  Private
export const getMessages = asyncHandler(async (req, res) => {
  const messages = await getMessagesService(req.user._id);
  res.json(messages);
});

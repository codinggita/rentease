import Message from '../models/Message.js';

export const sendMessageService = async (messageData, userId) => {
  const { receiver, text, rental } = messageData;
  return await Message.create({
    sender: userId,
    receiver,
    text,
    rental,
  });
};

export const getMessagesService = async (userId) => {
  return await Message.find({
    $or: [{ sender: userId }, { receiver: userId }],
  })
    .populate('sender', 'name email avatar')
    .populate('receiver', 'name email avatar')
    .populate('rental', 'title');
};

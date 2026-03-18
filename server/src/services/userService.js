import User from '../models/User.js';

export const updateUserService = async (userId, updateData) => {
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');

  user.name = updateData.name || user.name;
  user.phone = updateData.phone || user.phone;
  user.avatar = updateData.avatar || user.avatar;
  user.city = updateData.city || user.city;
  user.address = updateData.address || user.address;

  return await user.save();
};

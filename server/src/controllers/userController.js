import asyncHandler from 'express-async-handler';
import { updateUserService } from '../services/userService.js';

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = asyncHandler(async (req, res) => {
  const updatedUser = await updateUserService(req.user._id, req.body);

  res.json({
    _id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    phone: updatedUser.phone,
    avatar: updatedUser.avatar,
    city: updatedUser.city,
    role: updatedUser.role,
  });
});

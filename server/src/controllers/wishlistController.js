import asyncHandler from 'express-async-handler';
import {
  toggleWishlistService,
  getMyWishlistService,
} from '../services/wishlistService.js';

// @desc    Toggle rental in wishlist
// @route   POST /api/wishlist
// @access  Private
export const toggleWishlist = asyncHandler(async (req, res) => {
  const wishlist = await toggleWishlistService(req.body.rentalId, req.user._id);
  res.json(wishlist);
});

// @desc    Get user wishlist
// @route   GET /api/wishlist
// @access  Private
export const getWishlist = asyncHandler(async (req, res) => {
  const wishlistItems = await getMyWishlistService(req.user._id);
  res.json(wishlistItems ? wishlistItems.rentals : []);
});

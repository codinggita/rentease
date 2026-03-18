import asyncHandler from 'express-async-handler';
import {
  createReviewService,
  getRentalReviewsService,
} from '../services/reviewService.js';

// @desc    Create a review
// @route   POST /api/reviews
// @access  Private
export const createReview = asyncHandler(async (req, res) => {
  const review = await createReviewService(req.body, req.user._id);
  res.status(201).json(review);
});

// @desc    Get rental reviews
// @route   GET /api/reviews/:rentalId
// @access  Public
export const getRentalReviews = asyncHandler(async (req, res) => {
  const reviews = await getRentalReviewsService(req.params.rentalId);
  res.json(reviews);
});

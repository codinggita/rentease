import Review from '../models/Review.js';

export const createReviewService = async (reviewData, userId) => {
  const { rentalId, rating, comment } = reviewData;
  return await Review.create({
    user: userId,
    rental: rentalId,
    rating,
    comment,
  });
};

export const getRentalReviewsService = async (rentalId) => {
  return await Review.find({ rental: rentalId }).populate('user', 'name avatar');
};

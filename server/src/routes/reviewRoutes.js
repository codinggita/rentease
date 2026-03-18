import express from 'express';
import {
  createReview,
  getRentalReviews,
} from '../controllers/reviewController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/').post(protect, createReview);
router.route('/:rentalId').get(getRentalReviews);

export default router;

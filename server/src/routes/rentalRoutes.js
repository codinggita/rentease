import express from 'express';
import {
  createRental,
  getRentals,
  getRentalById,
  updateRental,
  deleteRental,
} from '../controllers/rentalController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/').get(getRentals).post(protect, createRental);
router
  .route('/:id')
  .get(getRentalById)
  .put(protect, updateRental)
  .delete(protect, deleteRental);

export default router;

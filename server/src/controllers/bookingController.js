import asyncHandler from 'express-async-handler';
import Booking from '../models/Booking.js';
import { createBookingService, getMyBookingsService } from '../services/bookingService.js';

// @desc    Create a new booking & Razorpay order
// @route   POST /api/bookings
// @access  Private
export const createBooking = asyncHandler(async (req, res) => {
  const result = await createBookingService(req.body, req.user._id);
  res.status(201).json(result);
});

// @desc    Get user bookings
// @route   GET /api/bookings
// @access  Private
export const getMyBookings = asyncHandler(async (req, res) => {
  const bookings = await getMyBookingsService(req.user._id);
  res.json(bookings);
});

// @desc    Get booking by ID
// @route   GET /api/bookings/:id
// @access  Private
export const getBookingById = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id).populate('rental user');

  if (booking) {
    if (booking.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      res.status(401);
      throw new Error('Not authorized');
    }
    res.json(booking);
  } else {
    res.status(404);
    throw new Error('Booking not found');
  }
});

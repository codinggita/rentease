import asyncHandler from 'express-async-handler';
import {
  createRentalService,
  getRentalsService,
  getRentalByIdService,
  updateRentalService,
  deleteRentalService,
} from '../services/rentalService.js';

// @desc    Create a new rental
// @route   POST /api/rentals
// @access  Private
export const createRental = asyncHandler(async (req, res) => {
  const createdRental = await createRentalService(req.body, req.user._id);
  res.status(201).json(createdRental);
});

// @desc    Get all rentals
// @route   GET /api/rentals
// @access  Public
export const getRentals = asyncHandler(async (req, res) => {
  const rentals = await getRentalsService();
  res.json(rentals);
});

// @desc    Get rental by ID
// @route   GET /api/rentals/:id
// @access  Public
export const getRentalById = asyncHandler(async (req, res) => {
  const rental = await getRentalByIdService(req.params.id);
  res.json(rental);
});

// @desc    Update a rental
// @route   PUT /api/rentals/:id
// @access  Private
export const updateRental = asyncHandler(async (req, res) => {
  const updatedRental = await updateRentalService(req.params.id, req.body, req.user._id);
  res.json(updatedRental);
});

// @desc    Delete a rental
// @route   DELETE /api/rentals/:id
// @access  Private
export const deleteRental = asyncHandler(async (req, res) => {
  const result = await deleteRentalService(req.params.id, req.user._id);
  res.json(result);
});

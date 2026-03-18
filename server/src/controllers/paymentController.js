import asyncHandler from 'express-async-handler';
import { createOrderService, verifyPaymentService } from '../services/paymentService.js';

// @desc    Create a Razorpay order
// @route   POST /api/payments/create-order
// @access  Private
export const createOrder = asyncHandler(async (req, res) => {
  const { amount, currency, receipt } = req.body;
  if (!amount) {
    res.status(400);
    throw new Error('Amount is required');
  }
  const order = await createOrderService({ amount, currency, receipt });
  res.status(201).json(order);
});

// @desc    Verify Razorpay payment signature
// @route   POST /api/payments/verify
// @access  Private
export const verifyPayment = asyncHandler(async (req, res) => {
  const result = await verifyPaymentService(req.body);
  res.status(200).json(result);
});


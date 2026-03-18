import crypto from 'crypto';
import Razorpay from 'razorpay';
import Booking from '../models/Booking.js';

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create a Razorpay order
export const createOrderService = async ({ amount, currency = 'INR', receipt }) => {
  const options = {
    amount: Math.round(amount * 100), // Razorpay expects paise
    currency,
    receipt: receipt || `receipt_${Date.now()}`,
  };

  const order = await razorpay.orders.create(options);
  return order;
};

// Verify Razorpay payment signature and update booking
export const verifyPaymentService = async ({ razorpay_order_id, razorpay_payment_id, razorpay_signature }) => {
  const sign = razorpay_order_id + '|' + razorpay_payment_id;
  const expectedSign = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(sign.toString())
    .digest('hex');

  if (razorpay_signature !== expectedSign) {
    throw new Error('Invalid payment signature');
  }

  // Update booking if it exists
  const booking = await Booking.findOne({ razorpayOrderId: razorpay_order_id });
  if (booking) {
    booking.paymentStatus = 'paid';
    booking.bookingStatus = 'confirmed';
    booking.razorpayPaymentId = razorpay_payment_id;
    await booking.save();
  }

  return { 
    success: true, 
    message: 'Payment verified successfully',
    orderId: razorpay_order_id,
    paymentId: razorpay_payment_id
  };
};


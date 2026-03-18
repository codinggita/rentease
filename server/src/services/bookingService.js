import Booking from '../models/Booking.js';
import Rental from '../models/Rental.js';
import razorpay from '../config/razorpay.js';

export const createBookingService = async (bookingData, userId) => {
  const { rentalId, startDate, endDate, totalDays, totalAmount } = bookingData;

  const rental = await Rental.findById(rentalId);
  if (!rental) throw new Error('Rental not found');

  const options = {
    amount: totalAmount * 100,
    currency: 'INR',
    receipt: `receipt_${Date.now()}`,
  };

  const order = await razorpay.orders.create(options);
  if (!order) throw new Error('Razorpay order creation failed');

  const booking = new Booking({
    user: userId,
    rental: rentalId,
    startDate,
    endDate,
    totalDays,
    totalAmount,
    razorpayOrderId: order.id,
  });

  const createdBooking = await booking.save();
  return {
    booking: createdBooking,
    orderId: order.id,
    amount: order.amount,
  };
};

export const getMyBookingsService = async (userId) => {
  return await Booking.find({ user: userId }).populate('rental');
};

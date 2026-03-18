import Rental from '../models/Rental.js';

export const createRentalService = async (rentalData, userId) => {
  const rental = new Rental({
    ...rentalData,
    owner: userId,
  });
  return await rental.save();
};

export const getRentalsService = async () => {
  return await Rental.find({}).populate('owner', 'name email');
};

export const getRentalByIdService = async (id) => {
  const rental = await Rental.findById(id).populate('owner', 'name email');
  if (!rental) throw new Error('Rental not found');
  return rental;
};

export const updateRentalService = async (id, updateData, userId) => {
  const rental = await Rental.findById(id);
  if (!rental) throw new Error('Rental not found');
  
  if (rental.owner.toString() !== userId.toString()) {
    throw new Error('User not authorized');
  }

  Object.assign(rental, updateData);
  return await rental.save();
};

export const deleteRentalService = async (id, userId) => {
  const rental = await Rental.findById(id);
  if (!rental) throw new Error('Rental not found');

  if (rental.owner.toString() !== userId.toString()) {
    throw new Error('User not authorized');
  }

  await rental.deleteOne();
  return { message: 'Rental removed' };
};

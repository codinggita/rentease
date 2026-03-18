import Wishlist from '../models/Wishlist.js';

export const toggleWishlistService = async (rentalId, userId) => {
  let wishlist = await Wishlist.findOne({ user: userId });

  if (!wishlist) {
    wishlist = await Wishlist.create({ user: userId, rentals: [rentalId] });
  } else {
    const index = wishlist.rentals.indexOf(rentalId);
    if (index === -1) {
      wishlist.rentals.push(rentalId);
    } else {
      wishlist.rentals.splice(index, 1);
    }
    await wishlist.save();
  }
  return wishlist;
};

export const getMyWishlistService = async (userId) => {
  return await Wishlist.findOne({ user: userId }).populate('rentals');
};

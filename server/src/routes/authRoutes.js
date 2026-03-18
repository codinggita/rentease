import express from 'express';
import {
  registerUser,
  authUser,
  getUserProfile,
  syncUser,
  logoutUser,
  signInWithOtp,
  forgotPassword,
  resetPassword,
} from '../controllers/authController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/signup', registerUser);
router.post('/login', authUser);
router.post('/sync', syncUser);
router.post('/logout', logoutUser);
router.post('/otp', signInWithOtp);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/me', protect, getUserProfile);

export default router;

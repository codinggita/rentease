import User from '../models/User.js';
import { supabase } from '../config/supabase.js';
import generateToken from '../utils/generateToken.js';
import bcrypt from 'bcryptjs';

// ─── SIGNUP ───────────────────────────────────────────────────────────────────
export const registerUserService = async ({ name, email, password, phone }) => {
  console.log(`Registering user: ${email}`);
  
  // 1. Supabase Signup (primary auth — always required)
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: name } }
  });

  if (authError) {
    console.error(`Supabase signup error: ${authError.message}`);
    throw new Error(authError.message);
  }

  if (!authData?.user) {
    throw new Error('Signup failed: No user returned from Supabase');
  }

  const supabaseId = authData.user.id;

  // 2. MongoDB save — non-blocking, app works even if DB is down
  let mongoUser = null;
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    mongoUser = await User.create({
      name,
      email,
      phone,
      supabaseId,
      password: hashedPassword,
      loginHistory: [{ action: 'signup', timestamp: new Date() }]
    });
    console.log(`User saved to MongoDB: ${mongoUser._id}`);
  } catch (dbError) {
    console.warn(`MongoDB save failed (non-fatal): ${dbError.message}`);
  }

  return {
    _id: mongoUser?._id || supabaseId,
    name: mongoUser?.name || name,
    email: mongoUser?.email || email,
    supabaseId,
    token: generateToken(supabaseId),
  };
};

// ─── LOGIN ────────────────────────────────────────────────────────────────────
export const authUserService = async ({ email, password }) => {
  // 1. Supabase Auth (primary — always required)
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) throw new Error('Invalid email or password');

  // 2. MongoDB lookup — non-blocking, falls back to Supabase data
  let mongoUser = null;
  try {
    mongoUser = await User.findOne({ supabaseId: data.user.id });
    if (mongoUser) {
      mongoUser.loginHistory.push({ action: 'login', timestamp: new Date() });
      await mongoUser.save();
    }
  } catch (dbError) {
    console.warn(`MongoDB login lookup failed (non-fatal): ${dbError.message}`);
  }

  return {
    _id: mongoUser?._id || data.user.id,
    name: mongoUser?.name || data.user.user_metadata?.full_name || email.split('@')[0],
    email: mongoUser?.email || data.user.email,
    supabaseId: data.user.id,
    token: generateToken(data.user.id),
  };
};

// ─── FORGOT PASSWORD ──────────────────────────────────────────────────────────
export const forgotPasswordService = async ({ phone }) => {
  console.log(`Requesting OTP for phone: ${phone}`);
  
  const { data, error } = await supabase.auth.signInWithOtp({ phone });
  if (error) throw new Error(error.message);

  // MongoDB tracking — non-blocking
  try {
    const user = await User.findOne({ phone });
    if (user) {
      user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
      user.loginHistory.push({ action: 'otp_requested', timestamp: new Date() });
      await user.save();
    }
  } catch (dbError) {
    console.warn(`MongoDB OTP tracking failed (non-fatal): ${dbError.message}`);
  }

  return { message: 'OTP sent successfully to your mobile number', data };
};

// ─── RESET PASSWORD ───────────────────────────────────────────────────────────
export const resetPasswordService = async ({ phone, otp, newPassword }) => {
  const { error: verifyError } = await supabase.auth.verifyOtp({ phone, token: otp, type: 'sms' });
  if (verifyError) throw new Error('Invalid or expired OTP');

  const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });
  if (updateError) throw new Error(updateError.message);

  // MongoDB update — non-blocking
  try {
    const user = await User.findOne({ phone });
    if (user) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
      user.loginHistory.push({ action: 'password_reset', timestamp: new Date() });
      await user.save();
    }
  } catch (dbError) {
    console.warn(`MongoDB password reset failed (non-fatal): ${dbError.message}`);
  }

  return { message: 'Password reset successfully', success: true };
};

// ─── SYNC EXTERNAL (Google OAuth) ────────────────────────────────────────────
export const syncExternalUserService = async ({ name, email, supabaseId, avatar }) => {
  let user = null;

  try {
    user = await User.findOne({ supabaseId });
    if (!user) {
      user = await User.create({
        name, email, supabaseId, avatar,
        loginHistory: [{ action: 'signup_google', timestamp: new Date() }]
      });
    } else {
      user.name = name || user.name;
      user.avatar = avatar || user.avatar;
      user.loginHistory.push({ action: 'login_google', timestamp: new Date() });
      await user.save();
    }
  } catch (dbError) {
    console.warn(`MongoDB sync failed (non-fatal): ${dbError.message}`);
  }

  return {
    _id: user?._id || supabaseId,
    name: user?.name || name,
    email: user?.email || email,
    supabaseId,
    token: generateToken(supabaseId),
  };
};

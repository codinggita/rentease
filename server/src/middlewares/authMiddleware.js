import asyncHandler from 'express-async-handler';
import { supabase } from '../config/supabase.js';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

export const protect = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }

  const token = authHeader.split(' ')[1];

  try {
    let supabaseId = null;

    // Strategy 1: Validate as Supabase access_token (for frontend Supabase sessions)
    const { data: supabaseData, error: supabaseError } = await supabase.auth.getUser(token);
    if (supabaseData?.user) {
      supabaseId = supabaseData.user.id;
    } else {
      // Strategy 2: Validate as our own JWT (for backend-issued tokens)
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        supabaseId = decoded.id || decoded.sub;
      } catch (jwtError) {
        console.error('JWT verification failed:', jwtError.message);
        res.status(401);
        throw new Error('Not authorized, invalid token');
      }
    }

    if (!supabaseId) {
      res.status(401);
      throw new Error('Not authorized, could not identify user');
    }

    // MongoDB lookup — non-blocking, falls back to token data
    try {
      req.user = await User.findOne({ supabaseId });
    } catch (dbError) {
      console.warn(`MongoDB auth lookup failed (non-fatal): ${dbError.message}`);
    }

    // If DB unavailable or user not in DB, use minimal object from token
    if (!req.user) {
      req.user = { supabaseId, _id: supabaseId };
    }

    next();
  } catch (error) {
    if (res.statusCode !== 401) {
      res.status(401);
    }
    throw new Error(error.message || 'Not authorized');
  }
});

export const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(401);
    throw new Error('Not authorized as an admin');
  }
};

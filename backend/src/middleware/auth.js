import { supabase } from '../config/database.js';
import { AppError } from './errorHandler.js';

export const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('Missing or invalid authorization header', 401);
    }

    const token = authHeader.slice(7);

    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
      throw new AppError('Invalid token', 401);
    }

    req.user = data.user;
    next();
  } catch (error) {
    next(error);
  }
};

export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next();
    }

    const token = authHeader.slice(7);
    const { data } = await supabase.auth.getUser(token);

    if (data?.user) {
      req.user = data.user;
    }

    next();
  } catch (error) {
    next();
  }
};

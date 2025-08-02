import rateLimit from 'express-rate-limit';

export const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // Aumentar limite temporariamente
  message: {
    error: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Skip rate limiting para health e desenvolvimento
  skip: (req) => {
    return req.path === '/health' || process.env.NODE_ENV !== 'production';
  }
});

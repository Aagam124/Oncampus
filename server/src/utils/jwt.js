import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'oncampus_jwt_secret_key_2024_production';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'oncampus_refresh_secret_key_2024_production';

export const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '15m' }
  );
};

export const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );
};

export const verifyAccessToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};

export const verifyRefreshToken = (token) => {
  return jwt.verify(token, JWT_REFRESH_SECRET);
};

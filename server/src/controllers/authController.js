import User from '../models/User.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt.js';
import { success, error } from '../utils/apiResponse.js';

export const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, university, department, year } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return error(res, 'Email already registered.', 409);
    }

    const user = new User({
      firstName,
      lastName,
      email,
      password,
      university: university || '',
      department: department || '',
      year: year || undefined,
    });

    await user.save();

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();

    return success(
      res,
      {
        user: user.toPublicProfile(),
        accessToken,
        refreshToken,
      },
      201
    );
  } catch (err) {
    return error(res, err.message, 500);
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return error(res, 'Invalid email or password.', 401);
    }

    if (!user.isActive) {
      return error(res, 'Account is deactivated. Contact support.', 403);
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return error(res, 'Invalid email or password.', 401);
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();

    return success(res, {
      user: user.toPublicProfile(),
      accessToken,
      refreshToken,
    });
  } catch (err) {
    return error(res, err.message, 500);
  }
};

export const refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return error(res, 'Refresh token is required.', 400);
    }

    const decoded = verifyRefreshToken(refreshToken);
    const user = await User.findById(decoded.id);

    if (!user || user.refreshToken !== refreshToken) {
      return error(res, 'Invalid refresh token.', 401);
    }

    const newAccessToken = generateAccessToken(user);

    return success(res, { accessToken: newAccessToken });
  } catch (err) {
    return error(res, 'Invalid or expired refresh token.', 401);
  }
};

export const logout = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      user.refreshToken = null;
      await user.save();
    }

    return success(res, { message: 'Logged out successfully.' });
  } catch (err) {
    return error(res, err.message, 500);
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return error(res, 'User not found.', 404);
    }
    return success(res, { user: user.toPublicProfile() });
  } catch (err) {
    return error(res, err.message, 500);
  }
};

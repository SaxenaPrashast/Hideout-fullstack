import { Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

const generateToken = (id: string): string => {
  const secret = process.env.JWT_SECRET || 'your_super_secret_key_here';
  return jwt.sign({ id }, secret, { expiresIn: '7d' });
};

const generateAvatar = (username: string): string => {
  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8'];
  const colorIndex = username.charCodeAt(0) % colors.length;
  return colors[colorIndex];
};

export const register = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { username, email, password } = req.body as {
      username: string;
      email: string;
      password: string;
    };

    if (!username || !email || !password) {
      res.status(400).json({ message: 'Please provide all required fields' });
      return;
    }

    const existingUser = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { username }],
    });

    if (existingUser) {
      const field = existingUser.email === email.toLowerCase() ? 'email' : 'username';
      res.status(400).json({ message: `User with this ${field} already exists` });
      return;
    }

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      username,
      email: email.toLowerCase(),
      password: hashedPassword,
      avatar: generateAvatar(username),
    });

    const token = generateToken(user._id.toString());

    const userResponse = {
      _id: user._id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      isOnline: user.isOnline,
      lastSeen: user.lastSeen,
      createdAt: user.createdAt,
    };

    res.status(201).json({ user: userResponse, token });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('duplicate key')) {
        res.status(400).json({ message: 'User already exists' });
        return;
      }
      res.status(500).json({ message: error.message });
      return;
    }
    res.status(500).json({ message: 'Server error during registration' });
  }
};

export const login = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { email, password } = req.body as {
      email: string;
      password: string;
    };

    if (!email || !password) {
      res.status(400).json({ message: 'Please provide email and password' });
      return;
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    user.isOnline = true;
    await user.save();

    const token = generateToken(user._id.toString());

    const userResponse = {
      _id: user._id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      isOnline: user.isOnline,
      lastSeen: user.lastSeen,
      createdAt: user.createdAt,
    };

    res.json({ user: userResponse, token });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
      return;
    }
    res.status(500).json({ message: 'Server error during login' });
  }
};

export const getMe = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Not authenticated' });
      return;
    }

    const user = await User.findById(req.user._id).select('-password');

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.json(user);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
      return;
    }
    res.status(500).json({ message: 'Server error' });
  }
};

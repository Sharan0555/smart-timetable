import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError } from '../utils/appError.js';
import { signToken } from '../utils/jwt.js';

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body as { email: string; password: string };
  const user = await User.findOne({ email, isActive: true });
  if (!user) throw new AppError('Invalid credentials', 401);

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) throw new AppError('Invalid credentials', 401);

  const token = signToken({
    id: String(user._id),
    role: user.role,
    collegeId: user.collegeId ? String(user.collegeId) : undefined,
    departmentId: user.departmentId ? String(user.departmentId) : undefined,
    name: user.name,
    email: user.email
  });

  res.json({
    token,
    user: {
      id: String(user._id),
      name: user.name,
      email: user.email,
      role: user.role,
      collegeId: user.collegeId ? String(user.collegeId) : undefined,
      departmentId: user.departmentId ? String(user.departmentId) : undefined
    }
  });
});

export const me = asyncHandler(async (req, res) => {
  if (!req.user) throw new AppError('Unauthorized', 401);
  res.json({ user: req.user });
});

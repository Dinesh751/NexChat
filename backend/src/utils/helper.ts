import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const saltRounds = 10; // Number of salt rounds for hashing

export const hashPassword = async (password: string): Promise<string> => {
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
};
export const comparePassword = async (
  password: string,
  hashedPassword: string,
): Promise<boolean> => {
  const isMatch = await bcrypt.compare(password, hashedPassword);
  return isMatch;
};

export const generateAccessToken = (userId: string) => {
  const secret = process.env.JWT_ACCESS_SECRET as string; // Fallback to a default secret if not set
  if (!secret) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }
  const token = jwt.sign({ userId }, secret, { expiresIn: '15m' });
  return token;
};

export const generateRefreshToken = (userId: string) => {
  const secret = process.env.JWT_REFRESH_SECRET as string; // Fallback to a default secret if not set
  if (!secret) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }
  const token = jwt.sign({ userId }, secret, { expiresIn: '7d' });
  return token;
};

export const verifyToken = (token: string, secret: string): string | jwt.JwtPayload => {
  try {
    const decoded = jwt.verify(token, secret);
    return decoded;
  } catch (error) {
    throw new Error('Invalid token');
  }
};
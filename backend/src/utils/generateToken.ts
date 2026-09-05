import jwt, { SignOptions } from 'jsonwebtoken';

export const generateToken = (userId: string, role: string): string => {
  const secret = process.env.JWT_SECRET;
  
  if (!secret) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }

  const expiresIn = process.env.JWT_EXPIRES_IN || '1d';

  
  const options: SignOptions = {
    expiresIn: expiresIn as SignOptions['expiresIn']
  };

  return jwt.sign({ id: userId, role }, secret, options);
};
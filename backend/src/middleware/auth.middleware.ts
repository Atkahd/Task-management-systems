import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';

interface DecodedToken extends jwt.JwtPayload {
  id: string;
  role: string;
}

export const protect = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  let token;

  
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      
      token = req.headers.authorization.split(' ')[1];

      
      const secret = process.env.JWT_SECRET;
      if (!secret) throw new Error('JWT_SECRET is missing');
      
      const decoded = jwt.verify(token, secret) as DecodedToken;

      
      const user = await User.findById(decoded.id);

      if (!user) {
        res.status(401).json({ 
          success: false, 
          message: 'Not authorized, user no longer exists', 
          error: 'UNAUTHORIZED' 
        });
        return;
      }

      
      req.user = user;
      
      
      next();
    } catch (error) {
      res.status(401).json({ 
        success: false, 
        message: 'Not authorized, token failed or expired', 
        error: 'UNAUTHORIZED' 
      });
      return;
    }
  }

  
  if (!token) {
    res.status(401).json({ 
      success: false, 
      message: 'Not authorized, no token provided', 
      error: 'UNAUTHORIZED' 
    });
    return;
  }
};
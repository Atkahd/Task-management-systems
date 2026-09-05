import { Request, Response, NextFunction } from 'express';

/**
* @param allowedRoles 
 */
export const authorizeRole = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    
    
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Not authorized to access this route',
        error: 'UNAUTHORIZED'
      });
      return;
    }

    
    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: `User role '${req.user.role}' is not authorized to access this resource`,
        error: 'FORBIDDEN'
      });
      return;
    }

    
    next();
  };
};
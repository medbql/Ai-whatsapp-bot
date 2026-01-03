import { type Request, type Response, type NextFunction } from "express";
import { verifyToken } from "../services/jwt.ts";


export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(400).json({
        success: false,
        message: 'token not provided.'
      })
      return;
    }

    const token = authHeader.split(' ')[1];

    if (token) {
      const decoded = verifyToken(token);

      if (!decoded) {
        res.status(400).json({
          success: false,
          message: 'invalid token.'
        })
      }

      next()


    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'authentication failed!'
    })
  }
}

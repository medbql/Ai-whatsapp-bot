import { type Request, type Response, type NextFunction } from "express";
import { verifyAccessToken } from "../services/jwt.ts";


export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        message: 'token not provided.'
      })
      return;
    }

    const token = authHeader.split(' ')[1];

    if (token) {
      const tokenVerification = verifyAccessToken(token);

      if (tokenVerification) {

        if (!tokenVerification.success) {
          res.status(401).json({
            success: false,
            message: tokenVerification.errorType
          })
        }

      } else {
        res.status(401).json({
          success: false,
          message: 'INVALID'
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

import { type Request, type Response, type NextFunction } from "express";
import { accessTokenGeneretor, verifyAccessToken } from "../services/jwt.ts";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    const refreshToken = req.cookies.refreshToken;//get refreshToken from cookies

    if (!authHeader || !authHeader.startsWith('Bearer ') || !refreshToken) {
      res.status(401).json({
        success: false,
        message: 'accessToken or refreshToken not provided.'
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

        } else if (tokenVerification.decoded) {


          const expiredTime = tokenVerification.decoded?.exp - tokenVerification.decoded?.iat;
          const current_date = Math.floor(Date.now() / 1000);

          const restTime = tokenVerification.decoded?.exp - current_date;

          if (restTime < expiredTime && restTime <= 60) {

            const user_id = tokenVerification.decoded.id;
            const newToken = accessTokenGeneretor(user_id);

            res.setHeader('X-New-Access-Token', newToken)

          }
        }

      } else {
        res.status(401).json({
          success: false,
          message: 'INVALID'
        })
      }


      next()


    } else {
      res.status(401).json({
        success: false,
        message: 'accessToken  not provided.'
      })
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'authentication failed!'
    })
  }
}

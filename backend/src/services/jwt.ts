import jwt, { type Jwt, type JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

interface TokenPayload {
  id: number;
  iat: number;
  exp: number
}

interface VerifyResult {
  success: boolean;
  decoded?: TokenPayload;
  errorType?: 'EXPIRED';
}


//get the secrets key from .env
const accessToken = process.env.ACCESS_TOEKN_SECRET;
const refreshToken = process.env.REFRESH_TOKEN_SECRET;

const accessTokenGeneretor = (user_id: number) => {
  const playload: JwtPayload = {
    id: user_id,
  }

  if (!accessToken) {
    throw new Error('not found the secret')
  }

  const token: string = jwt.sign(playload, accessToken, { expiresIn: '2m' });//default signing algo HS256
  return token;

}



const refreshTokenGeneretor = (user_id: number) => {
  const playload: JwtPayload = {
    id: user_id
  }

  if (!refreshToken) {
    throw new Error('not found the secret')
  }

  const token: string = jwt.sign(playload, refreshToken, { expiresIn: '7d' });//default signing algo HS256
  return token;

}




/*
 * verify it the access token
 */
const verifyAccessToken = (token: string): VerifyResult | null => {
  try {
    if (!accessToken) {
      throw new Error('not found the secret')
    }

    const decoded = jwt.verify(token, accessToken) as TokenPayload;
    return {
      decoded,
      success: true

    }
  } catch (error: any) {
    console.log(error.name)
    if (error.name === 'TokenExpiredError') {
      return {
        success: false,
        errorType: 'EXPIRED'
      }
    } else {
      return null
    }

  }
}
/*
 * verify it he refresh token
 */
const verifyRefrshToken = (token: string) => {
  try {
    if (!refreshToken) {
      throw new Error('not found the secret')
    }

    const decoded = jwt.verify(token, refreshToken) as TokenPayload;
    return decoded

  } catch (error: any) {
    return null
  }
}


export {
  accessTokenGeneretor,
  refreshTokenGeneretor,
  verifyAccessToken,
  verifyRefrshToken
}

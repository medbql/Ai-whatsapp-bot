import jwt, { type Jwt, type JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

//get the secret key from .env
const secret = process.env.JWT_SECRET;


const tokenGeneretor = (user_id: number) => {
  const playload: JwtPayload = {
    id: user_id
  }

  if (!secret) {
    throw new Error('not found the secret')
  }

  const token: string = jwt.sign(playload, secret, { expiresIn: '7d' });//default signing algo HS256

  return token;

}

/*
 * verify it token
 */
const verifyToken = (token: string) => {
  try {
    if (!secret) {
      throw new Error('not found the secret')
    }

    return jwt.verify(token, secret);

  } catch (error) {
    return null
  }
}



export { tokenGeneretor, verifyToken }

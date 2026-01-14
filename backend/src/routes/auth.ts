import { Router } from "express";
import bcrypt from "bcryptjs";
import { User } from "../db/connection.ts";
import { accessTokenGeneretor, refreshTokenGeneretor, verifyRefrshToken } from "../services/jwt.ts";

//instance router
export const authRouter = Router();

//---------------Register Endpoint-----------------------------//
authRouter.post('/register', async (req, res) => {

  try {

    //destructing the params from the request
    const { firstName, lastName, email, password } = req.body;

    //check credinatials 
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'credinatials required!'
      })
    }

    //hash the password before stored in trh database
    const hashedPassword: string = await bcrypt.hash(password, 10);

    const data = {
      firstname: firstName,
      lastname: lastName,
      email,
      password: hashedPassword
    }

    //insert the user the database
    const addUser = await User.Insert(data);

    //check if the user inserted successfully 
    if (addUser?.rowCount === 1) {
      res.status(201).json({
        success: true,
        message: 'user registered successfully.'
      })
    }

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'server error',
      error: error
    })
  }

})

//---------------Login Endpoint-----------------------------//
authRouter.post('/login', async (req, res) => {
  try {
    //destructing the params from the request
    const { email, password } = req.body;

    //check credinatials 
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'credinatials required!'
      })
    }

    //get the user by email
    const user = await User.getByEmail(email);

    //check if exist
    if (user?.length !== 1) {
      return res.status(401).json({ error: 'invalid email or passord!' })
    }

    //get the hashed Password
    const hashedPassword = user[0].password;

    //compare the password by the hashed password
    const isPasswordValid = await bcrypt.compare(password, hashedPassword);

    //response the password is incorecct
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'invalid email or passord!' })

    }

    //if the password correct we generete token
    const accessToken = accessTokenGeneretor(user[0].id);
    const refreshToken = refreshTokenGeneretor(user[0].id);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      //secure: true, in the prod 
      path: '/'
    })


    res.status(200).json({
      messge: 'login successfully.',
      user: {
        id: user[0].id,
        email: user[0].email,
        accessToken
      }
    })

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'server error',
      error: error
    })

  }
})

/*
 * Refresh Endpoint
 */
authRouter.post('/refresh', async (req, res) => {
  const refreshToen = req.cookies.refreshToken;
  try {
    if (refreshToen) {

      const tokenVerification = verifyRefrshToken(refreshToen);

      if (tokenVerification) {
        const user_id = tokenVerification.id;
        const newAccessToken = accessTokenGeneretor(user_id);

        res.status(200).json({
          accessToken: newAccessToken
        })
      } else {
        res.status(401).json({
          success: false,
          message: 'invalid token'
        })
      }

    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'authentication failed!'
    })

  }
})





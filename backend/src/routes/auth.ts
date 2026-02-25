import { Router } from "express";
import bcrypt from "bcryptjs";
import { User } from "../db/connection.ts";
import { accessTokenGeneretor, refreshTokenGeneretor, verifyRefrshToken } from "../services/jwt.ts";
import dotenv from "dotenv";
import axios from "axios";
import crypto from "crypto";
import { logs } from "../utils/logs.ts";


dotenv.config();




//instance router
export const authRouter = Router();


const pendingTokens = new Map<string, { accessToken: string }>();

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

    interface User {
      id: number;
      firstname: string;
      lastname: string;
      email: string;
      password: string;

    }

    //get the user by email
    const user: User = await User.getByEmail(email);



    //check if exist
    if (!user) {
      return res.status(401).json({ error: 'invalid email or passord!' })
    }

    //get the hashed Password
    const hashedPassword = user.password;

    //compare the password by the hashed password
    const isPasswordValid = await bcrypt.compare(password, hashedPassword);

    //response the password is incorecct
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'invalid email or passord!' })
    }

    //if the password correct we generete token
    const accessToken = accessTokenGeneretor(user.id);
    const refreshToken = refreshTokenGeneretor(user.id);

    const isProd = process.env.APP_ENV === 'prod';

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: isProd,
      path: '/'
    })


    res.status(200).json({
      messge: 'login successfully.',
      user: {
        id: user.id,
        email: user.email,
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
  const refreshToken = req.cookies.refreshToken;

  try {
    if (refreshToken) {

      const tokenVerification = verifyRefrshToken(refreshToken);

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

    } else {
      res.status(401).json({
        success: false,
        message: 'authentication failed'
      })
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'authentication failed!'
    })

  }
})

/*
 * LogOut Endpoint
 */

authRouter.post('/logout', (req, res) => {
  try {
    //delete the reafresh token 
    res.clearCookie('refreshToken');

    res.status(200).json({
      message: 'user logout seccussefly.'
    });
  } catch (err) {
    logs(err)
    res.status(500).json({
      err: 'error in the log out.'
    })
  }
})

/**
 * Redirect User to Google OAuth consent screen 
 */
authRouter.get('/google', (req, res) => {
  const state = Math.random().toString(36).substring(7);

  const isProd = process.env.APP_ENV === 'prod';
  res.cookie('state', state, {
    httpOnly: true,
    secure: isProd,
    path: '/'
  })

  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID as string,
    redirect_uri: process.env.GOOGLE_REDIRECT_URI as string,
    response_type: 'code',
    access_type: 'offline',
    scope: 'openid profile email',
    state: state,
    prompt: 'consent'

  })


  res.redirect(`https://accounts.google.com/o/oauth2/auth?${params}`)
})


authRouter.get('/google/callback', async (req, res) => {
  try {
    const { code, state } = req.query;

    const googleState = req.cookies.state;

    if (state === googleState) {

      res.clearCookie('state')

      const tokenResponse = await axios.post("https://oauth2.googleapis.com/token", {
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: process.env.GOOGLE_REDIRECT_URI as string,
        grant_type: 'authorization_code'
      })

      const { access_token } = tokenResponse.data

      const userResponse = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo',
        { headers: { Authorization: `Bearer ${access_token}` } })

      const userInfo = userResponse.data;

      if (userInfo) {

        const providerId = await User.getByProviderId(userInfo.id);

        if (!providerId) {

          const addUser = await User.Insert({
            firstname: userInfo.given_name,
            lastname: userInfo.family_name,
            email: userInfo.email,
            password: null,
            auth_provider: 'google',
            provider_id: userInfo.id
          })

        }

        //get the user by email
        const user = await User.getByEmail(userInfo.email);

        const accessToken = accessTokenGeneretor(user.id);
        const refreshToken = refreshTokenGeneretor(user.id);

        const isProd = process.env.APP_ENV === 'prod';

        const oneTimeCode = crypto.randomBytes(32).toString('hex');
        pendingTokens.set(oneTimeCode, { accessToken });

        res.cookie('refreshToken', refreshToken, {
          httpOnly: true,
          secure: isProd,
          path: '/'
        })

        res.redirect(`http://localhost:3000/auth/callback?code=${oneTimeCode}`);
      }


    }


  } catch (error) {

  }
})

authRouter.post('/exchange-token', (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ success: false, message: 'Code is required' });
    }

    const pendingToken = pendingTokens.get(code);

    if (!pendingToken) {
      pendingTokens.delete(code);
      return res.status(401).json({ success: false, message: 'Invalid or expired code' });
    }

    pendingTokens.delete(code);

    res.json({ success: true, accessToken: pendingToken.accessToken });

  } catch (error) {
    logs(error)
    res.status(500).json({
      err: 'error in the log out.'
    })

  }
})

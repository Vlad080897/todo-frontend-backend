const User = require("../models/userModel")
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

export const handleError = (err: CredentialsErrorType) => {
  let errors = { email: '', password: '' }
  if (err.code === 11000) {
    Object.keys(err.keyValue).forEach(key => {
      errors[key] = `The ${key} is already registed`
    });
  }
  if (err.message.includes('User validation failed')) {
    Object.values(err.errors).forEach((prop) => {
      errors[(prop as unknown as PropertiesType).path] = (prop as unknown as PropertiesType).message
    });

  }
  return errors;
}

const createToken = (id: string) => {
  return jwt.sign({ id }, 'asfasfasfsdnlsbkbqwi', { expiresIn: '5s' });
};
const createRefreshToken = (user: UserType) => {
  return jwt.sign({ user }, '1234test', { expiresIn: '24h' });
};


export const getUser = (req: Request, res: Response<UserType | null>) => {
  const token = (req.cookies as { jwt: string }).jwt;
  if (token) {
    jwt.verify(token, 'asfasfasfsdnlsbkbqwi', async (err: Error, decodedToken: { id: string }) => {
      if (err) {
        res.status(200).json(null);
      } else {
        const { id } = decodedToken;
        const user = await User.findOne({ _id: id });
        res.status(200).json(user);
      }
    })
    return;
  }
  res.status(401).json(null);
}

export const loginPost =
  async (req: Request<{}, {}, { email: string, password: string }>, res: Response<{ user: UserType, refreshToken: string } | { error: string }>) => {
    const { email, password } = req.body;
    try {
      const user = await User.login(email, password);
      const token = createToken(user._id);
      const refreshToken = createRefreshToken(user)
      res.cookie('jwt', token, { maxAge: 10000 })
      res.status(200).json({ user, refreshToken });
    } catch (err) {
      res.status(404).json({ error: err.message })
    }
  }

export const signupPost =
  async (req: Request<{}, {}, { email: string, password: string }>,
    res: Response<{ id: string, userEmail: string } | { errors: { email: string, password: string } }>) => {
    const { email, password } = req.body
    try {
      const user = await User.create({ email, password });
      const token = createToken(user._id);
      res.cookie('jwt', token, { maxAge: 10000 })
      res.status(200).json({ id: user._id, userEmail: user.email })
    } catch (err) {
      const errors = handleError(err);
      res.status(404).json({ errors });
    }
  }

export const getNewToken = (req: Request<{}, {}, { refreshToken: string }>, res: Response<{ id: string } | { user: null } | string>) => {
  const { refreshToken } = req.body
  if (refreshToken) {
    jwt.verify(refreshToken, '1234test', (err: Error, decodedToken: { user: UserType }) => {
      if (err) {
        res.status(403).json({ user: null });
      } else {
        const { user } = decodedToken
        const newToken = createToken(user._id);
        res.cookie('jwt', newToken, { maxAge: 5000 })
        res.status(200).json({ id: user._id })
      }
    })
    return;
  }
  res.status(401).json('User is not authorized')
}

export const logout = (_, res: Response<null>) => {
  res.cookie('jwt', '', { maxAge: 1 });
  res.status(200).json(null);
}

export type UserType = {
  _id: string
  email: string
  password: string
  __v: number
}

type CredentialsErrorType = {
  message: string,
  errors: {
    password?: string,
    email?: string,
  },
  keyValue: string,
  code: number
}

type PropertiesType = {
  validator: Function,
  message: string,
  type: string,
  minlength: number,
  path: string,
  value: string

}

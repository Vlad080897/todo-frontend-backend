import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

export const checkIsUser = (req: Request, res: Response, next: NextFunction) => {
  const token = (req.cookies as { jwt: string }).jwt;
  if (token) {
    jwt.verify(token, 'asfasfasfsdnlsbkbqwi', async (err: Error, _) => {
      if (err) {
        res.status(401).send('User is not autorized');
      } else {
        next();
      }
    })
    return;
  }
  res.status(401).send('User is not autorized');
}

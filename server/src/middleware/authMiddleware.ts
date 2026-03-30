import type { Request, Response, NextFunction } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";

interface DecodedToken extends JwtPayload {
  sub: string;
  "id": string;
  "email": string;
  "role": string;
}

declare global {
  namespace Express {
    interface Request {

      userId: number,
      email: string,
    }

  }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {

  const token = req.headers.authorization?.split(" ")[1];
  // console.log(token)
  if (!token) {
    res.status(401).json({ success: false, error: "Unauthorized" });
    return;
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded: DecodedToken) => {
      if (err) { return res.status(401).json({ success: false, error: "Invalid token" }) }

      req.userId = parseInt(decoded.id)
      next()
    })

  } catch (err) {
    console.log(err)
    res.status(500).json({ success: false, error: "Something went Wrong" });
    return;
  }
};

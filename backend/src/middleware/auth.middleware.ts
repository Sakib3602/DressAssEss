import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JwtPayload } from "../types/express.js";

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];
  const headerToken = authHeader && authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

  const cookieToken = (() => {
    const rawCookies = req.headers.cookie;
    if (!rawCookies) return null;

    const cookie = rawCookies
      .split(";")
      .map((item) => item.trim())
      .find((item) => item.startsWith("token="));

    if (!cookie) return null;
    return decodeURIComponent(cookie.split("=")[1]);
  })();

  const token = headerToken || cookieToken;

  if (!token) {
    return res.status(401).json({ message: "No token, access denied" });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid token" });
  }
};

export default authMiddleware;
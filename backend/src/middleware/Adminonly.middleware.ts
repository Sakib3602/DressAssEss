import { Request, Response, NextFunction } from "express";

// authMiddleware এর পরে বসবে — ততক্ষণে req.user (JwtPayload) সেট হয়ে গেছে
const adminOnly = (req: Request, res: Response, next: NextFunction) => {
  if (req.user && req.user.role === "ADMIN") {
    return next();
  }
  return res.status(403).json({ message: "Admin access only" });
};

export default adminOnly;
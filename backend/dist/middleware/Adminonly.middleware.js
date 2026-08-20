"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// authMiddleware এর পরে বসবে — ততক্ষণে req.user (JwtPayload) সেট হয়ে গেছে
const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === "ADMIN") {
        return next();
    }
    return res.status(403).json({ message: "Admin access only" });
};
exports.default = adminOnly;

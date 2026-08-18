"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_js_1 = __importDefault(require("../config/prisma.js"));
const register = async (req, res) => {
    try {
        const { name, phone, password } = req.body;
        const existingUser = await prisma_js_1.default.user.findUnique({ where: { phone } });
        if (existingUser) {
            return res
                .status(400)
                .json({ message: "A user with this phone number already exists" });
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const user = await prisma_js_1.default.user.create({
            data: { name, phone, password: hashedPassword },
        });
        res.status(201).json({
            message: "User created successfully",
            user: { id: user.id, name: user.name, phone: user.phone, role: user.role },
        });
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { phone, password } = req.body;
        const user = await prisma_js_1.default.user.findUnique({ where: { phone } });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }
        if (!user.isActive) {
            return res.status(403).json({ message: "Account inactive" });
        }
        const isMatch = await bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid password" });
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            path: "/",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        res.status(200).json({
            message: "Login successful",
            user: { id: user.id, name: user.name, phone: user.phone, role: user.role },
        });
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
exports.login = login;

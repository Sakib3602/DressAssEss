import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../config/prisma.js";

export const register = async (req: Request, res: Response) => {
  try {
    const { name, phone, password } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { phone } });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "A user with this phone number already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { name, phone, password: hashedPassword },
    });

    res.status(201).json({
      message: "User created successfully",
      user: { id: user.id, name: user.name, phone: user.phone, role: user.role },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: (error as Error).message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { phone, password } = req.body;

    const user = await prisma.user.findUnique({ where: { phone } });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: "Account inactive" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" }
    );

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
  } catch (error) {
    res.status(500).json({ message: "Server error", error: (error as Error).message });
  }
};
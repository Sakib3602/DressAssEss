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
        .json({ message: "এই phone number দিয়ে user আগে থেকেই আছে" });
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
      return res.status(400).json({ message: "User খুঁজে পাওয়া যায়নি" });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: "Account inactive আছে" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Password ভুল" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: { id: user.id, name: user.name, phone: user.phone, role: user.role },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: (error as Error).message });
  }
};
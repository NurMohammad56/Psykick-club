import { Request, Response } from "express";
import { User } from "../model/user.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const registerUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, userName, fullName, country, dob, password} = req.body;

        // Validate required fields
        if (!email || !userName || !fullName || !country || !dob || !password) {
            return res.status(500).json({ status: false, message: "All fields are required." });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(500).json({ status: false, message: "User already exists." });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await User.create({
            email,
            userName,
            fullName,
            country,
            dob,
            password: hashedPassword,
        });

        // Generate JWT token
        if (!process.env.JWT_SECRET_KEY) {
            console.error("JWT_SECRET_KEY is not set in environment variables.");
            return res.status(500).json({ status: false, message: "Internal server error." });
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: "2h" });

        // Remove pass from response
        const createdUser = await User.findById(user._id).select("-password");

        // Set Token in header
        res.setHeader("Authorization", `Bearer ${token}`);

        return res.status(201).json({
            status: true,
            message: "User registered successfully",
            data: createdUser
        });

    } catch (error) {
        console.error("Error registering user:", error.message);
        return res.status(500).json({ status: false, message: "Internal server error." });
    }
};

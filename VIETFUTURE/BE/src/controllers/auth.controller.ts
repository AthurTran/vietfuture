import { Request, Response } from "express";
import { registerService, loginService } from "../services/auth.service";

export const register = async (req: Request, res: Response) => {
    try {
        const { full_name, email, password, phone, role } = req.body;

        if (!full_name || !email || !password) {
            return res.status(400).json({
                message: "Name, email, password are required"
            });
        }

        const result = await registerService({
            full_name,
            email,
            password,
            phone,
            role
        });

        return res.status(201).json(result);
    } catch (error: any) {
        if (error?.message?.includes("already exists")) {
            return res.status(400).json({
                message: error.message
            });
        }
        console.error("Register Error:", error);
        return res.status(500).json({
            message: "Server error"
        });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        const result = await loginService(email, password);

        return res.status(200).json(result);
    } catch (error: any) {
        if (error?.message === "Invalid credentials") {
            return res.status(401).json({
                message: error.message
            });
        }

        return res.status(500).json({
            message: "Server error"
        });
    }
};

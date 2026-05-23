import { Request, Response, NextFunction } from "express";

import jwt from "jsonwebtoken";

type JwtPayload = {
    user_id: number;
    email: string;
    role: string;
    [key: string]: any;
};

export const verifyToken = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                message: "No token"
            });
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET!
        ) as JwtPayload;

        (req as any).user = decoded;

        next();
    } catch (error) {
        return res.status(401).json({
            message: "Invalid token"
        });
    }
};

export const authorizeRoles = (...roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const user = (req as any).user as JwtPayload | undefined;

        if (!user) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }

        if (!roles.includes(user.role)) {
            return res.status(403).json({
                message: "Forbidden: insufficient privileges"
            });
        }

        next();
    };
};

export const authorizeAdmin = authorizeRoles("admin");

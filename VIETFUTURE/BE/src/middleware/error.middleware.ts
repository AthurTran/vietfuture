import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

export const errorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // Zod validation errors
    if (err instanceof ZodError) {
        return res.status(400).json({
            message: "Validation error",
            errors: err.errors
        });
    }

    const status = err.status || 500;
    const message = err.message || "Internal server error";

    const payload: any = { message };

    if (process.env.NODE_ENV === "development") {
        payload.stack = err.stack;
        if (err.details) payload.details = err.details;
    }

    return res.status(status).json(payload);
};

export default errorHandler;

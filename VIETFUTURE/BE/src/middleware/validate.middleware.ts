import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";

export const validateBody = (schema: ZodSchema<any>) => (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        schema.parse(req.body);
        return next();
    } catch (err) {
        if (err instanceof ZodError) {
            return res.status(400).json({
                message: "Validation error",
                errors: err.errors
            });
        }
        return next(err);
    }
};

export default validateBody;

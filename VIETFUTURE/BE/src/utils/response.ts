import { Response } from "express";

export const successResponse = (
    res: Response,
    data: any = null,
    message = "Success",
    status = 200
) => {
    return res.status(status).json({
        success: true,
        message,
        data
    });
};

export const errorResponse = (
    res: Response,
    message = "Error",
    status = 400,
    details: any = null
) => {
    const payload: any = {
        success: false,
        message
    };
    if (details) payload.details = details;
    return res.status(status).json(payload);
};

export default { successResponse, errorResponse };

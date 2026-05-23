import { Request, Response } from "express";
import { prisma } from "../config/prisma";
import { askAIService } from "../services/ai.service";

export const askAI = async (
    req: Request,
    res: Response
) => {
    try {
        const { question, user_id } = req.body;

        if (!question) {
            return res.status(400).json({
                message: "Question is required"
            });
        }

        const answer = await askAIService(question);

        if (user_id) {
            await prisma.aIChatHistory.create({
                data: {
                    user_id,
                    question,
                    answer
                }
            });
        }

        return res.status(200).json({
            message: "Ask AI success",
            data: {
                question,
                answer
            }
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Server error"
        });
    }
};
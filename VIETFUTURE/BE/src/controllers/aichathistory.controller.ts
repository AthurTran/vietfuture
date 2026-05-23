import { Request, Response } from "express";

import {
    getAllAIChatHistoriesService,
    getAIChatHistoryByIdService,
    createAIChatHistoryService,
    updateAIChatHistoryService,
    deleteAIChatHistoryService
} from "../services/aichathistory.service";

const getAllAIChatHistories = async (
    req: Request,
    res: Response
) => {
    const chatHistories = await getAllAIChatHistoriesService();
    return res.json(chatHistories);
};

const getAIChatHistoryById = async (
    req: Request,
    res: Response
) => {
    const id = Number(req.params.id);
    const chatHistory = await getAIChatHistoryByIdService(id);
    return res.json(chatHistory);
};

const createAIChatHistory = async (
    req: Request,
    res: Response
) => {
    const chatHistory = await createAIChatHistoryService(req.body);
    return res.json(chatHistory);
};

const updateAIChatHistory = async (
    req: Request,
    res: Response
) => {
    const id = Number(req.params.id);
    const chatHistory = await updateAIChatHistoryService(id, req.body);
    return res.json(chatHistory);
};

const deleteAIChatHistory = async (
    req: Request,
    res: Response
) => {
    const id = Number(req.params.id);
    await deleteAIChatHistoryService(id);
    return res.json({
        message: "Delete success"
    });
};

export { getAllAIChatHistories, getAIChatHistoryById, createAIChatHistory, updateAIChatHistory, deleteAIChatHistory };
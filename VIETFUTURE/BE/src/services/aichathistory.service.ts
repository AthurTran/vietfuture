import { prisma } from "../config/prisma";

const getAllAIChatHistoriesService = async () => {
    return await prisma.aIChatHistory.findMany();
};

const getAIChatHistoryByIdService = async (id: number) => {
    return await prisma.aIChatHistory.findUnique({
        where: {
            chat_id: id
        }
    });
};

const createAIChatHistoryService = async (data: any) => {
    return await prisma.aIChatHistory.create({
        data
    });
};

const updateAIChatHistoryService = async (
    id: number,
    data: any
) => {
    return await prisma.aIChatHistory.update({
        where: {
            chat_id: id
        },
        data
    });
};

const deleteAIChatHistoryService = async (id: number) => {
    return await prisma.aIChatHistory.delete({
        where: {
            chat_id: id
        }
    });
};

export {
    getAllAIChatHistoriesService,
    getAIChatHistoryByIdService,
    createAIChatHistoryService,
    updateAIChatHistoryService,
    deleteAIChatHistoryService
};
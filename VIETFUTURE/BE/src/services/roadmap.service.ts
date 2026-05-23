import { prisma } from "../config/prisma";

const getAllRoadmapsService = async () => {
    return await prisma.roadmap.findMany();
};

const getRoadmapByIdService = async (id: number) => {
    return await prisma.roadmap.findUnique({
        where: {
            roadmap_id: id
        }
    });
};

const createRoadmapService = async (data: any) => {
    return await prisma.roadmap.create({
        data
    });
};

const updateRoadmapService = async (
    id: number,
    data: any
) => {
    return await prisma.roadmap.update({
        where: {
            roadmap_id: id
        },
        data
    });
};

const deleteRoadmapService = async (id: number) => {
    return await prisma.roadmap.delete({
        where: {
            roadmap_id: id
        }
    });
};

export {
    getAllRoadmapsService,
    getRoadmapByIdService,
    createRoadmapService,
    updateRoadmapService,
    deleteRoadmapService
};

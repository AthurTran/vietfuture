import { prisma } from "../config/prisma";

const getAllCareerPathsService = async () => {
    return await prisma.careerPath.findMany();
};

const getCareerPathByIdService = async (id: number) => {
    return await prisma.careerPath.findUnique({
        where: {
            career_id: id
        }
    });
};

const createCareerPathService = async (data: any) => {
    return await prisma.careerPath.create({
        data
    });
};

const updateCareerPathService = async (
    id: number,
    data: any
) => {
    return await prisma.careerPath.update({
        where: {
            career_id: id
        },
        data
    });
};

const deleteCareerPathService = async (id: number) => {
    return await prisma.careerPath.delete({
        where: {
            career_id: id
        }
    });
};

export {
    getAllCareerPathsService,
    getCareerPathByIdService,
    createCareerPathService,
    updateCareerPathService,
    deleteCareerPathService
};
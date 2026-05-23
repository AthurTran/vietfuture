import { prisma } from "../config/prisma";

const getAllCareerSkillsService = async () => {
    return await prisma.careerSkill.findMany();
};

const getCareerSkillByIdService = async (id: number) => {
    return await prisma.careerSkill.findUnique({
        where: {
            career_skill_id: id
        }
    });
};

const createCareerSkillService = async (data: any) => {
    return await prisma.careerSkill.create({
        data
    });
};

const updateCareerSkillService = async (
    id: number,
    data: any
) => {
    return await prisma.careerSkill.update({
        where: {
            career_skill_id: id
        },
        data
    });
};

const deleteCareerSkillService = async (id: number) => {
    return await prisma.careerSkill.delete({
        where: {
            career_skill_id: id
        }
    });
};

export {
    getAllCareerSkillsService,
    getCareerSkillByIdService,
    createCareerSkillService,
    updateCareerSkillService,
    deleteCareerSkillService
};
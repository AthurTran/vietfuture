import { prisma } from "../config/prisma";

const getAllSkillsService = async () => {
    return await prisma.skill.findMany();
};

const getSkillByIdService = async (id: number) => {
    return await prisma.skill.findUnique({
        where: {
            skill_id: id
        }
    });
};

const createSkillService = async (data: any) => {
    return await prisma.skill.create({
        data
    });
};

const updateSkillService = async (
    id: number,
    data: any
) => {
    return await prisma.skill.update({
        where: {
            skill_id: id
        },
        data
    });
};

const deleteSkillService = async (id: number) => {
    return await prisma.skill.delete({
        where: {
            skill_id: id
        }
    });
};

export {
    getAllSkillsService,
    getSkillByIdService,
    createSkillService,
    updateSkillService,
    deleteSkillService
};
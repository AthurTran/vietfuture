import { prisma } from "../config/prisma";

const getAllCourseSkillsService = async () => {
    return await prisma.courseSkill.findMany();
};

const getCourseSkillByIdService = async (id: number) => {
    return await prisma.courseSkill.findUnique({
        where: {
            course_skill_id: id
        }
    });
};

const createCourseSkillService = async (data: any) => {
    return await prisma.courseSkill.create({
        data
    });
};

const updateCourseSkillService = async (
    id: number,
    data: any
) => {
    return await prisma.courseSkill.update({
        where: {
            course_skill_id: id
        },
        data
    });
};

const deleteCourseSkillService = async (id: number) => {
    return await prisma.courseSkill.delete({
        where: {
            course_skill_id: id
        }
    });
};

export {
    getAllCourseSkillsService,
    getCourseSkillByIdService,
    createCourseSkillService,
    updateCourseSkillService,
    deleteCourseSkillService
};
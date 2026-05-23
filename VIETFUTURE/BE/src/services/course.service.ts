import { prisma } from "../config/prisma";

const getAllCoursesService = async () => {
    return await prisma.course.findMany();
};

const getCourseByIdService = async (id: number) => {
    return await prisma.course.findUnique({
        where: {
            course_id: id
        }
    });
};

const createCourseService = async (data: any) => {
    return await prisma.course.create({
        data
    });
};

const updateCourseService = async (
    id: number,
    data: any
) => {
    return await prisma.course.update({
        where: {
            course_id: id
        },
        data
    });
};

const deleteCourseService = async (id: number) => {
    return await prisma.course.delete({
        where: {
            course_id: id
        }
    });
};

export {
    getAllCoursesService,
    getCourseByIdService,
    createCourseService,
    updateCourseService,
    deleteCourseService
};
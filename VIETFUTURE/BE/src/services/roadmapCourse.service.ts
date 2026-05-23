import { prisma } from "../config/prisma";

const getAllRoadmapCoursesService = async () => {
    return await prisma.roadmapCourse.findMany();
};

const getRoadmapCourseByIdService = async (id: number) => {
    return await prisma.roadmapCourse.findUnique({
        where: {
            roadmap_course_id: id
        }
    });
};

const createRoadmapCourseService = async (data: any) => {
    return await prisma.roadmapCourse.create({
        data
    });
};

const updateRoadmapCourseService = async (
    id: number,
    data: any
) => {
    return await prisma.roadmapCourse.update({
        where: {
            roadmap_course_id: id
        },
        data
    });
};

const deleteRoadmapCourseService = async (id: number) => {
    return await prisma.roadmapCourse.delete({
        where: {
            roadmap_course_id: id
        }
    });
};

export {
    getAllRoadmapCoursesService,
    getRoadmapCourseByIdService,
    createRoadmapCourseService,
    updateRoadmapCourseService,
    deleteRoadmapCourseService
};
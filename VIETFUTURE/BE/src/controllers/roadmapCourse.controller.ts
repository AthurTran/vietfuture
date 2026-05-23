import { Request, Response } from "express";

import {
    getAllRoadmapCoursesService,
    getRoadmapCourseByIdService,
    createRoadmapCourseService,
    updateRoadmapCourseService,
    deleteRoadmapCourseService
} from "../services/roadmapCourse.service";

const getAllRoadmapCourses = async (
    req: Request,
    res: Response
) => {
    const roadmapCourses = await getAllRoadmapCoursesService();
    return res.json(roadmapCourses);
};

const getRoadmapCourseById = async (
    req: Request,
    res: Response
) => {
    const id = Number(req.params.id);
    const roadmapCourse = await getRoadmapCourseByIdService(id);
    return res.json(roadmapCourse);
};

const createRoadmapCourse = async (
    req: Request,
    res: Response
) => {
    const roadmapCourse = await createRoadmapCourseService(req.body);
    return res.json(roadmapCourse);
};

const updateRoadmapCourse = async (
    req: Request,
    res: Response
) => {
    const id = Number(req.params.id);
    const roadmapCourse = await updateRoadmapCourseService(id, req.body);
    return res.json(roadmapCourse);
};

const deleteRoadmapCourse = async (
    req: Request,
    res: Response
) => {
    const id = Number(req.params.id);
    await deleteRoadmapCourseService(id);
    return res.json({
        message: "Delete success"
    });
};

export { getAllRoadmapCourses, getRoadmapCourseById, createRoadmapCourse, updateRoadmapCourse, deleteRoadmapCourse };
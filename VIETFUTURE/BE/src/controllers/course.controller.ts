import { Request, Response } from "express";

import {
    getAllCoursesService,
    getCourseByIdService,
    createCourseService,
    updateCourseService,
    deleteCourseService
} from "../services/course.service";

const getAllCourses = async (
    req: Request,
    res: Response
) => {
    const courses = await getAllCoursesService();
    return res.json(courses);
};

const getCourseById = async (
    req: Request,
    res: Response
) => {
    const id = Number(req.params.id);
    const course = await getCourseByIdService(id);
    return res.json(course);
};

const createCourse = async (
    req: Request,
    res: Response
) => {
    const course = await createCourseService(req.body);
    return res.json(course);
};

const updateCourse = async (
    req: Request,
    res: Response
) => {
    const id = Number(req.params.id);
    const course = await updateCourseService(id, req.body);
    return res.json(course);
};

const deleteCourse = async (
    req: Request,
    res: Response
) => {
    const id = Number(req.params.id);
    await deleteCourseService(id);
    return res.json({
        message: "Delete success"
    });
};

export { getAllCourses, getCourseById, createCourse, updateCourse, deleteCourse };
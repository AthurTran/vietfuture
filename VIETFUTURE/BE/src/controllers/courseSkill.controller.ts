import { Request, Response } from "express";

import {
    getAllCourseSkillsService,
    getCourseSkillByIdService,
    createCourseSkillService,
    updateCourseSkillService,
    deleteCourseSkillService
} from "../services/courseSkill.service";

const getAllCourseSkills = async (
    req: Request,
    res: Response
) => {
    const courseSkills = await getAllCourseSkillsService();
    return res.json(courseSkills);
};

const getCourseSkillById = async (
    req: Request,
    res: Response
) => {
    const id = Number(req.params.id);
    const courseSkill = await getCourseSkillByIdService(id);
    return res.json(courseSkill);
};

const createCourseSkill = async (
    req: Request,
    res: Response
) => {
    const courseSkill = await createCourseSkillService(req.body);
    return res.json(courseSkill);
};

const updateCourseSkill = async (
    req: Request,
    res: Response
) => {
    const id = Number(req.params.id);
    const courseSkill = await updateCourseSkillService(id, req.body);
    return res.json(courseSkill);
};

const deleteCourseSkill = async (
    req: Request,
    res: Response
) => {
    const id = Number(req.params.id);
    await deleteCourseSkillService(id);
    return res.json({
        message: "Delete success"
    });
};

export { getAllCourseSkills, getCourseSkillById, createCourseSkill, updateCourseSkill, deleteCourseSkill };
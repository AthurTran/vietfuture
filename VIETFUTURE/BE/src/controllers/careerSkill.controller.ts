import { Request, Response } from "express";

import {
    getAllCareerSkillsService,
    getCareerSkillByIdService,
    createCareerSkillService,
    updateCareerSkillService,
    deleteCareerSkillService
} from "../services/careerSkill.service";

const getAllCareerSkills = async (
    req: Request,
    res: Response
) => {
    const careerSkills = await getAllCareerSkillsService();
    return res.json(careerSkills);
};

const getCareerSkillById = async (
    req: Request,
    res: Response
) => {
    const id = Number(req.params.id);
    const careerSkill = await getCareerSkillByIdService(id);
    return res.json(careerSkill);
};

const createCareerSkill = async (
    req: Request,
    res: Response
) => {
    const careerSkill = await createCareerSkillService(req.body);
    return res.json(careerSkill);
};

const updateCareerSkill = async (
    req: Request,
    res: Response
) => {
    const id = Number(req.params.id);
    const careerSkill = await updateCareerSkillService(id, req.body);
    return res.json(careerSkill);
};

const deleteCareerSkill = async (
    req: Request,
    res: Response
) => {
    const id = Number(req.params.id);
    await deleteCareerSkillService(id);
    return res.json({
        message: "Delete success"
    });
};

export { getAllCareerSkills, getCareerSkillById, createCareerSkill, updateCareerSkill, deleteCareerSkill };
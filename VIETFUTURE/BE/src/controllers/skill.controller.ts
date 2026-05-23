import { Request, Response } from "express";

import {
    getAllSkillsService,
    getSkillByIdService,
    createSkillService,
    updateSkillService,
    deleteSkillService
} from "../services/skill.service";

const getAllSkills = async (
    req: Request,
    res: Response
) => {
    const skills = await getAllSkillsService();
    return res.json(skills);
};

const getSkillById = async (
    req: Request,
    res: Response
) => {
    const id = Number(req.params.id);
    const skill = await getSkillByIdService(id);
    return res.json(skill);
};

const createSkill = async (
    req: Request,
    res: Response
) => {
    const skill = await createSkillService(req.body);
    return res.json(skill);
};

const updateSkill = async (
    req: Request,
    res: Response
) => {
    const id = Number(req.params.id);
    const skill = await updateSkillService(id, req.body);
    return res.json(skill);
};

const deleteSkill = async (
    req: Request,
    res: Response
) => {
    const id = Number(req.params.id);
    await deleteSkillService(id);
    return res.json({
        message: "Delete success"
    });
};

export { getAllSkills, getSkillById, createSkill, updateSkill, deleteSkill };
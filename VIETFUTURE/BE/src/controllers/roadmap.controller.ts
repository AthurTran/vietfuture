import { Request, Response } from "express";

import {
    getAllRoadmapsService,
    getRoadmapByIdService,
    createRoadmapService,
    updateRoadmapService,
    deleteRoadmapService
} from "../services/roadmap.service";

const getAllRoadmaps = async (
    req: Request,
    res: Response
) => {
    const roadmaps = await getAllRoadmapsService();
    return res.json(roadmaps);
};

const getRoadmapById = async (
    req: Request,
    res: Response
) => {
    const id = Number(req.params.id);
    const roadmap = await getRoadmapByIdService(id);
    return res.json(roadmap);
};

const createRoadmap = async (
    req: Request,
    res: Response
) => {
    const roadmap = await createRoadmapService(req.body);
    return res.json(roadmap);
};

const updateRoadmap = async (
    req: Request,
    res: Response
) => {
    const id = Number(req.params.id);
    const roadmap = await updateRoadmapService(id, req.body);
    return res.json(roadmap);
};

const deleteRoadmap = async (
    req: Request,
    res: Response
) => {
    const id = Number(req.params.id);
    await deleteRoadmapService(id);
    return res.json({
        message: "Delete success"
    });
};

export { getAllRoadmaps, getRoadmapById, createRoadmap, updateRoadmap, deleteRoadmap };
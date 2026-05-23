import { Request, Response } from "express";

import {
    getAllCareerPathsService,
    getCareerPathByIdService,
    createCareerPathService,
    updateCareerPathService,
    deleteCareerPathService
} from "../services/careerPath.service";

const getAllCareerPaths = async (
    req: Request,
    res: Response
) => {
    const careerPaths = await getAllCareerPathsService();
    return res.json(careerPaths);
};

const getCareerPathById = async (
    req: Request,
    res: Response
) => {
    const id = Number(req.params.id);
    const careerPath = await getCareerPathByIdService(id);
    return res.json(careerPath);
};

const createCareerPath = async (
    req: Request,
    res: Response
) => {
    const careerPath = await createCareerPathService(req.body);
    return res.json(careerPath);
};

const updateCareerPath = async (
    req: Request,
    res: Response
) => {
    const id = Number(req.params.id);
    const careerPath = await updateCareerPathService(id, req.body);
    return res.json(careerPath);
};

const deleteCareerPath = async (
    req: Request,
    res: Response
) => {
    const id = Number(req.params.id);
    await deleteCareerPathService(id);
    return res.json({
        message: "Delete success"
    });
};

export { getAllCareerPaths, getCareerPathById, createCareerPath, updateCareerPath, deleteCareerPath };
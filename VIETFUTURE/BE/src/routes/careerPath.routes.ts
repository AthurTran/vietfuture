import express from "express";

import {
    getAllCareerPaths,
    getCareerPathById,
    createCareerPath,
    updateCareerPath,
    deleteCareerPath
} from "../controllers/careerPath.controller";

const router = express.Router();

router.get("/", getAllCareerPaths);
router.get("/:id", getCareerPathById);
router.post("/", createCareerPath);
router.put("/:id", updateCareerPath);
router.delete("/:id", deleteCareerPath);

export default router;

import express from "express";

import {
    getAllRoadmaps,
    getRoadmapById,
    createRoadmap,
    updateRoadmap,
    deleteRoadmap
} from "../controllers/roadmap.controller";

const router = express.Router();

router.get("/", getAllRoadmaps);
router.get("/:id", getRoadmapById);
router.post("/", createRoadmap);
router.put("/:id", updateRoadmap);
router.delete("/:id", deleteRoadmap);

export default router;

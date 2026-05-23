import express from "express";

import {
    getAllRoadmapCourses,
    getRoadmapCourseById,
    createRoadmapCourse,
    updateRoadmapCourse,
    deleteRoadmapCourse
} from "../controllers/roadmapCourse.controller";

const router = express.Router();

router.get("/", getAllRoadmapCourses);
router.get("/:id", getRoadmapCourseById);
router.post("/", createRoadmapCourse);
router.put("/:id", updateRoadmapCourse);
router.delete("/:id", deleteRoadmapCourse);

export default router;

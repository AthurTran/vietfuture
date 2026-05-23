import express from "express";

import {
    getAllCourseSkills,
    getCourseSkillById,
    createCourseSkill,
    updateCourseSkill,
    deleteCourseSkill
} from "../controllers/courseSkill.controller";

const router = express.Router();

router.get("/", getAllCourseSkills);
router.get("/:id", getCourseSkillById);
router.post("/", createCourseSkill);
router.put("/:id", updateCourseSkill);
router.delete("/:id", deleteCourseSkill);

export default router;

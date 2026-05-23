import express from "express";

import {
    getAllCareerSkills,
    getCareerSkillById,
    createCareerSkill,
    updateCareerSkill,
    deleteCareerSkill
} from "../controllers/careerSkill.controller";

const router = express.Router();

router.get("/", getAllCareerSkills);
router.get("/:id", getCareerSkillById);
router.post("/", createCareerSkill);
router.put("/:id", updateCareerSkill);
router.delete("/:id", deleteCareerSkill);

export default router;

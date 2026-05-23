import express from "express";

import {
    getAllSkills,
    getSkillById,
    createSkill,
    updateSkill,
    deleteSkill
} from "../controllers/skill.controller";

const router = express.Router();

router.get("/", getAllSkills);
router.get("/:id", getSkillById);
router.post("/", createSkill);
router.put("/:id", updateSkill);
router.delete("/:id", deleteSkill);

export default router;

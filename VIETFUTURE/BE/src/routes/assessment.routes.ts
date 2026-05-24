import { Router } from "express";
import * as assessmentController from "../controllers/assessment.controller";

const router = Router();

router.get("/", assessmentController.getAllAssessments);
router.get("/role/:role", assessmentController.getAssessmentByRole);
router.post("/", assessmentController.createAssessment);
router.put("/:id", assessmentController.updateAssessment);
router.delete("/:id", assessmentController.deleteAssessment);

export default router;

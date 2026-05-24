import { Router } from "express";
import * as assessmentController from "../controllers/assessment.controller";

const router = Router();

router.get("/", assessmentController.getAllAssessments);
router.get("/role/:role", assessmentController.getAssessmentByRole);
router.post("/", assessmentController.createAssessment);
router.post("/:id/questions", assessmentController.createQuestion);
router.put("/:id", assessmentController.updateAssessment);
router.delete("/:id", assessmentController.deleteAssessment);
router.delete("/questions/:questionId", assessmentController.deleteQuestion);

export default router;

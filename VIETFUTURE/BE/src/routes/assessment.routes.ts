import { Router } from "express";
import * as assessmentController from "../controllers/assessment.controller";

const router = Router();

router.get("/", assessmentController.getAllAssessments);
router.get("/role/:role", assessmentController.getAssessmentByRole);

export default router;

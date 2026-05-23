import { Request, Response } from "express";
import * as assessmentService from "../services/assessment.service";

export const getAllAssessments = async (req: Request, res: Response) => {
    try {
        const assessments = await assessmentService.getAssessmentsService();
        return res.status(200).json(assessments);
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
};

export const getAssessmentByRole = async (req: Request, res: Response) => {
    try {
        const { role } = req.params;
        const assessment = await assessmentService.getAssessmentByRoleService(String(role));
        
        if (!assessment) {
            return res.status(404).json({ error: "Assessment not found" });
        }

        return res.status(200).json(assessment);
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
};

import { prisma } from "../config/prisma";

export const getAssessmentsService = async () => {
    return await prisma.assessment.findMany({
        include: {
            questions: {
                include: {
                    options: true
                }
            }
        }
    });
};

export const getAssessmentByRoleService = async (roleName: string) => {
    let assessment = await prisma.assessment.findFirst({
        where: { title: roleName },
        include: {
            questions: {
                include: {
                    options: true
                }
            }
        }
    });

    if (!assessment) {
        assessment = await prisma.assessment.findFirst({
            where: { title: "default" },
            include: {
                questions: {
                    include: {
                        options: true
                    }
                }
            }
        });
    }

    return assessment;
};

export const createAssessmentService = async (data: any) => {
    return await prisma.assessment.create({
        data: {
            title: data.title,
            description: data.description,
            duration_minutes: Number(data.duration_minutes),
            total_questions: Number(data.total_questions ?? 0)
        }
    });
};

export const updateAssessmentService = async (id: number, data: any) => {
    return await prisma.assessment.update({
        where: {
            assessment_id: id
        },
        data: {
            title: data.title,
            description: data.description,
            duration_minutes: data.duration_minutes !== undefined ? Number(data.duration_minutes) : undefined,
            total_questions: data.total_questions !== undefined ? Number(data.total_questions) : undefined
        }
    });
};

export const deleteAssessmentService = async (id: number) => {
    return await prisma.assessment.delete({
        where: {
            assessment_id: id
        }
    });
};

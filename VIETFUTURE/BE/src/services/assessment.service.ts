import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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
    // Exact match or fallback to "default" if not found
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

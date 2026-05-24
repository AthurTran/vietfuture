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
    const normalizedRole = (() => {
        const trimmed = String(roleName || "").trim();
        if (trimmed === "Frontend Developer") return "Frontend Engineer";
        if (trimmed === "Backend Developer") return "Backend Engineer";
        return trimmed;
    })();

    let assessment = await prisma.assessment.findFirst({
        where: { title: normalizedRole },
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

export const createQuestionService = async (assessmentId: number, data: any) => {
    return await prisma.$transaction(async (tx) => {
        const currentAssessment = await tx.assessment.findUnique({
            where: { assessment_id: assessmentId },
            select: { total_questions: true }
        });

        const createdQuestion = await tx.question.create({
            data: {
                assessment_id: assessmentId,
                content: data.content,
                question_type: data.question_type,
                difficulty_level: data.difficulty_level,
                score: Number(data.score ?? 1),
                options: {
                    create: (data.options || []).map((option: any) => ({
                        option_text: option.option_text,
                        is_correct: Boolean(option.is_correct)
                    }))
                }
            },
            include: {
                options: true
            }
        });

        await tx.assessment.update({
            where: { assessment_id: assessmentId },
            data: {
                total_questions: Number(currentAssessment?.total_questions ?? 0) + 1
            }
        });

        return createdQuestion;
    });
};

export const deleteQuestionService = async (questionId: number) => {
    return await prisma.$transaction(async (tx) => {
        const question = await tx.question.findUnique({
            where: { question_id: questionId },
            select: { assessment_id: true }
        });

        if (!question) {
            throw new Error("Question not found");
        }

        await tx.questionOption.deleteMany({
            where: { question_id: questionId }
        });

        await tx.userAnswer.deleteMany({
            where: { question_id: questionId }
        });

        await tx.question.delete({
            where: { question_id: questionId }
        });

        const currentAssessment = await tx.assessment.findUnique({
            where: { assessment_id: question.assessment_id },
            select: { total_questions: true }
        });

        await tx.assessment.update({
            where: { assessment_id: question.assessment_id },
            data: {
                total_questions: Math.max(0, Number(currentAssessment?.total_questions ?? 0) - 1)
            }
        });

        return { message: "Delete success" };
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
    return await prisma.$transaction(async (tx) => {
        const assessment = await tx.assessment.findUnique({
            where: {
                assessment_id: id
            },
            include: {
                questions: {
                    select: {
                        question_id: true
                    }
                },
                attempts: {
                    select: {
                        attempt_id: true
                    }
                }
            }
        });

        if (!assessment) {
            throw new Error("Assessment not found");
        }

        const questionIds = assessment.questions.map((question) => question.question_id);
        const attemptIds = assessment.attempts.map((attempt) => attempt.attempt_id);

        if (attemptIds.length > 0) {
            await tx.skillReport.deleteMany({
                where: {
                    attempt_id: {
                        in: attemptIds
                    }
                }
            });

            await tx.userAnswer.deleteMany({
                where: {
                    attempt_id: {
                        in: attemptIds
                    }
                }
            });

            await tx.assessmentAttempt.deleteMany({
                where: {
                    attempt_id: {
                        in: attemptIds
                    }
                }
            });
        }

        if (questionIds.length > 0) {
            await tx.userAnswer.deleteMany({
                where: {
                    question_id: {
                        in: questionIds
                    }
                }
            });

            await tx.questionOption.deleteMany({
                where: {
                    question_id: {
                        in: questionIds
                    }
                }
            });

            await tx.question.deleteMany({
                where: {
                    question_id: {
                        in: questionIds
                    }
                }
            });
        }

        await tx.assessment.delete({
            where: {
                assessment_id: id
            }
        });

        return { message: "Delete success" };
    });
};

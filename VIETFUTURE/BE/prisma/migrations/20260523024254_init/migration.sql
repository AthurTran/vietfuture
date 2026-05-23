/*
  Warnings:

  - You are about to alter the column `status` on the `roadmap` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(2))`.
  - You are about to alter the column `status` on the `roadmapcourse` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(3))`.
  - A unique constraint covering the columns `[career_id,skill_id]` on the table `CareerSkill` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[course_id,skill_id]` on the table `CourseSkill` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[roadmap_id,course_id]` on the table `RoadmapCourse` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updated_at` to the `Course` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `course` ADD COLUMN `updated_at` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `roadmap` MODIFY `status` ENUM('active', 'paused', 'completed') NOT NULL DEFAULT 'active';

-- AlterTable
ALTER TABLE `roadmapcourse` MODIFY `status` ENUM('not_started', 'in_progress', 'completed') NOT NULL DEFAULT 'not_started';

-- AlterTable
ALTER TABLE `user` ADD COLUMN `updated_at` DATETIME(3) NOT NULL;

-- CreateTable
CREATE TABLE `Question` (
    `question_id` INTEGER NOT NULL AUTO_INCREMENT,
    `assessment_id` INTEGER NOT NULL,
    `content` VARCHAR(191) NOT NULL,
    `question_type` VARCHAR(191) NOT NULL,
    `difficulty_level` VARCHAR(191) NULL,
    `score` DOUBLE NOT NULL DEFAULT 1,

    PRIMARY KEY (`question_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `QuestionOption` (
    `option_id` INTEGER NOT NULL AUTO_INCREMENT,
    `question_id` INTEGER NOT NULL,
    `option_text` VARCHAR(191) NOT NULL,
    `is_correct` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`option_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Assessment` (
    `assessment_id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `duration_minutes` INTEGER NULL,
    `total_questions` INTEGER NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`assessment_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AssessmentAttempt` (
    `attempt_id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `assessment_id` INTEGER NOT NULL,
    `started_at` DATETIME(3) NULL,
    `submitted_at` DATETIME(3) NULL,
    `score` DOUBLE NULL,
    `status` ENUM('in_progress', 'temp_saved', 'submitted', 'grading', 'analyzing', 'completed', 'canceled') NOT NULL DEFAULT 'in_progress',
    `analysis_result` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`attempt_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserAnswer` (
    `answer_id` INTEGER NOT NULL AUTO_INCREMENT,
    `attempt_id` INTEGER NOT NULL,
    `question_id` INTEGER NOT NULL,
    `selected_option_id` INTEGER NULL,
    `answer_text` VARCHAR(191) NULL,
    `score` DOUBLE NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`answer_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SkillReport` (
    `report_id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `attempt_id` INTEGER NOT NULL,
    `overall_score` DOUBLE NULL,
    `strengths` VARCHAR(191) NULL,
    `weaknesses` VARCHAR(191) NULL,
    `recommendations` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`report_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RecommendedCourse` (
    `recommendation_id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `course_id` INTEGER NOT NULL,
    `status` ENUM('ai_suggested', 'viewed', 'saved', 'skipped', 'expired') NOT NULL,
    `viewed_at` DATETIME(3) NULL,
    `saved_at` DATETIME(3) NULL,
    `expired_at` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`recommendation_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `CareerSkill_career_id_skill_id_key` ON `CareerSkill`(`career_id`, `skill_id`);

-- CreateIndex
CREATE UNIQUE INDEX `CourseSkill_course_id_skill_id_key` ON `CourseSkill`(`course_id`, `skill_id`);

-- CreateIndex
CREATE UNIQUE INDEX `RoadmapCourse_roadmap_id_course_id_key` ON `RoadmapCourse`(`roadmap_id`, `course_id`);

-- AddForeignKey
ALTER TABLE `Question` ADD CONSTRAINT `Question_assessment_id_fkey` FOREIGN KEY (`assessment_id`) REFERENCES `Assessment`(`assessment_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `QuestionOption` ADD CONSTRAINT `QuestionOption_question_id_fkey` FOREIGN KEY (`question_id`) REFERENCES `Question`(`question_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AssessmentAttempt` ADD CONSTRAINT `AssessmentAttempt_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AssessmentAttempt` ADD CONSTRAINT `AssessmentAttempt_assessment_id_fkey` FOREIGN KEY (`assessment_id`) REFERENCES `Assessment`(`assessment_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserAnswer` ADD CONSTRAINT `UserAnswer_attempt_id_fkey` FOREIGN KEY (`attempt_id`) REFERENCES `AssessmentAttempt`(`attempt_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserAnswer` ADD CONSTRAINT `UserAnswer_question_id_fkey` FOREIGN KEY (`question_id`) REFERENCES `Question`(`question_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserAnswer` ADD CONSTRAINT `UserAnswer_selected_option_id_fkey` FOREIGN KEY (`selected_option_id`) REFERENCES `QuestionOption`(`option_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SkillReport` ADD CONSTRAINT `SkillReport_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SkillReport` ADD CONSTRAINT `SkillReport_attempt_id_fkey` FOREIGN KEY (`attempt_id`) REFERENCES `AssessmentAttempt`(`attempt_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RecommendedCourse` ADD CONSTRAINT `RecommendedCourse_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RecommendedCourse` ADD CONSTRAINT `RecommendedCourse_course_id_fkey` FOREIGN KEY (`course_id`) REFERENCES `Course`(`course_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

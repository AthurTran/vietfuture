-- CreateTable
CREATE TABLE `User` (
    `user_id` INTEGER NOT NULL AUTO_INCREMENT,
    `full_name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password_hash` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NULL,
    `role` ENUM('student', 'admin') NOT NULL DEFAULT 'student',
    `status` ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Skill` (
    `skill_id` INTEGER NOT NULL AUTO_INCREMENT,
    `skill_name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `category` VARCHAR(191) NULL,

    PRIMARY KEY (`skill_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CareerPath` (
    `career_id` INTEGER NOT NULL AUTO_INCREMENT,
    `career_name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `salary_range` VARCHAR(191) NULL,
    `demand_level` VARCHAR(191) NULL,

    PRIMARY KEY (`career_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CareerSkill` (
    `career_skill_id` INTEGER NOT NULL AUTO_INCREMENT,
    `career_id` INTEGER NOT NULL,
    `skill_id` INTEGER NOT NULL,
    `required_level` VARCHAR(191) NULL,

    PRIMARY KEY (`career_skill_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Roadmap` (
    `roadmap_id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `career_id` INTEGER NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `progress_percent` DOUBLE NOT NULL DEFAULT 0,
    `status` VARCHAR(191) NOT NULL DEFAULT 'active',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`roadmap_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Course` (
    `course_id` INTEGER NOT NULL AUTO_INCREMENT,
    `course_name` VARCHAR(191) NOT NULL,
    `provider` VARCHAR(191) NULL,
    `description` VARCHAR(191) NULL,
    `level` VARCHAR(191) NULL,
    `duration_hours` INTEGER NULL,
    `course_url` VARCHAR(191) NULL,

    PRIMARY KEY (`course_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RoadmapCourse` (
    `roadmap_course_id` INTEGER NOT NULL AUTO_INCREMENT,
    `roadmap_id` INTEGER NOT NULL,
    `course_id` INTEGER NOT NULL,
    `sequence_order` INTEGER NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'not_started',
    `completion_percent` DOUBLE NOT NULL DEFAULT 0,

    PRIMARY KEY (`roadmap_course_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CourseSkill` (
    `course_skill_id` INTEGER NOT NULL AUTO_INCREMENT,
    `course_id` INTEGER NOT NULL,
    `skill_id` INTEGER NOT NULL,

    PRIMARY KEY (`course_skill_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AIChatHistory` (
    `chat_id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `question` VARCHAR(191) NOT NULL,
    `answer` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`chat_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `CareerSkill` ADD CONSTRAINT `CareerSkill_career_id_fkey` FOREIGN KEY (`career_id`) REFERENCES `CareerPath`(`career_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CareerSkill` ADD CONSTRAINT `CareerSkill_skill_id_fkey` FOREIGN KEY (`skill_id`) REFERENCES `Skill`(`skill_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Roadmap` ADD CONSTRAINT `Roadmap_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Roadmap` ADD CONSTRAINT `Roadmap_career_id_fkey` FOREIGN KEY (`career_id`) REFERENCES `CareerPath`(`career_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RoadmapCourse` ADD CONSTRAINT `RoadmapCourse_roadmap_id_fkey` FOREIGN KEY (`roadmap_id`) REFERENCES `Roadmap`(`roadmap_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RoadmapCourse` ADD CONSTRAINT `RoadmapCourse_course_id_fkey` FOREIGN KEY (`course_id`) REFERENCES `Course`(`course_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CourseSkill` ADD CONSTRAINT `CourseSkill_course_id_fkey` FOREIGN KEY (`course_id`) REFERENCES `Course`(`course_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CourseSkill` ADD CONSTRAINT `CourseSkill_skill_id_fkey` FOREIGN KEY (`skill_id`) REFERENCES `Skill`(`skill_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AIChatHistory` ADD CONSTRAINT `AIChatHistory_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

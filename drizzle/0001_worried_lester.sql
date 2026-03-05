CREATE TABLE `alternatives` (
	`id` int AUTO_INCREMENT NOT NULL,
	`questionId` int NOT NULL,
	`text` longtext NOT NULL,
	`isCorrect` boolean NOT NULL DEFAULT false,
	`order` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `alternatives_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `assessments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`courseId` int NOT NULL,
	`lessonId` int,
	`title` varchar(255) NOT NULL,
	`type` enum('per_lesson','final') NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `assessments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `courses` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` longtext,
	`coverUrl` varchar(500),
	`trailerUrl` varchar(500),
	`loadHours` int NOT NULL,
	`price` decimal(10,2) NOT NULL,
	`minGrade` int NOT NULL DEFAULT 70,
	`maxInstallments` int NOT NULL DEFAULT 1,
	`professorId` int NOT NULL,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `courses_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `enrollments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`studentId` int NOT NULL,
	`courseId` int NOT NULL,
	`enrollmentDate` timestamp NOT NULL DEFAULT (now()),
	`status` enum('active','completed','suspended') NOT NULL DEFAULT 'active',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `enrollments_id` PRIMARY KEY(`id`),
	CONSTRAINT `studentCourse_unique` UNIQUE(`studentId`,`courseId`)
);
--> statement-breakpoint
CREATE TABLE `installments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`paymentId` int NOT NULL,
	`installmentNumber` int NOT NULL,
	`value` decimal(10,2) NOT NULL,
	`dueDate` timestamp NOT NULL,
	`paidDate` timestamp,
	`status` enum('pending','paid','overdue') NOT NULL DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `installments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `lessons` (
	`id` int AUTO_INCREMENT NOT NULL,
	`courseId` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`type` enum('video','text','live') NOT NULL,
	`content` longtext,
	`videoUrl` varchar(500),
	`liveUrl` varchar(500),
	`order` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `lessons_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `materials` (
	`id` int AUTO_INCREMENT NOT NULL,
	`lessonId` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`driveLink` varchar(500) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `materials_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `notifications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`type` enum('payment_reminder','course_completed','approval','overdue') NOT NULL,
	`title` varchar(255) NOT NULL,
	`message` longtext NOT NULL,
	`relatedId` int,
	`isRead` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `notifications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `payments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`studentId` int NOT NULL,
	`courseId` int NOT NULL,
	`totalValue` decimal(10,2) NOT NULL,
	`downPayment` decimal(10,2) NOT NULL,
	`installmentCount` int NOT NULL,
	`paidInstallments` int NOT NULL DEFAULT 0,
	`status` enum('pending','partial','paid','overdue') NOT NULL DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `payments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `progress` (
	`id` int AUTO_INCREMENT NOT NULL,
	`studentId` int NOT NULL,
	`lessonId` int NOT NULL,
	`completed` boolean NOT NULL DEFAULT false,
	`completedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `progress_id` PRIMARY KEY(`id`),
	CONSTRAINT `studentLesson_unique` UNIQUE(`studentId`,`lessonId`)
);
--> statement-breakpoint
CREATE TABLE `questions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`assessmentId` int NOT NULL,
	`questionText` longtext NOT NULL,
	`order` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `questions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `sessions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`ipAddress` varchar(45),
	`deviceId` varchar(255),
	`userAgent` longtext,
	`loginAt` timestamp NOT NULL DEFAULT (now()),
	`lastActivityAt` timestamp NOT NULL DEFAULT (now()),
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `sessions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `studentAnswers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`studentId` int NOT NULL,
	`assessmentId` int NOT NULL,
	`questionId` int NOT NULL,
	`selectedAlternativeId` int NOT NULL,
	`isCorrect` boolean NOT NULL,
	`submittedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `studentAnswers_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `role` enum('user','admin','professor') NOT NULL DEFAULT 'user';--> statement-breakpoint
ALTER TABLE `users` ADD CONSTRAINT `users_email_unique` UNIQUE(`email`);--> statement-breakpoint
CREATE INDEX `questionId_idx` ON `alternatives` (`questionId`);--> statement-breakpoint
CREATE INDEX `courseId_idx` ON `assessments` (`courseId`);--> statement-breakpoint
CREATE INDEX `lessonId_idx` ON `assessments` (`lessonId`);--> statement-breakpoint
CREATE INDEX `professorId_idx` ON `courses` (`professorId`);--> statement-breakpoint
CREATE INDEX `isActive_idx` ON `courses` (`isActive`);--> statement-breakpoint
CREATE INDEX `studentId_idx` ON `enrollments` (`studentId`);--> statement-breakpoint
CREATE INDEX `courseId_idx` ON `enrollments` (`courseId`);--> statement-breakpoint
CREATE INDEX `paymentId_idx` ON `installments` (`paymentId`);--> statement-breakpoint
CREATE INDEX `dueDate_idx` ON `installments` (`dueDate`);--> statement-breakpoint
CREATE INDEX `status_idx` ON `installments` (`status`);--> statement-breakpoint
CREATE INDEX `courseId_idx` ON `lessons` (`courseId`);--> statement-breakpoint
CREATE INDEX `order_idx` ON `lessons` (`order`);--> statement-breakpoint
CREATE INDEX `lessonId_idx` ON `materials` (`lessonId`);--> statement-breakpoint
CREATE INDEX `userId_idx` ON `notifications` (`userId`);--> statement-breakpoint
CREATE INDEX `type_idx` ON `notifications` (`type`);--> statement-breakpoint
CREATE INDEX `isRead_idx` ON `notifications` (`isRead`);--> statement-breakpoint
CREATE INDEX `studentId_idx` ON `payments` (`studentId`);--> statement-breakpoint
CREATE INDEX `courseId_idx` ON `payments` (`courseId`);--> statement-breakpoint
CREATE INDEX `status_idx` ON `payments` (`status`);--> statement-breakpoint
CREATE INDEX `studentId_idx` ON `progress` (`studentId`);--> statement-breakpoint
CREATE INDEX `lessonId_idx` ON `progress` (`lessonId`);--> statement-breakpoint
CREATE INDEX `assessmentId_idx` ON `questions` (`assessmentId`);--> statement-breakpoint
CREATE INDEX `userId_idx` ON `sessions` (`userId`);--> statement-breakpoint
CREATE INDEX `ipAddress_idx` ON `sessions` (`ipAddress`);--> statement-breakpoint
CREATE INDEX `isActive_idx` ON `sessions` (`isActive`);--> statement-breakpoint
CREATE INDEX `studentId_idx` ON `studentAnswers` (`studentId`);--> statement-breakpoint
CREATE INDEX `assessmentId_idx` ON `studentAnswers` (`assessmentId`);--> statement-breakpoint
CREATE INDEX `email_idx` ON `users` (`email`);--> statement-breakpoint
CREATE INDEX `openId_idx` ON `users` (`openId`);--> statement-breakpoint
CREATE INDEX `role_idx` ON `users` (`role`);
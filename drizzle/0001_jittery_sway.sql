CREATE TABLE `bulletComments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`eventId` int,
	`userId` int,
	`text` text NOT NULL,
	`language` enum('zh','ru','en') NOT NULL DEFAULT 'zh',
	`color` varchar(7) DEFAULT '#FFFFFF',
	`fontSize` int DEFAULT 16,
	`duration` int DEFAULT 8,
	`likes` int DEFAULT 0,
	`verified` boolean DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `bulletComments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `events` (
	`id` int AUTO_INCREMENT NOT NULL,
	`date` timestamp NOT NULL,
	`year` int NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`type` enum('domestic','international','speech','ceremony','military','diplomatic') NOT NULL,
	`latitude` varchar(20) NOT NULL,
	`longitude` varchar(20) NOT NULL,
	`location` varchar(255) NOT NULL,
	`country` varchar(100),
	`significance` int DEFAULT 5,
	`videoUrl` varchar(512),
	`imageUrl` varchar(512),
	`sources` text,
	`verified` boolean DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `events_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `statistics` (
	`id` int AUTO_INCREMENT NOT NULL,
	`year` int NOT NULL,
	`totalFlightDistance` int DEFAULT 0,
	`countriesVisited` int DEFAULT 0,
	`domesticVisits` int DEFAULT 0,
	`internationalVisits` int DEFAULT 0,
	`handshakesCount` int DEFAULT 0,
	`speechesCount` int DEFAULT 0,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `statistics_id` PRIMARY KEY(`id`),
	CONSTRAINT `statistics_year_unique` UNIQUE(`year`)
);
--> statement-breakpoint
ALTER TABLE `bulletComments` ADD CONSTRAINT `bulletComments_eventId_events_id_fk` FOREIGN KEY (`eventId`) REFERENCES `events`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `bulletComments` ADD CONSTRAINT `bulletComments_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;
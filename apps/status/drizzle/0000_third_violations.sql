CREATE TABLE `incident` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`hash` text,
	`title` text NOT NULL,
	`status` text DEFAULT 'open' NOT NULL,
	`site_id` integer NOT NULL,
	`created_at` integer,
	`updated_at` integer,
	`type` text NOT NULL,
	`priority` text NOT NULL,
	`assignee` text NOT NULL,
	`resolved_at` integer,
	`tags` blob,
	FOREIGN KEY (`site_id`) REFERENCES `sites`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `incident_event` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`hash` text,
	`incident_id` integer NOT NULL,
	`title` text NOT NULL,
	`message` text NOT NULL,
	`status` text NOT NULL,
	`created_at` integer,
	`updated_at` integer,
	FOREIGN KEY (`incident_id`) REFERENCES `incident`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `sites` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`hash` text,
	`name` text NOT NULL,
	`url` text NOT NULL,
	`created_at` integer,
	`updated_at` integer
);

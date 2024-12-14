CREATE TABLE `account` (
	`userId` text NOT NULL,
	`type` text NOT NULL,
	`provider` text NOT NULL,
	`providerAccountId` text NOT NULL,
	`refresh_token` text,
	`access_token` text,
	`expires_at` integer,
	`token_type` text,
	`scope` text,
	`id_token` text,
	`session_state` text,
	PRIMARY KEY(`provider`, `providerAccountId`),
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `authenticator` (
	`credentialID` text NOT NULL,
	`userId` text NOT NULL,
	`providerAccountId` text NOT NULL,
	`credentialPublicKey` text NOT NULL,
	`counter` integer NOT NULL,
	`credentialDeviceType` text NOT NULL,
	`credentialBackedUp` integer NOT NULL,
	`transports` text,
	PRIMARY KEY(`userId`, `credentialID`),
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `authenticator_credentialID_unique` ON `authenticator` (`credentialID`);--> statement-breakpoint
CREATE TABLE `company` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`image_url` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `component` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`hash` text,
	`name` text NOT NULL,
	`description` text,
	`status` text DEFAULT 'operational' NOT NULL,
	`published` integer DEFAULT false NOT NULL,
	`order` integer NOT NULL,
	`group_id` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`group_id`) REFERENCES `component_group`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `component_hash_unique` ON `component` (`hash`);--> statement-breakpoint
CREATE TABLE `component_group` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`hash` text,
	`name` text NOT NULL,
	`order` integer NOT NULL,
	`published` integer DEFAULT false NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `component_group_hash_unique` ON `component_group` (`hash`);--> statement-breakpoint
CREATE TABLE `incident` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`hash` text,
	`title` text NOT NULL,
	`slug` text,
	`description` text,
	`visibility` text DEFAULT 'draft' NOT NULL,
	`status` text DEFAULT 'detected' NOT NULL,
	`impact` text NOT NULL,
	`severity` text NOT NULL,
	`started_at` integer NOT NULL,
	`resolved_at` integer,
	`last_update_at` integer,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `incident_hash_unique` ON `incident` (`hash`);--> statement-breakpoint
CREATE UNIQUE INDEX `incident_slug_unique` ON `incident` (`slug`);--> statement-breakpoint
CREATE TABLE `incident_impact` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`hash` text,
	`incident_id` text NOT NULL,
	`component_id` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`incident_id`) REFERENCES `incident`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`component_id`) REFERENCES `component`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `incident_impact_hash_unique` ON `incident_impact` (`hash`);--> statement-breakpoint
CREATE TABLE `incident_update` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`hash` text,
	`incident_id` text NOT NULL,
	`published` integer DEFAULT false NOT NULL,
	`status` text DEFAULT 'detected' NOT NULL,
	`title` text NOT NULL,
	`content` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`incident_id`) REFERENCES `incident`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `incident_update_hash_unique` ON `incident_update` (`hash`);--> statement-breakpoint
CREATE TABLE `maintenance_update` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`hash` text,
	`maintenance_id` text NOT NULL,
	`published` integer DEFAULT false NOT NULL,
	`status` text DEFAULT 'detected' NOT NULL,
	`title` text NOT NULL,
	`content` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`maintenance_id`) REFERENCES `scheduled_maintenance`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `maintenance_update_hash_unique` ON `maintenance_update` (`hash`);--> statement-breakpoint
CREATE TABLE `scheduled_maintenance` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`hash` text,
	`name` text NOT NULL,
	`description` text,
	`status` text DEFAULT 'scheduled' NOT NULL,
	`component` text NOT NULL,
	`scheduled_start_time` integer NOT NULL,
	`published` integer DEFAULT false NOT NULL,
	`scheduled_end_time` integer NOT NULL,
	`actual_start_time` integer,
	`actual_end_time` integer,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`component`) REFERENCES `component`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `scheduled_maintenance_hash_unique` ON `scheduled_maintenance` (`hash`);--> statement-breakpoint
CREATE TABLE `session` (
	`sessionToken` text PRIMARY KEY NOT NULL,
	`userId` text NOT NULL,
	`expires` integer NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text,
	`email` text,
	`emailVerified` integer,
	`image` text,
	`password` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);--> statement-breakpoint
CREATE TABLE `verificationToken` (
	`identifier` text NOT NULL,
	`token` text NOT NULL,
	`expires` integer NOT NULL,
	PRIMARY KEY(`identifier`, `token`)
);

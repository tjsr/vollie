CREATE TABLE `Organisers` (
	`id` integer PRIMARY KEY NOT NULL,
	`entity_name` text NOT NULL,
	`contact_user_id` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `Series` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL,
	`organiser_id` integer
);
--> statement-breakpoint
CREATE TABLE `Users` (
	`id` integer PRIMARY KEY NOT NULL,
	`first_name` text NOT NULL,
	`last_name` text NOT NULL,
	`email` text NOT NULL,
	`phone` text NOT NULL
);

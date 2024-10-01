CREATE TABLE `AccreditationFields` (
	`id` integer PRIMARY KEY NOT NULL,
	`accreditation_id` integer NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL,
	`field_type` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `Events` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`series_id` integer,
	`start_date` text NOT NULL,
	`end_date` text NOT NULL,
	`location` text NOT NULL,
	`description` text,
	`organiser_id` integer NOT NULL,
	FOREIGN KEY (`series_id`) REFERENCES `Series`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`organiser_id`) REFERENCES `Organisations`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `Organisations` (
	`id` integer PRIMARY KEY NOT NULL,
	`entity_name` text NOT NULL,
	`contact_user_id` integer NOT NULL,
	FOREIGN KEY (`contact_user_id`) REFERENCES `Users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `Series` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL,
	`organiser_id` integer,
	FOREIGN KEY (`organiser_id`) REFERENCES `Organisations`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `Users` (
	`id` integer PRIMARY KEY NOT NULL,
	`first_name` text NOT NULL,
	`last_name` text NOT NULL,
	`email` text NOT NULL,
	`phone` text NOT NULL
);

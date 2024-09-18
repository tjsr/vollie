CREATE TABLE `AccreditationFields` (
	`id` integer PRIMARY KEY NOT NULL,
	`accreditation_id` integer NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL,
	`field_type` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `Accreditations` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `EventRequiredRoleAccreditations` (
	`id` integer PRIMARY KEY NOT NULL,
	`event_required_role_id` integer NOT NULL,
	`accreditation_id` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `EventRequiredRoles` (
	`id` integer PRIMARY KEY NOT NULL,
	`event_id` integer NOT NULL,
	`number_required` integer DEFAULT 1,
	`details` text,
	`role_id` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `EventRoles` (
	`id` integer PRIMARY KEY NOT NULL,
	`event_id` integer NOT NULL,
	`user_id` integer NOT NULL,
	`role_id` integer NOT NULL,
	`role_request_created` text NOT NULL,
	`role_approved_by` integer NOT NULL,
	`role_approved_at` text NOT NULL,
	`user_request_notes` text,
	`approver_notes` text
);
--> statement-breakpoint
CREATE TABLE `OrganisationRoles` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text
);
--> statement-breakpoint
CREATE TABLE `UserAccreditationFields` (
	`id` integer PRIMARY KEY NOT NULL,
	`user_accreditation_id` integer NOT NULL,
	`field_id` integer NOT NULL,
	`value` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `UserAccreditations` (
	`id` integer PRIMARY KEY NOT NULL,
	`user_id` integer NOT NULL,
	`accreditation_id` integer NOT NULL,
	`added_date` text NOT NULL,
	`expiry_date` text NOT NULL,
	`verified_by_user` integer NOT NULL,
	`verified_by_time` text NOT NULL
);

ALTER TABLE `Events` ADD `name` text NOT NULL;--> statement-breakpoint
ALTER TABLE `Events` ADD `series_id` integer;--> statement-breakpoint
ALTER TABLE `Events` ADD `start_date` text NOT NULL;--> statement-breakpoint
ALTER TABLE `Events` ADD `end_date` text NOT NULL;--> statement-breakpoint
ALTER TABLE `Events` ADD `location` text NOT NULL;--> statement-breakpoint
ALTER TABLE `Events` ADD `description` text;--> statement-breakpoint
ALTER TABLE `Events` ADD `organiser_id` integer NOT NULL;
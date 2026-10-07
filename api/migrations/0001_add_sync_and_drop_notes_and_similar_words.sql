CREATE TABLE `card_events` (
	`seq` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`card_id` text NOT NULL,
	`at` text NOT NULL,
	`kind` text NOT NULL,
	`rating` text,
	`retention` real,
	`until` text,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `card_events_identity` ON `card_events` (`user_id`,`card_id`,`at`,`kind`);--> statement-breakpoint
CREATE INDEX `card_events_by_account` ON `card_events` (`user_id`,`seq`);--> statement-breakpoint
CREATE TABLE `synced_records` (
	`seq` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`kind` text NOT NULL,
	`id` text NOT NULL,
	`at` text NOT NULL,
	`deleted` integer NOT NULL,
	`payload` text,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `synced_records_identity` ON `synced_records` (`user_id`,`kind`,`id`);--> statement-breakpoint
CREATE INDEX `synced_records_by_account` ON `synced_records` (`user_id`,`seq`);--> statement-breakpoint
CREATE TABLE `synced_settings` (
	`user_id` text NOT NULL,
	`name` text NOT NULL,
	`value` text NOT NULL,
	`at` text NOT NULL,
	PRIMARY KEY(`user_id`, `name`),
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
DROP TABLE `notes`;--> statement-breakpoint
DROP TABLE `similar_words`;
CREATE TABLE `push_subscriptions` (
	`user_id` text NOT NULL,
	`endpoint` text NOT NULL,
	`hour` integer NOT NULL,
	`time_zone` text NOT NULL,
	`goal_met_on` text,
	`last_sent_on` text,
	PRIMARY KEY(`user_id`, `endpoint`),
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);

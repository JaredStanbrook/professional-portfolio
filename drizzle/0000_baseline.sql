-- Baseline for the move onto the Frugal template. Hand-edited, deliberately.
--
-- The live database already has most of these tables: the old app generated
-- its migrations locally and never committed them, so there is no history
-- here to continue from. Every statement is therefore IF NOT EXISTS, which
-- makes this one file correct both for the live database (creates only what
-- is missing) and for a fresh one (creates everything). The structure is
-- exactly what `drizzle-kit generate` produced, so the 0000 snapshot stays
-- accurate and the next `npm run gen` diffs cleanly.
--
-- The one destructive step is `sessions`. The old schema declared a sessions
-- table of a different shape (secret_hash, last_activity_at) but never
-- exported it, so it most likely does not exist; if it does, none of its rows
-- can be used by the template's jti-keyed sessions. It is dropped and
-- recreated either way, which at worst signs everyone out once.
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `access_link` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`token` text NOT NULL,
	`label` text NOT NULL,
	`duration_hours` integer NOT NULL,
	`first_visited_at` text,
	`expires_at` text,
	`session_token` text,
	`revoked_at` text,
	`created_by` text,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS `access_link_token_idx` ON `access_link` (`token`);--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `auth_logs` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text,
	`event` text NOT NULL,
	`method` text,
	`ip_address` text,
	`user_agent` text,
	`metadata` text,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `credentials` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`credential_id` text NOT NULL,
	`public_key` text NOT NULL,
	`counter` integer NOT NULL,
	`device_name` text,
	`transports` text,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	`last_used_at` text,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS `credentials_credential_id_unique` ON `credentials` (`credential_id`);--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `users` (
	`id` text PRIMARY KEY NOT NULL,
	`username` text,
	`email` text,
	`display_name` text,
	`password_hash` text,
	`pin` text,
	`totp_secret` text,
	`totp_enabled` integer DEFAULT false,
	`is_active` integer DEFAULT true NOT NULL,
	`email_verified` integer DEFAULT false,
	`phone_number` text,
	`phone_verified` integer DEFAULT false,
	`failed_login_attempts` integer DEFAULT 0,
	`locked_until` text,
	`last_login_at` text,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS `users_username_unique` ON `users` (`username`);--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS `users_email_unique` ON `users` (`email`);--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `verification_codes` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text,
	`code` text NOT NULL,
	`type` text NOT NULL,
	`expires_at` text NOT NULL,
	`verified` integer DEFAULT false,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `blog_metadata` (
	`filename` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`read_time` integer NOT NULL,
	`subject` text NOT NULL,
	`user_id` text NOT NULL,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `github_repo_cache` (
	`id` text PRIMARY KEY NOT NULL,
	`owner` text NOT NULL,
	`repo` text NOT NULL,
	`data` text NOT NULL,
	`expires_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `role_permissions` (
	`id` text PRIMARY KEY NOT NULL,
	`role` text NOT NULL,
	`permission` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `user_permissions` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`permission` text NOT NULL,
	`granted` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`granted_by` text,
	`expires_at` integer,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`granted_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `user_roles` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`role` text NOT NULL,
	`assigned_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`assigned_by` text,
	`expires_at` integer,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`assigned_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
DROP TABLE IF EXISTS `sessions`;
--> statement-breakpoint
CREATE TABLE `sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`expires_at` text NOT NULL,
	`revoked_at` text,
	`revoked_reason` text,
	`last_seen_at` text DEFAULT (current_timestamp) NOT NULL,
	`ip_address` text,
	`user_agent` text,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `sessions_user_idx` ON `sessions` (`user_id`);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `sessions_expires_idx` ON `sessions` (`expires_at`);--> statement-breakpoint
-- Data step, from the template's 0002: emails are stored lowercased. Rows
-- whose lowercase form is already taken are left alone (two real accounts).
UPDATE users
SET email = lower(email)
WHERE email IS NOT NULL
  AND email <> lower(email)
  AND NOT EXISTS (
    SELECT 1 FROM users existing WHERE existing.email = lower(users.email)
  );

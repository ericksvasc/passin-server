ALTER TABLE "attendees" DROP CONSTRAINT "attendees_email_unique";--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "attendees_event_id_email_key" ON "attendees" USING btree ("event_id","email");
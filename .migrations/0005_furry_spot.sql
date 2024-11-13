ALTER TABLE "event_managers" RENAME COLUMN "id" TO "event_id";--> statement-breakpoint
ALTER TABLE "event_managers" DROP CONSTRAINT "event_managers_id_events_id_fk";
--> statement-breakpoint
ALTER TABLE "event_managers" DROP CONSTRAINT "event_managers_id_manager_id_pk";--> statement-breakpoint
ALTER TABLE "event_managers" ADD CONSTRAINT "event_managers_event_id_manager_id_pk" PRIMARY KEY("event_id","manager_id");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "event_managers" ADD CONSTRAINT "event_managers_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

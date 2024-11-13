DO $$ BEGIN
 CREATE TYPE "public"."user_role" AS ENUM('manager', 'attendee');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "attendees" (
	"id" integer NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"event_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "attendees_event_id_id_pk" PRIMARY KEY("event_id","id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "check_ins" (
	"id" serial NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"attendee_Id" integer NOT NULL,
	"event_id" text NOT NULL,
	CONSTRAINT "check_ins_event_id_attendee_Id_pk" PRIMARY KEY("event_id","attendee_Id"),
	CONSTRAINT "check_ins_attendee_Id_unique" UNIQUE("attendee_Id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "event_managers" (
	"id" text NOT NULL,
	"manager_id" text NOT NULL,
	CONSTRAINT "event_managers_id_manager_id_pk" PRIMARY KEY("id","manager_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "events" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"details" text,
	"slug" text NOT NULL,
	"maximum_attendees" integer,
	CONSTRAINT "events_id_unique" UNIQUE("id"),
	CONSTRAINT "events_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text NOT NULL,
	"role" "user_role" DEFAULT 'attendee',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "attendees" ADD CONSTRAINT "attendees_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "check_ins" ADD CONSTRAINT "check_ins_attendeeId_fkey" FOREIGN KEY ("event_id","attendee_Id") REFERENCES "public"."attendees"("event_id","id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "event_managers" ADD CONSTRAINT "event_managers_id_events_id_fk" FOREIGN KEY ("id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "event_managers" ADD CONSTRAINT "event_managers_manager_id_users_id_fk" FOREIGN KEY ("manager_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "attendees_event_id_email_key" ON "attendees" USING btree ("event_id","email");
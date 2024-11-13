ALTER TABLE "auth_links" RENAME COLUMN "user_id" TO "manager_id";--> statement-breakpoint
ALTER TABLE "auth_links" DROP CONSTRAINT "auth_links_user_id_managers_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "auth_links" ADD CONSTRAINT "auth_links_manager_id_managers_id_fk" FOREIGN KEY ("manager_id") REFERENCES "public"."managers"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
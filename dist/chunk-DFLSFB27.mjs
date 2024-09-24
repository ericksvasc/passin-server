import {
  __export
} from "./chunk-7P6ASYW6.mjs";

// src/db/schema.ts
var schema_exports = {};
__export(schema_exports, {
  attendees: () => attendees,
  checkIns: () => checkIns,
  events: () => events
});
import {
  foreignKey,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex
} from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";
var events = pgTable("events", {
  id: text("id").primaryKey().$defaultFn(() => createId()).unique(),
  title: text("title").notNull(),
  details: text("details"),
  slug: text("slug").notNull().unique(),
  maximumAttendees: integer("maximum_attendees")
});
var attendees = pgTable(
  "attendees",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    eventId: text("event_id").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow()
  },
  (attendees2) => ({
    eventFk: foreignKey({
      name: "attendees_event_id_fkey",
      columns: [attendees2.eventId],
      foreignColumns: [events.id]
    }).onDelete("restrict").onUpdate("cascade"),
    uniqueEventEmail: uniqueIndex("attendees_event_id_email_key").on(
      attendees2.eventId,
      attendees2.email
    )
  })
);
var checkIns = pgTable(
  "check_ins",
  {
    id: serial("id").primaryKey(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    attendeeId: integer("attendee_Id").unique().notNull()
  },
  (checkIns2) => ({
    eventFk: foreignKey({
      name: "check_ins_attendeeId_fkey",
      columns: [checkIns2.attendeeId],
      foreignColumns: [attendees.id]
    }).onDelete("restrict").onUpdate("cascade")
  })
);

export {
  events,
  attendees,
  checkIns,
  schema_exports
};

import {
  db
} from "./chunk-JAMCQIR4.mjs";
import {
  attendees,
  events
} from "./chunk-DFLSFB27.mjs";
import {
  BadRequest
} from "./chunk-273RVK7D.mjs";

// src/db/functions/get-event.ts
import { count, eq } from "drizzle-orm";
async function getEvent({ eventId }) {
  const event = await db.select({
    id: events.id,
    title: events.title,
    slug: events.slug,
    details: events.details,
    maximumAttendees: events.maximumAttendees,
    attendeesAmount: count(attendees.id).as("attendeesCount")
  }).from(events).leftJoin(attendees, eq(events.id, attendees.eventId)).groupBy(events.id).where(eq(events.id, eventId));
  if (event.length < 1) {
    throw new BadRequest("Event not found");
  }
  return event[0];
}

export {
  getEvent
};

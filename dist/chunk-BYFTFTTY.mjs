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

// src/db/functions/get-attendee-badge.ts
import { eq } from "drizzle-orm";
async function getAttendeeBadge({ attendeeId }) {
  const attendee = await db.select({
    name: attendees.name,
    email: attendees.email,
    event: {
      title: events.title
    }
  }).from(attendees).innerJoin(events, eq(attendees.eventId, events.id)).where(eq(attendees.id, attendeeId)).limit(1);
  if (attendee.length < 1) {
    throw new BadRequest("attendee not found");
  }
  return attendee[0];
}

export {
  getAttendeeBadge
};

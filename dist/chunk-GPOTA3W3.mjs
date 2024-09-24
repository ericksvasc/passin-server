import {
  db
} from "./chunk-JAMCQIR4.mjs";
import {
  attendees,
  checkIns
} from "./chunk-DFLSFB27.mjs";

// src/db/functions/getEventAteendee.ts
import { and, desc, eq, ilike } from "drizzle-orm";
async function getEventAteendee({
  eventId,
  pageIndex,
  name
}) {
  const ateendess = await db.select({
    id: attendees.id,
    name: attendees.name,
    email: attendees.email,
    createdAt: attendees.createdAt,
    checkInDate: checkIns.createdAt
  }).from(attendees).where(
    and(
      eq(attendees.eventId, eventId),
      name ? ilike(attendees.name, `%${name}%`) : void 0
    )
  ).leftJoin(checkIns, eq(attendees.id, checkIns.attendeeId)).orderBy(desc(attendees.createdAt)).limit(10).offset(pageIndex * 10);
  return ateendess;
}

export {
  getEventAteendee
};

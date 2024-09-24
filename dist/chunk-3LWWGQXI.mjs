import {
  db
} from "./chunk-JAMCQIR4.mjs";
import {
  checkIns
} from "./chunk-DFLSFB27.mjs";
import {
  BadRequest
} from "./chunk-273RVK7D.mjs";

// src/db/functions/check-in.ts
import { eq } from "drizzle-orm";
async function createCheckIn({ attendeeId }) {
  const attendeeCheckin = await db.select().from(checkIns).where(eq(checkIns.attendeeId, attendeeId)).limit(1);
  if (attendeeCheckin.length >= 1) {
    throw new BadRequest("Ateendee Already checked in!");
  }
  const createCheckInAteendee = await db.insert(checkIns).values({
    attendeeId
  }).returning();
  const checkIn = createCheckInAteendee[0];
  return checkIn;
}

export {
  createCheckIn
};

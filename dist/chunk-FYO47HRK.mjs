import {
  generateSlug
} from "./chunk-R4KWPQ2T.mjs";
import {
  db
} from "./chunk-JAMCQIR4.mjs";
import {
  events
} from "./chunk-DFLSFB27.mjs";
import {
  BadRequest
} from "./chunk-273RVK7D.mjs";

// src/db/functions/create-event.ts
import { eq } from "drizzle-orm";
async function createEvent({
  title,
  details,
  maximumAttendees
}) {
  const initialSlug = generateSlug(title);
  const slug = initialSlug;
  const slugExists = await db.select().from(events).where(eq(events.slug, slug)).limit(1);
  if (slugExists.length >= 1) {
    throw new BadRequest("Slug with this name already exists!");
  }
  const result = await db.insert(events).values({
    title,
    details,
    slug,
    maximumAttendees
  }).returning();
  const event = result[0];
  return {
    event
  };
}

export {
  createEvent
};

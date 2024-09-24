import {
  db
} from "../chunk-JAMCQIR4.mjs";
import "../chunk-7EYUGQRM.mjs";
import {
  events
} from "../chunk-DFLSFB27.mjs";
import "../chunk-7P6ASYW6.mjs";

// src/db/seed.ts
async function seed() {
  await db.insert(events).values({
    id: "hr0e68xev2zkbuh71mai0szz",
    title: "Unite Summit",
    details: "Um evento para apaixonados por c\xF3digos",
    slug: "unite-sumiit",
    maximumAttendees: 100
  }).returning();
}
seed().then(() => {
  console.log("database seeded!");
});

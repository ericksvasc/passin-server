import { and, count, desc, eq, ilike } from 'drizzle-orm'
import { db } from '..'
import { attendees, checkIns, events } from '../schema'
import { arrayContains } from 'drizzle-orm'

interface GetEventAteendee {
  eventId: string
  pageIndex: number
  name: string | null | undefined
}

export async function getEventAteendee({
  eventId,
  pageIndex,
  name,
}: GetEventAteendee) {
  const ateendess = await db
    .select({
      id: attendees.id,
      name: attendees.name,
      email: attendees.email,
      createdAt: attendees.createdAt,
      checkInDate: checkIns.createdAt,
    })
    .from(attendees)
    .where(
      and(
        eq(attendees.eventId, eventId),
        name ? ilike(attendees.name, `%${name}%`) : undefined
      )
    )
    .leftJoin(checkIns, eq(attendees.id, checkIns.attendeeId))
    .orderBy(desc(attendees.createdAt))
    .limit(10)
    .offset(pageIndex * 10)

  const total = await db
    .select({
      total: count(attendees.id),
    })
    .from(attendees)
    .where(
      and(
        eq(attendees.eventId, eventId),
        name ? ilike(attendees.name, `%${name}%`) : undefined
      )
    )
    .limit(1)

  return {
    ateendess: ateendess,
    total: total[0].total,
  }
}

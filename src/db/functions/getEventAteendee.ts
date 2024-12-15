import { and, count, desc, eq, ilike, or, sql } from 'drizzle-orm'
import { db } from '..'
import { attendees, checkIns, eventManagers, events } from '../schema'
import { arrayContains } from 'drizzle-orm'
import { UnauthorizedError } from '../../http/routes/_errors/bad.request'

interface GetEventAteendee {
  eventId: string
  managerId: string
  pageIndex: number
  attendeeName: string | null | undefined
}

export async function getEventAteendee({
  eventId,
  pageIndex,
  attendeeName,
  managerId,
}: GetEventAteendee) {
  const [managerIdAcessEvent] = await db
    .select()
    .from(eventManagers)
    .where(
      and(
        eq(eventManagers.eventId, eventId),
        eq(eventManagers.managerId, managerId)
      )
    )

  if (!managerIdAcessEvent) {
    throw new UnauthorizedError()
  }

  const ateendees = await db
    .select({
      id: attendees.id,
      name: attendees.name,
      email: attendees.email,
      createdAt: attendees.createdAt,
      checkInDate: checkIns.createdAt,
    })
    .from(attendees)
    .where(
      or(
        and(
          eq(eventManagers.managerId, managerId),
          eq(attendees.eventId, eventId),
          attendeeName ? ilike(attendees.name, `%${attendeeName}%`) : undefined
        ),
        and(
          eq(eventManagers.managerId, managerId),
          eq(attendees.eventId, eventId),
          attendeeName
            ? sql`CAST(${attendees.id} AS TEXT) LIKE ${`%${attendeeName}%`}`
            : undefined
        ),
        and(
          eq(eventManagers.managerId, managerId),
          eq(attendees.eventId, eventId),
          attendeeName ? ilike(attendees.email, `%${attendeeName}%`) : undefined
        )
      )
    )
    .leftJoin(
      checkIns,
      and(
        eq(attendees.id, checkIns.attendeeId),
        eq(attendees.eventId, checkIns.eventId)
      )
    )
    .innerJoin(eventManagers, eq(attendees.eventId, eventManagers.eventId))
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
        attendeeName ? ilike(attendees.name, `%${attendeeName}%`) : undefined
      )
    )
    .limit(1)

  const eventName = await db
    .select({
      eventName: events.title,
    })
    .from(events)
    .where(eq(events.id, eventId))
    .limit(1)

  return {
    ateendees,
    total: total[0].total,
    eventName: eventName[0].eventName,
  }
}

import { and, count, eq, inArray } from 'drizzle-orm'
import { db } from '..'
import { attendees, eventManagers, events } from '../schema'
import { UnauthorizedError } from '../../http/routes/_errors/bad.request'

interface GetEventsManaged {
  managerId: string
}

export async function getEventsManaged({ managerId }: GetEventsManaged) {
  const eventsIdFromManager = await db
    .select({
      eventId: eventManagers.eventId,
    })
    .from(eventManagers)
    .where(eq(eventManagers.managerId, managerId))

  if (!eventsIdFromManager) {
    throw new UnauthorizedError()
  }

  const eventIds = eventsIdFromManager.map(event => event.eventId)

  const eventsFromManageds = await db
    .select()
    .from(events)
    .where(inArray(events.id, eventIds))

  const eventsFromManaged = await db
    .select({
      id: events.id,
      title: events.title,
      details: events.details,
      slug: events.slug,
      maximumAttendees: events.maximumAttendees,
      attendeeCount: count(attendees.id),
    })
    .from(events)
    .leftJoin(attendees, eq(attendees.eventId, events.id))
    .innerJoin(
      eventManagers,
      and(
        eq(eventManagers.managerId, managerId),
        eq(eventManagers.eventId, events.id)
      )
    )
    .groupBy(events.id)

  return eventsFromManaged
}

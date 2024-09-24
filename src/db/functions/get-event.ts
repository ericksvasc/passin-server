import { count, eq } from 'drizzle-orm'
import { db } from '..'
import { attendees, events } from '../schema'
import { BadRequest } from '../../http/routes/_errors/bad.request'

interface GetEvent {
  eventId: string
}
export async function getEvent({ eventId }: GetEvent) {
  const event = await db
    .select({
      id: events.id,
      title: events.title,
      slug: events.slug,
      details: events.details,
      maximumAttendees: events.maximumAttendees,
      attendeesAmount: count(attendees.id).as('attendeesCount'),
    })
    .from(events)
    .leftJoin(attendees, eq(events.id, attendees.eventId))
    .groupBy(events.id)
    .where(eq(events.id, eventId))

  if (event.length < 1) {
    throw new BadRequest('Event not found')
  }

  return event[0]
}

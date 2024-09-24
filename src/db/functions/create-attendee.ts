import { and, count, eq } from 'drizzle-orm'
import { db } from '..'
import { attendees, events } from '../schema'
import { BadRequest } from '../../http/routes/_errors/bad.request'

interface CreateAttendees {
  name: string
  email: string
  eventId: string
}

export async function createAttendee({
  name,
  email,
  eventId,
}: CreateAttendees) {
  const attendeeFromEmail = await db
    .select({
      eventId: attendees.eventId,
    })
    .from(attendees)
    .where(and(eq(attendees.email, email), eq(attendees.eventId, eventId)))
    .limit(1)

  const attendeesForThisEvent = await db
    .select({
      maximumAttendees: events.maximumAttendees,
      attendeeCount: count(attendees.id).as('attendeeCount'),
    })
    .from(events)
    .leftJoin(attendees, eq(events.id, attendees.eventId))
    .where(eq(events.id, eventId))
    .groupBy(events.maximumAttendees)
    .limit(1)

  if (
    attendeesForThisEvent[0].maximumAttendees !== null &&
    attendeesForThisEvent[0].maximumAttendees <=
      attendeesForThisEvent[0].attendeeCount
  ) {
    throw new BadRequest(
      'There are no available spots for this event! The maximum number of attendees has been reached.'
    )
  }

  if (attendeeFromEmail.length > 0) {
    throw new BadRequest(
      'There is already an attendee with the same e-mail for this event!'
    )
  }

  const result = await db
    .insert(attendees)
    .values({
      name,
      email,
      eventId,
    })
    .returning()

  const attendee = result[0]
  // const attendee = attendeesForThisEvent

  return {
    attendee,
  }
}

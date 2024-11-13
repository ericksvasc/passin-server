import { and, count, desc, eq } from 'drizzle-orm'
import { db } from '..'
import { attendees, eventManagers, events } from '../schema'
import {
  BadRequest,
  UnauthorizedError,
} from '../../http/routes/_errors/bad.request'

interface CreateAttendees {
  name: string
  email: string
  slug: string
  managerId: string
}

export async function createAttendee({
  name,
  email,
  slug,
  managerId,
}: CreateAttendees) {
  const event = await db
    .select({
      eventId: events.id,
    })
    .from(events)
    .innerJoin(eventManagers, eq(eventManagers.eventId, events.id))
    .where(and(eq(events.slug, slug), eq(eventManagers.managerId, managerId)))
    .limit(1)

  if (event.length === 0) {
    throw new UnauthorizedError()
  }

  const [{ eventId }] = event

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

  const lastId = await db
    .select({
      lastId: attendees.id,
    })
    .from(attendees)
    .where(eq(attendees.eventId, eventId))
    .orderBy(desc(attendees.id))
    .limit(1)

  let id: number

  if (lastId.length === 0 || lastId[0].lastId === null) {
    id = 10000
  } else {
    id = lastId[0].lastId + 1
  }

  const result = await db
    .insert(attendees)
    .values({
      name,
      email,
      eventId,
      id,
    })
    .returning()

  const attendee = result[0]
  // const attendee = attendeesForThisEvent

  return {
    attendee,
  }
}

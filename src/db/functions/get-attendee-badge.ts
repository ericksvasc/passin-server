import { eq } from 'drizzle-orm'
import { attendees, events } from '../schema'
import { db } from '..'
import { BadRequest } from '../../http/routes/_errors/bad.request'

interface GetAttendeeBadge {
  attendeeId: number
}

export async function getAttendeeBadge({ attendeeId }: GetAttendeeBadge) {
  const attendee = await db
    .select({
      name: attendees.name,
      email: attendees.email,
      event: {
        title: events.title,
      },
    })
    .from(attendees)
    .innerJoin(events, eq(attendees.eventId, events.id))
    .where(eq(attendees.id, attendeeId))
    .limit(1)

  if (attendee.length < 1) {
    throw new BadRequest('attendee not found')
  }

  return attendee[0]
}

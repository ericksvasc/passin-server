import { and, arrayContains, eq, inArray } from 'drizzle-orm'
import { db } from '..'
import { checkIns, eventManagers, events } from '../schema'
import {
  BadRequest,
  UnauthorizedError,
} from '../../http/routes/_errors/bad.request'

interface CreateCeckin {
  attendeeIds: number[]
  slug: string
  managerId: string
}

export async function createCheckIn({
  attendeeIds,
  slug,
  managerId,
}: CreateCeckin) {
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

  const attendeeCheckin = await db
    .select()
    .from(checkIns)
    .where(
      and(
        inArray(checkIns.attendeeId, attendeeIds),
        eq(checkIns.eventId, eventId)
      )
    )
    .limit(1)

  if (attendeeCheckin.length >= 1) {
    throw new BadRequest('Ateendee Already checked in!')
  }

  const createCheckInAteendee = await db
    .insert(checkIns)
    .values(
      attendeeIds.map(id => ({
        attendeeId: id,
        eventId,
      }))
    )
    .returning()

  const checkIn = createCheckInAteendee[0]

  return checkIn
}

import { and, eq, inArray } from 'drizzle-orm'
import { db } from '..'
import { checkIns, eventManagers, events } from '../schema'
import { UnauthorizedError } from '../../http/routes/_errors/bad.request'

interface DeleteCheckin {
  attendeeIds: number[]
  slug: string
  managerId: string
}

export async function deleteCheckinAttendee({
  attendeeIds,
  slug,
  managerId,
}: DeleteCheckin) {
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

  await db
    .delete(checkIns)
    .where(
      and(
        eq(checkIns.eventId, eventId),
        inArray(checkIns.attendeeId, attendeeIds)
      )
    )
    .returning()
}

import { and, eq } from 'drizzle-orm'
import { db } from '..'
import { eventManagers, events } from '../schema'
import { UnauthorizedError } from '../../http/routes/_errors/bad.request'

interface GetEventsIdSlug {
  slug: string
  managerId: string
}

export async function getEventsIdSlug({ managerId, slug }: GetEventsIdSlug) {
  const eventId = await db
    .select({
      eventId: events.id,
    })
    .from(events)
    .innerJoin(eventManagers, eq(eventManagers.managerId, managerId))
    .where(and(eq(eventManagers.eventId, events.id), eq(events.slug, slug)))
    .limit(1)

  if (!eventId) {
    throw new UnauthorizedError()
  }

  return eventId
}

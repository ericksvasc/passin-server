import { and, eq } from 'drizzle-orm'
import { db } from '..'
import {
  BadRequest,
  UnauthorizedError,
} from '../../http/routes/_errors/bad.request'
import { attendees, eventManagers, events } from '../schema'

interface PatchAttendee {
  attendeeId: number
  name?: string | null
  email?: string | null
  managerId: string
  slug: string
}

export async function patchAttendee({
  attendeeId,
  name,
  email,
  managerId,
  slug,
}: PatchAttendee) {
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

  const updateData: Partial<{ name: string; email: string }> = {}

  if (name !== undefined && name !== null) {
    updateData.name = name
  }
  if (email !== undefined && email !== null) {
    updateData.email = email
  }

  if (Object.keys(updateData).length === 0) {
    throw new BadRequest('Nenhum dado para atualizar')
  }

  const result = await db
    .update(attendees)
    .set(updateData)
    .where(and(eq(attendees.eventId, eventId), eq(attendees.id, attendeeId)))
    .returning()

  return result[0]
}

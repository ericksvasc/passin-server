import { eq } from 'drizzle-orm'
import { db } from '..'
import { attendees, eventManagers, events } from '../schema'
import { generateSlug } from './create-slug'
import { BadRequest } from '../../http/routes/_errors/bad.request'

interface CreateEvent {
  title: string
  details?: string
  maximumAttendees?: number
  managerId: string
}

export async function createEvent({
  title,
  details,
  maximumAttendees,
  managerId,
}: CreateEvent) {
  const slug = generateSlug(title)
  // const slug = initialSlug

  const slugExists = await db
    .select()
    .from(events)
    .where(eq(events.slug, slug))
    .limit(1)

  if (slugExists.length >= 1) {
    throw new BadRequest('Slug with this name already exists!')
  }

  const [result] = await db
    .insert(events)
    .values({
      title,
      details,
      slug,
      maximumAttendees,
    })
    .returning()

  await db.insert(eventManagers).values({
    eventId: result.id,
    managerId,
  })

  const event = result

  return {
    event,
  }
}

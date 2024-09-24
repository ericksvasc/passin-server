import { eq } from 'drizzle-orm'
import { db } from '..'
import { attendees, events } from '../schema'
import { generateSlug } from './create-slug'
import { BadRequest } from '../../http/routes/_errors/bad.request'

interface CreateEvent {
  title: string
  details?: string
  maximumAttendees?: number
}

export async function createEvent({
  title,
  details,
  maximumAttendees,
}: CreateEvent) {
  const initialSlug = generateSlug(title)
  const slug = initialSlug

  const slugExists = await db
    .select()
    .from(events)
    .where(eq(events.slug, slug))
    .limit(1)

  if (slugExists.length >= 1) {
    throw new BadRequest('Slug with this name already exists!')
  }

  const result = await db
    .insert(events)
    .values({
      title,
      details,
      slug,
      maximumAttendees,
    })
    .returning()

  const event = result[0]

  return {
    event,
  }
}

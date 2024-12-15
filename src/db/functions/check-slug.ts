import { eq } from 'drizzle-orm'
import { db } from '..'
import { events } from '../schema'

interface CheckSlug {
  slug: string
}

export async function checkSlug({ slug }: CheckSlug) {
  const [result] = await db
    .select({
      slug: events.slug,
    })
    .from(events)
    .where(eq(events.slug, slug))

  if (result) {
    return {
      isAvailable: false,
    }
  }

  return {
    isAvailable: true,
  }
}

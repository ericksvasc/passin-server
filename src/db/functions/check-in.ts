import { eq } from 'drizzle-orm'
import { db } from '..'
import { checkIns } from '../schema'
import { BadRequest } from '../../http/routes/_errors/bad.request'

interface CreateCeckin {
  attendeeId: number
}

export async function createCheckIn({ attendeeId }: CreateCeckin) {
  const attendeeCheckin = await db
    .select()
    .from(checkIns)
    .where(eq(checkIns.attendeeId, attendeeId))
    .limit(1)

  if (attendeeCheckin.length >= 1) {
    throw new BadRequest('Ateendee Already checked in!')
  }

  const createCheckInAteendee = await db
    .insert(checkIns)
    .values({
      attendeeId,
    })
    .returning()

  const checkIn = createCheckInAteendee[0]

  return checkIn
}

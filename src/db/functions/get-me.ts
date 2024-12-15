import { eq } from 'drizzle-orm'
import { db } from '..'
import { managers } from '../schema'

interface GetMe {
  managerId: string
}

export async function getMe({ managerId }: GetMe) {
  const [result] = await db
    .select()
    .from(managers)
    .where(eq(managers.id, managerId))
    .limit(1)

  return result
}

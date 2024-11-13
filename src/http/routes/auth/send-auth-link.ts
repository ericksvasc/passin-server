import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { db } from '../../../db'
import { authLinks, managers } from '../../../db/schema'
import { eq } from 'drizzle-orm'
import { createId } from '@paralleldrive/cuid2'
import { env } from '../../../env'
import { BadRequest } from '../_errors/bad.request'

export const sendAuthLink: FastifyPluginAsyncZod = async app => {
  app.post(
    '/api/authenticate',
    {
      schema: {
        body: z.object({
          email: z.string().email(),
        }),
      },
    },
    async request => {
      const { email } = request.body

      const [userFromEmail] = await db
        .select()
        .from(managers)
        .where(eq(managers.email, email))
        .limit(1)

      if (!userFromEmail) {
        throw new BadRequest('User not found.')
      }

      const authLinkCode = await createId()

      await db.insert(authLinks).values({
        code: authLinkCode,
        managerId: userFromEmail.id,
      })

      const authLink = new URL('/api/auth-links/authenticate', env.API_BASE_URL)
      authLink.searchParams.set('code', authLinkCode)
      authLink.searchParams.set('redirect', env.AUTH_REDIRECT_URL)

      console.log(authLink.toString())
    }
  )
}

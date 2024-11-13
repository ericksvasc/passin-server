import type { FastifyPluginAsync } from 'fastify'
import fp from 'fastify-plugin'
import { z } from 'zod'
import { db } from '../../../db'
import { authLinks } from '../../../db/schema'
import { eq } from 'drizzle-orm'
import dayjs from 'dayjs'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'

const authenticateFromLinkPlugin: FastifyPluginAsyncZod = async app => {
  app.get(
    '/api/auth-links/authenticate',
    {
      schema: {
        querystring: z.object({
          code: z.string(),
          redirect: z.string().url(),
        }),
      },
    },
    async (request, reply) => {
      const { code, redirect: redirectURL } = request.query

      const [authLinkFromCode] = await db
        .select()
        .from(authLinks)
        .where(eq(authLinks.code, code))
        .limit(1)

      if (!authLinkFromCode) {
        return reply.status(400).send({
          error: 'Invalid authentication code',
        })
      }

      const daysSinceAuthLinkWasCreated = dayjs().diff(
        authLinkFromCode.createdAt,
        'days'
      )

      if (daysSinceAuthLinkWasCreated > 7) {
        return reply.status(400).send({
          error: 'Auth link expired, please generate a new one',
        })
      }

      // Sign the user
      await app.signUser(reply, {
        sub: authLinkFromCode.managerId,
      })

      // Clean up the used auth link
      await db.delete(authLinks).where(eq(authLinks.code, code))

      // Redirect only after everything else succeeded
      return reply.redirect(redirectURL, 301)
    }
  )
}

export const authenticateFromLink = fp(authenticateFromLinkPlugin, {
  name: 'authenticate-from-link',
  dependencies: ['auth-plugin'],
})

import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { getAttendeeBadge } from '../../db/functions/get-attendee-badge'
import { patchAttendee } from '../../db/functions/patch-attendee'
import fp from 'fastify-plugin'
import { UnauthorizedError } from './_errors/bad.request'

export const patchAttendeeBadgeRoutePlugin: FastifyPluginAsyncZod =
  async app => {
    app.patch(
      '/attendees/:slug/:attendeeId',
      {
        schema: {
          summary: 'Patch a ateendee badge',
          tags: ['Ateendees'],
          params: z.object({
            attendeeId: z.coerce.number().int(),
            slug: z.string(),
          }),
          body: z.object({
            name: z.string().min(2).nullish(),
            email: z.string().email().nullish(),
          }),
          response: {
            201: z.object({
              data: z.string(),
            }),
          },
        },
      },
      async (request, reply) => {
        const { attendeeId, slug } = request.params
        const { name, email } = request.body

        const { managerId } = await app.getCurrentUser(request)

        if (!managerId) {
          throw new UnauthorizedError()
        }

        await patchAttendee({
          managerId,
          attendeeId,
          name,
          email,
          slug,
        })

        return reply.status(201).send({
          data: 'Dados alterados com sucesso',
        })
      }
    )
  }

export const patchAttendeeBadgeRoute = fp(patchAttendeeBadgeRoutePlugin, {
  name: 'patch-event-ateendee-route',
  dependencies: ['auth-plugin'],
})

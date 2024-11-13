import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { createCheckIn } from '../../db/functions/check-in'
import { UnauthorizedError } from './_errors/bad.request'

export const checkInRoute: FastifyPluginAsyncZod = async app => {
  app.get(
    '/attendees/:slug/:attendeeId/check-in',
    {
      schema: {
        summary: 'Check-in an ateendeee',
        tags: ['Check-ins'],
        params: z.object({
          attendeeId: z.coerce.number().min(1).int(),
          slug: z.string(),
        }),
        response: {
          201: z.null(),
        },
      },
    },
    async (request, reply) => {
      const { attendeeId, slug } = request.params

      const { managerId } = await app.getCurrentUser(request)

      if (!managerId) {
        throw new UnauthorizedError()
      }

      await createCheckIn({
        attendeeId,
        slug,
        managerId,
      })

      return reply.status(201).send()
    }
  )
}

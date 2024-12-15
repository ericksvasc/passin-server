import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { createCheckIn } from '../../db/functions/check-in'
import { UnauthorizedError } from './_errors/bad.request'

export const checkInRoute: FastifyPluginAsyncZod = async app => {
  app.post(
    '/attendees/:slug/check-in',
    {
      schema: {
        summary: 'Check-in an ateendeee',
        tags: ['Check-ins'],
        params: z.object({
          slug: z.string(),
        }),
        body: z.object({
          attendeeIds: z.array(z.number().min(1).int()),
        }),
        response: {
          201: z.null(),
        },
      },
    },
    async (request, reply) => {
      const { slug } = request.params
      const { attendeeIds } = request.body

      const { managerId } = await app.getCurrentUser(request)

      if (!managerId) {
        throw new UnauthorizedError()
      }

      await createCheckIn({
        attendeeIds,
        slug,
        managerId,
      })

      return reply.status(201).send()
    }
  )
}

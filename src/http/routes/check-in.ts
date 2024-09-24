import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { createCheckIn } from '../../db/functions/check-in'

export const checkInRoute: FastifyPluginAsyncZod = async app => {
  app.get(
    '/attendees/:attendeeId/check-in',
    {
      schema: {
        summary: 'Check-in an ateendeee',
        tags: ['Check-ins'],
        params: z.object({
          attendeeId: z.coerce.number().min(1).int(),
        }),
        response: {
          201: z.null(),
        },
      },
    },
    async (request, reply) => {
      const { attendeeId } = request.params

      const result = await createCheckIn({
        attendeeId,
      })

      return reply.status(201).send()
    }
  )
}

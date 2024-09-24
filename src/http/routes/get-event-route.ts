import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'

import z from 'zod'
import { getEvent } from '../../db/functions/get-event'

export const getEventRoute: FastifyPluginAsyncZod = async app => {
  app.get(
    '/events/:eventId',
    {
      schema: {
        summary: 'Get an event',
        tags: ['Events'],
        params: z.object({
          eventId: z.string().cuid2(),
        }),
        response: {
          200: z.object({
            event: z.object({
              id: z.string().cuid2(),
              title: z.string(),
              slug: z.string(),
              details: z.string().nullable(),
              maximumAttendees: z.number().int().min(1).nullable(),
              attendeesAmount: z.number().int().optional(),
            }),
          }),
        },
      },
    },
    async (request, reply) => {
      const { eventId } = request.params

      const event = await getEvent({
        eventId,
      })

      return reply.send({ event })
    }
  )
}

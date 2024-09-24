import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z, { string } from 'zod'
import { createEvent } from '../../db/functions/create-event'

export const createEventRoute: FastifyPluginAsyncZod = async app => {
  app.post(
    '/events',
    {
      schema: {
        summary: 'Create an event',
        tags: ['Events'],
        body: z.object({
          title: z.string(),
          details: z.string().optional(),
          maximumAttendees: z.number().int().positive().min(1).optional(),
        }),
        response: {
          201: z.object({
            eventId: z.string().cuid2(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { title, details, maximumAttendees } = request.body

      const result = await createEvent({
        title,
        details,
        maximumAttendees,
      })

      return reply.status(201).send({ eventId: result.event.id })
    }
  )
}

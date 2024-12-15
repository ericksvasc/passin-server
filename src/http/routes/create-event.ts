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
            title: z.string(),
            details: z.string().nullish(),
            maximumAttendees: z.number().nullable(),
            id: z.string().cuid2(),
            slug: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { title, details, maximumAttendees } = request.body
      const { managerId } = await app.getCurrentUser(request)

      const result = await createEvent({
        title,
        details,
        maximumAttendees,
        managerId,
      })

      return reply.status(201).send(result.event)
    }
  )
}

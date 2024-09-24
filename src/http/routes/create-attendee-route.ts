import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { createAttendee } from '../../db/functions/create-attendee'

export const createAttendeeRoute: FastifyPluginAsyncZod = async app => {
  app.post(
    '/events/:eventId/attendees',
    {
      schema: {
        summary: 'Register an ateendee',
        tags: ['Ateendees'],
        body: z.object({
          name: z.string(),
          email: z.string().email(),
        }),
        params: z.object({
          eventId: z.string().cuid2(),
        }),
        response: {
          201: z.object({
            ateendeeId: z.number().min(1),
            name: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { name, email } = request.body
      const { eventId } = request.params

      const result = await createAttendee({
        name,
        email,
        eventId,
      })

      return reply
        .status(201)
        .send({ name: result.attendee.name, ateendeeId: result.attendee.id })
    }
  )
}

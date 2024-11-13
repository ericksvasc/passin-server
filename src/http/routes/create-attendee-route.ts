import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { createAttendee } from '../../db/functions/create-attendee'
import { UnauthorizedError } from './_errors/bad.request'

export const createAttendeeRoute: FastifyPluginAsyncZod = async app => {
  app.post(
    '/events/:slug/attendees',
    {
      schema: {
        summary: 'Register an ateendee',
        tags: ['Ateendees'],
        body: z.object({
          name: z.string(),
          email: z.string().email(),
        }),
        params: z.object({
          slug: z.string(),
        }),
        response: {
          201: z.object({
            ateendeeId: z.number().min(1),
            name: z.string(),
            email: z.string().email(),
            createdAt: z.date(),
            eventId: z.string().cuid2(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { name, email } = request.body
      const { slug } = request.params

      const { managerId } = await app.getCurrentUser(request)

      if (!managerId) {
        throw new UnauthorizedError()
      }

      const result = await createAttendee({
        name,
        email,
        slug,
        managerId,
      })

      return reply
        .status(201)
        .send({
          name: result.attendee.name,
          ateendeeId: result.attendee.id,
          email: result.attendee.email,
          eventId: result.attendee.eventId,
          createdAt: result.attendee.createdAt,
        })
    }
  )
}

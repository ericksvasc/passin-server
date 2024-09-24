import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'

import z from 'zod'
import { getEventAteendee } from '../../db/functions/getEventAteendee'

export const getEventAteendeeRoute: FastifyPluginAsyncZod = async app => {
  app.get(
    '/events/:eventId/ateendees',
    {
      schema: {
        summary: 'Get event ateendees',
        tags: ['Events'],
        params: z.object({
          eventId: z.string().cuid2(),
        }),
        querystring: z.object({
          name: z.string().nullish(),
          pageIndex: z.string().default('0').transform(Number),
        }),
        // response: {
        //   200: z.object({
        //     ateendees: z.array(
        //       z.object({
        //         id: z.number(),
        //         name: z.string(),
        //         email: z.string(),
        //         createdAt: z.date(),
        //         checkInDate: z.date().nullable(),
        //       })
        //     ),
        //   }),
        // },
      },
    },
    async (request, reply) => {
      const { eventId } = request.params
      const { pageIndex, name } = request.query

      const { ateendess, total } = await getEventAteendee({
        eventId,
        pageIndex,
        name,
      })

      return reply.status(200).send({
        ateendess,
        total,
      })
    }
  )
}

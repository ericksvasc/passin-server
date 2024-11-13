import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'

import z from 'zod'
import { getEventAteendee } from '../../db/functions/getEventAteendee'

import fp from 'fastify-plugin'
import { BadRequest, UnauthorizedError } from './_errors/bad.request'
import { getEventsIdSlug } from '../../db/functions/get-event-id-slug'

const getEventAteendeeRoutePlugin: FastifyPluginAsyncZod = async app => {
  app.get(
    '/events/:slug/ateendees',
    {
      schema: {
        summary: 'Get event ateendees',
        tags: ['Events'],
        params: z.object({
          slug: z.string(),
        }),
        querystring: z.object({
          attendeeName: z.string().nullish(),
          pageIndex: z.string().default('0').transform(Number),
        }),
        response: {
          // 200: z.object({
          //   ateendees: z.array(
          //     z.object({
          //       id: z.number(),
          //       name: z.string(),
          //       email: z.string(),
          //       createdAt: z.date(),
          //       checkInDate: z.date().nullable(),
          //     })
          //   ),
          //   total: z.number(),
          //   eventName: z.string(),
          // }),
        },
      },
    },
    async (request, reply) => {
      const { slug } = request.params
      const { pageIndex, attendeeName } = request.query

      const { managerId } = await app.getCurrentUser(request)

      if (!managerId) {
        throw new UnauthorizedError()
      }

      const [{ eventId }] = await getEventsIdSlug({ managerId, slug })

      const { ateendees, total, eventName } = await getEventAteendee({
        managerId,
        eventId,
        pageIndex,
        attendeeName,
      })

      return reply.status(200).send({
        ateendees,
        total,
        eventName,
      })
    }
  )
}

export const getEventAteendeeRoute = fp(getEventAteendeeRoutePlugin, {
  name: 'get-event-ateendee-route',
  dependencies: ['auth-plugin'],
})

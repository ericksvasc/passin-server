import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { getEventsManaged } from '../../db/functions/get-events-managed'

export const getEventsFromManaged: FastifyPluginAsyncZod = async app => {
  app.get('/events', async (request, reply) => {
    const { managerId } = await app.getCurrentUser(request)

    const result = await getEventsManaged({
      managerId,
    })

    reply.send(result).status(200)
  })
}

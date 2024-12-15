import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import fp from 'fastify-plugin'
import { getMe } from '../../db/functions/get-me'

export const getMeRoutePlugin: FastifyPluginAsyncZod = async app => {
  app.get('/api/me', async (request, reply) => {
    const { managerId } = await app.getCurrentUser(request)

    const result = await getMe({ managerId })

    reply.send(result).status(200)
  })
}

export const getMeRoute = fp(getMeRoutePlugin, {
  name: 'get-me-route',
  dependencies: ['auth-plugin'],
})

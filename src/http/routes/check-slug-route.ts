import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { checkSlug } from '../../db/functions/check-slug'
import { BadRequest } from './_errors/bad.request'

export const checkSlugRoute: FastifyPluginAsyncZod = async app => {
  app.get(
    '/checkslug/:slug',
    {
      schema: {
        params: z.object({
          slug: z.string(),
        }),
        // response: z.object({
        //   isAvailable: z.boolean(),
        // }),
      },
    },
    async (request, reply) => {
      const { slug } = request.params
      const result = await checkSlug({ slug })

      if (result.isAvailable === false) {
        throw new BadRequest('unavailable-slug')
      }

      return reply.status(200).send(result)
    }
  )
}

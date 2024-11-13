import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { deleteCheckinAttendee } from '../../db/functions/delete-checkin'

export const deleteCheckinRoute: FastifyPluginAsyncZod = async app => {
  app.delete(
    '/attendees/:slug/:attendeeId/check-in',
    {
      schema: {
        params: z.object({
          attendeeId: z.coerce.number().int(),
          slug: z.string(),
        }),
      },
    },
    async (request, reply) => {
      const { attendeeId, slug } = request.params

      const { managerId } = await app.getCurrentUser(request)

      await deleteCheckinAttendee({
        attendeeId,
        managerId,
        slug,
      })

      reply.status(204).send()
    }
  )
}

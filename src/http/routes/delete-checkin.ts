import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { deleteCheckinAttendee } from '../../db/functions/delete-checkin'

export const deleteCheckinRoute: FastifyPluginAsyncZod = async app => {
  app.post(
    '/attendees/:slug/check-in/delete',
    {
      schema: {
        params: z.object({
          slug: z.string(),
        }),
        body: z.object({
          attendeeIds: z.array(z.number().min(1).int()),
        }),
      },
    },
    async (request, reply) => {
      const { slug } = request.params
      const { attendeeIds } = request.body

      const { managerId } = await app.getCurrentUser(request)

      await deleteCheckinAttendee({
        attendeeIds,
        managerId,
        slug,
      })

      reply.status(204).send()
    }
  )
}

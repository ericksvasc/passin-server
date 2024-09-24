import {
  getEvent
} from "./chunk-3EUQZNAS.mjs";

// src/http/routes/get-event-route.ts
import z from "zod";
var getEventRoute = async (app) => {
  app.get(
    "/events/:eventId",
    {
      schema: {
        summary: "Get an event",
        tags: ["Events"],
        params: z.object({
          eventId: z.string().cuid2()
        }),
        response: {
          200: z.object({
            event: z.object({
              id: z.string().cuid2(),
              title: z.string(),
              slug: z.string(),
              details: z.string().nullable(),
              maximumAttendees: z.number().int().min(1).nullable(),
              attendeesAmount: z.number().int().optional()
            })
          })
        }
      }
    },
    async (request, reply) => {
      const { eventId } = request.params;
      const event = await getEvent({
        eventId
      });
      return reply.send({ event });
    }
  );
};

export {
  getEventRoute
};

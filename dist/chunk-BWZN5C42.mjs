import {
  getEventAteendee
} from "./chunk-GPOTA3W3.mjs";

// src/http/routes/get-event-ateendee.ts
import z from "zod";
var getEventAteendeeRoute = async (app) => {
  app.get(
    "/events/:eventId/ateendees",
    {
      schema: {
        summary: "Get event ateendees",
        tags: ["Events"],
        params: z.object({
          eventId: z.string().cuid2()
        }),
        querystring: z.object({
          name: z.string().nullish(),
          pageIndex: z.string().default("0").transform(Number)
        }),
        response: {
          200: z.object({
            ateendees: z.array(
              z.object({
                id: z.number(),
                name: z.string(),
                email: z.string(),
                createdAt: z.date(),
                checkInDate: z.date().nullable()
              })
            )
          })
        }
      }
    },
    async (request, reply) => {
      const { eventId } = request.params;
      const { pageIndex, name } = request.query;
      const ateendees = await getEventAteendee({
        eventId,
        pageIndex,
        name
      });
      return reply.status(200).send({ ateendees });
    }
  );
};

export {
  getEventAteendeeRoute
};

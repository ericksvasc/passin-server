import {
  createEvent
} from "./chunk-FYO47HRK.mjs";

// src/http/routes/create-event.ts
import z from "zod";
var createEventRoute = async (app) => {
  app.post(
    "/events",
    {
      schema: {
        summary: "Create an event",
        tags: ["Events"],
        body: z.object({
          title: z.string(),
          details: z.string().optional(),
          maximumAttendees: z.number().int().positive().min(1).optional()
        }),
        response: {
          201: z.object({
            eventId: z.string().cuid2()
          })
        }
      }
    },
    async (request, reply) => {
      const { title, details, maximumAttendees } = request.body;
      const result = await createEvent({
        title,
        details,
        maximumAttendees
      });
      return reply.status(201).send({ eventId: result.event.id });
    }
  );
};

export {
  createEventRoute
};

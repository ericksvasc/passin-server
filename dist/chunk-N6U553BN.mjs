import {
  createCheckIn
} from "./chunk-3LWWGQXI.mjs";

// src/http/routes/check-in.ts
import z from "zod";
var checkInRoute = async (app) => {
  app.get(
    "/attendees/:attendeeId/check-in",
    {
      schema: {
        summary: "Check-in an ateendeee",
        tags: ["Check-ins"],
        params: z.object({
          attendeeId: z.coerce.number().min(1).int()
        }),
        response: {
          201: z.null()
        }
      }
    },
    async (request, reply) => {
      const { attendeeId } = request.params;
      const result = await createCheckIn({
        attendeeId
      });
      return reply.status(201).send();
    }
  );
};

export {
  checkInRoute
};

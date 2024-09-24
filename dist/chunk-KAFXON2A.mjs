import {
  getAttendeeBadge
} from "./chunk-BYFTFTTY.mjs";

// src/http/routes/get-attendee-badge-route.ts
import z from "zod";
var getAttendeeBadgeRoute = async (app) => {
  app.get(
    "/attendees/:attendeeId/badge",
    {
      schema: {
        summary: "Get an ateendee badge",
        tags: ["Ateendees"],
        params: z.object({
          attendeeId: z.coerce.number().int()
        }),
        response: {
          200: z.object({
            badge: z.object({
              name: z.string(),
              email: z.string().email(),
              eventTitle: z.string(),
              checkInUrl: z.string().url()
            })
          })
        }
      }
    },
    async (request, reply) => {
      const { attendeeId } = request.params;
      const attendee = await getAttendeeBadge({
        attendeeId
      });
      const baseUrl = `${request.protocol}://${request.hostname}`;
      const checkInUrl = new URL(`/attendees/${attendeeId}/check-in`, baseUrl);
      return reply.send({
        badge: {
          name: attendee.name,
          email: attendee.email,
          eventTitle: attendee.event.title,
          checkInUrl: checkInUrl.toString()
        }
      });
    }
  );
};

export {
  getAttendeeBadgeRoute
};

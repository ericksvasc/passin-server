import {
  getAttendeeBadgeRoute
} from "../chunk-KAFXON2A.mjs";
import {
  getEventAteendeeRoute
} from "../chunk-BWZN5C42.mjs";
import {
  getEventRoute
} from "../chunk-PRYJW6BB.mjs";
import "../chunk-BYFTFTTY.mjs";
import "../chunk-3EUQZNAS.mjs";
import "../chunk-GPOTA3W3.mjs";
import {
  checkInRoute
} from "../chunk-N6U553BN.mjs";
import {
  createAttendeeRoute
} from "../chunk-LUYKNCBQ.mjs";
import {
  createEventRoute
} from "../chunk-73OBPTKS.mjs";
import "../chunk-FYO47HRK.mjs";
import "../chunk-R4KWPQ2T.mjs";
import {
  errorHandle
} from "../chunk-X36RM2Q5.mjs";
import "../chunk-3LWWGQXI.mjs";
import "../chunk-R2HENZ2Y.mjs";
import "../chunk-JAMCQIR4.mjs";
import "../chunk-7EYUGQRM.mjs";
import "../chunk-DFLSFB27.mjs";
import "../chunk-273RVK7D.mjs";
import "../chunk-7P6ASYW6.mjs";

// src/http/server.ts
import fastifyCors from "@fastify/cors";
import fastify from "fastify";
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler
} from "fastify-type-provider-zod";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
var app = fastify().withTypeProvider();
app.register(fastifySwagger, {
  swagger: {
    consumes: ["application/json"],
    produces: ["application/json"],
    info: {
      title: "Pass.in",
      description: "Especifica\xE7\xF5es da API para o back-end da aplica\xE7\xE3o pass.in",
      version: "1.0.0"
    }
  },
  transform: jsonSchemaTransform
});
app.register(fastifySwaggerUi, {
  routePrefix: "/docs"
});
app.register(fastifyCors, {
  origin: "*"
});
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);
app.register(createEventRoute);
app.register(createAttendeeRoute);
app.register(getEventRoute);
app.register(getAttendeeBadgeRoute);
app.register(checkInRoute);
app.register(getEventAteendeeRoute);
app.setErrorHandler(errorHandle);
app.listen({
  port: 5273,
  host: "0.0.0.0"
}).then(() => {
  console.log("http server running");
});

import {
  BadRequest
} from "./chunk-273RVK7D.mjs";

// src/http/errot-handler.ts
import { ZodError } from "zod";
var errorHandle = (error, request, reply) => {
  const { validation, validationContext } = error;
  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: "Error during validation",
      errors: error.flatten().fieldErrors
    });
  }
  if (error instanceof BadRequest) {
    return reply.status(400).send({ message: error.message });
  }
  return reply.status(500).send({ message: "Internal server error" });
};

export {
  errorHandle
};

// src/env.ts
import z from "zod";
var envSchema = z.object({
  DATABASE_URL: z.string().url()
});
var env = envSchema.parse(process.env);

export {
  env
};

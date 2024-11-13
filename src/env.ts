import z from 'zod'

import dotenv from 'dotenv'

dotenv.config()

const envSchema = z.object({
  DATABASE_URL: z.string().url().min(1),
  API_BASE_URL: z.string().url().min(1),
  AUTH_REDIRECT_URL: z.string().url().min(1),
  JWT_SECRET_KEY: z.string(),
  API_KEY_RESEND: z.string(),
})

export const env = envSchema.parse(process.env)

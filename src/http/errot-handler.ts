import type { FastifyInstance, FastifyServerFactoryHandler } from 'fastify'
import { BadRequest, UnauthorizedError } from './routes/_errors/bad.request'
import { ZodError } from 'zod'

type FastifyErrorHandle = FastifyInstance['errorHandler']

export const errorHandle: FastifyErrorHandle = (error, request, reply) => {
  const { validation, validationContext } = error

  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: 'Error during validation',
      errors: error.flatten().fieldErrors,
    })
  }

  if (error instanceof BadRequest) {
    return reply.status(400).send({ message: error.message })
  }

  if (error instanceof UnauthorizedError) {
    return reply.status(401).send({ code: error.code, message: 'UNAUTHORIZED' })
  }

  return reply.status(500).send({ message: 'Internal server error' })
}

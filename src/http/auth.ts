import fastifyCookie from '@fastify/cookie'
import fastifyJwt from '@fastify/jwt'
import fp from 'fastify-plugin'
import { env } from '../env'
import type { FastifyReply, FastifyRequest } from 'fastify'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { UnauthorizedError } from './routes/_errors/bad.request'

declare module 'fastify' {
  interface FastifyInstance {
    signUser: (reply: FastifyReply, payload: { sub: string }) => Promise<void>
    signOut: (reply: FastifyReply) => void
    getCurrentUser: (request: FastifyRequest) => Promise<{ managerId: string }>
  }
}

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: { sub: string }
  }
}

const authPlugin: FastifyPluginAsyncZod = async app => {
  await app.register(fastifyCookie)
  await app.register(fastifyJwt, {
    secret: env.JWT_SECRET_KEY,
    cookie: {
      cookieName: 'auth',
      signed: false,
    },
  })

  app.decorate(
    'signUser',
    async (reply: FastifyReply, payload: { sub: string }) => {
      const token = await reply.jwtSign(payload)

      reply.setCookie('auth', token, {
        path: '/',
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 7, // 7 days
      })
    }
  )

  app.decorate('signOut', (reply: FastifyReply) => {
    reply.clearCookie('auth', { path: '/' })
  })

  app.decorate('getCurrentUser', async (request: FastifyRequest) => {
    const authCookie = request.cookies.auth

    if (!authCookie) {
      throw new UnauthorizedError()
    }

    const payload = await request.jwtVerify<{ sub: string }>()

    return {
      managerId: payload.sub,
    }
  })
}

export const auth = fp(authPlugin, {
  name: 'auth-plugin',
})

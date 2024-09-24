import fastifyCors from '@fastify/cors'
import fastify from 'fastify'
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from 'fastify-type-provider-zod'
import { createEventRoute } from './routes/create-event'
import { createAttendeeRoute } from './routes/create-attendee-route'
import { getEventRoute } from './routes/get-event-route'
import { getAttendeeBadgeRoute } from './routes/get-attendee-badge-route'
import { checkInRoute } from './routes/check-in'
import { getEventAteendeeRoute } from './routes/get-event-ateendee'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'
import { errorHandle } from './errot-handler'

const app = fastify().withTypeProvider<ZodTypeProvider>()
app.register(fastifySwagger, {
  swagger: {
    consumes: ['application/json'],
    produces: ['application/json'],
    info: {
      title: 'Pass.in',
      description: 'Especificações da API para o back-end da aplicação pass.in',
      version: '1.0.0',
    },
  },
  transform: jsonSchemaTransform,
})
app.register(fastifySwaggerUi, {
  routePrefix: '/docs',
})

app.register(fastifyCors, {
  origin: '*',
})

// Add schema validator and serializer
app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(createEventRoute)
app.register(createAttendeeRoute)
app.register(getEventRoute)
app.register(getAttendeeBadgeRoute)
app.register(checkInRoute)
app.register(getEventAteendeeRoute)
app.setErrorHandler(errorHandle)

app
  .listen({
    port: 5273,
    host: '0.0.0.0',
  })
  .then(() => {
    console.log('http server running')
  })

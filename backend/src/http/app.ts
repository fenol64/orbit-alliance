import '@opentelemetry/auto-instrumentations-node/register'

import { fastify } from 'fastify'

import { fastifyCors } from '@fastify/cors'

import fastifySwagger from '@fastify/swagger'

import ScalarApiReference from '@scalar/fastify-api-reference'

import {
  type ZodTypeProvider,
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod'

export const app = fastify({
  logger: {
    level: 'info',
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname',
      },
    },
  },
}).withTypeProvider<ZodTypeProvider>()

app.setSerializerCompiler(serializerCompiler)
app.setValidatorCompiler(validatorCompiler)

await app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'Orbit Alliance',
      version: '1.0.0',
    },
  },
  transform: jsonSchemaTransform,
})

await app.register(ScalarApiReference, {
  routePrefix: '/docs',
  configuration: {
    theme: 'kepler',
  },
})

app.register(fastifyCors, { origin: '*' })

// Registrar rotas
import { institutionRoutes } from '../routes/institution.routes.js'
import { userRoutes } from '../routes/user.routes.js'
await app.register(institutionRoutes)
await app.register(userRoutes)

app.get('/health', () => {
  return 'OK'
})

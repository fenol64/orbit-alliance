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

export const app = fastify().withTypeProvider<ZodTypeProvider>()

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

app.get('/health', () => {
  return 'OK'
})

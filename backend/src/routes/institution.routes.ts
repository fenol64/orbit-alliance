import type { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { InstitutionController } from '../controllers/institution.controller.js'

// Schemas para documentação
const createInstitutionSchema = z.object({
  email: z.string().email('Invalid email format').describe('Institution email'),
  password: z.string().min(6, 'Password must be at least 6 characters').describe('Institution password'),
  name: z.string().min(1, 'Name is required').describe('Institution name'),
})

const updateInstitutionSchema = z.object({
  email: z.string().email('Invalid email format').optional().describe('Institution email'),
  password: z.string().min(6, 'Password must be at least 6 characters').optional().describe('Institution password'),
  name: z.string().min(1, 'Name is required').optional().describe('Institution name'),
})

const institutionParamsSchema = z.object({
  id: z.string().ulid('Invalid institution ID').describe('Institution ID'),
})

const loginSchema = z.object({
  email: z.string().email('Invalid email format').describe('Institution email'),
  password: z.string().min(1, 'Password is required').describe('Institution password'),
})

const institutionResponseSchema = z.object({
  id: z.string(),
  email: z.string(),
  name: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export async function institutionRoutes(fastify: FastifyInstance) {
  // Criar instituição
  fastify.post('/institutions', {
    schema: {
      tags: ['institutions'],
      summary: 'Create a new institution',
      description: 'Creates a new institution with email, password and name',
      body: createInstitutionSchema,
      response: {
        201: z.object({
          message: z.string(),
          data: institutionResponseSchema,
        }),
        400: z.object({
          error: z.string(),
          details: z.array(z.any()).optional(),
        }),
      },
    },
    handler: InstitutionController.createInstitution,
  })

  // Obter todas as instituições
  fastify.get('/institutions', {
    schema: {
      tags: ['institutions'],
      summary: 'Get all institutions',
      description: 'Retrieves a list of all institutions',
      response: {
        200: z.object({
          data: z.array(institutionResponseSchema),
        }),
      },
    },
    handler: InstitutionController.getAllInstitutions,
  })

  // Obter instituição por ID
  fastify.get('/institutions/:id', {
    schema: {
      tags: ['institutions'],
      summary: 'Get institution by ID',
      description: 'Retrieves a specific institution by its ID',
      params: institutionParamsSchema,
      response: {
        200: z.object({
          data: institutionResponseSchema,
        }),
        404: z.object({
          error: z.string(),
        }),
      },
    },
    handler: InstitutionController.getInstitutionById,
  })

  // Atualizar instituição
  fastify.put('/institutions/:id', {
    schema: {
      tags: ['institutions'],
      summary: 'Update institution',
      description: 'Updates an existing institution',
      params: institutionParamsSchema,
      body: updateInstitutionSchema,
      response: {
        200: z.object({
          message: z.string(),
          data: institutionResponseSchema,
        }),
        400: z.object({
          error: z.string(),
          details: z.array(z.any()).optional(),
        }),
        404: z.object({
          error: z.string(),
        }),
      },
    },
    handler: InstitutionController.updateInstitution,
  })

  // Deletar instituição
  fastify.delete('/institutions/:id', {
    schema: {
      tags: ['institutions'],
      summary: 'Delete institution',
      description: 'Soft deletes an institution',
      params: institutionParamsSchema,
      response: {
        200: z.object({
          message: z.string(),
        }),
        404: z.object({
          error: z.string(),
        }),
      },
    },
    handler: InstitutionController.deleteInstitution,
  })

  // Obter instituição com detalhes (usuários, produtos, ações)
  fastify.get('/institutions/:id/details', {
    schema: {
      tags: ['institutions'],
      summary: 'Get institution with detailed information',
      description: 'Retrieves institution with related users, products, and actions',
      params: institutionParamsSchema,
      response: {
        200: z.object({
          data: institutionResponseSchema.extend({
            users: z.array(z.any()),
            products: z.array(z.any()),
            actions: z.array(z.any()),
          }),
        }),
        404: z.object({
          error: z.string(),
        }),
      },
    },
    handler: InstitutionController.getInstitutionWithDetails,
  })

  // Login da instituição
  fastify.post('/institutions/login', {
    schema: {
      tags: ['institutions'],
      summary: 'Institution login',
      description: 'Authenticates an institution with email and password',
      body: loginSchema,
      response: {
        200: z.object({
          message: z.string(),
          data: institutionResponseSchema,
        }),
        401: z.object({
          error: z.string(),
        }),
      },
    },
    handler: InstitutionController.loginInstitution,
  })
}
import type { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { ActionController } from '../controllers/action.controller.js'
import { institutionAuthMiddleware } from '../middleware/institution.middleware.ts'

// Schemas para documentação
const createActionSchema = z.object({
  name: z.string().min(1, 'Name is required').describe('Action name'),
  description: z.string().optional().describe('Action description'),
  reward: z.number().min(0, 'Reward must be a positive number').describe('Reward points for completing the action'),
})

const updateActionSchema = z.object({
  name: z.string().min(1, 'Name is required').optional().describe('Action name'),
  description: z.string().optional().describe('Action description'),
  reward: z.number().min(0, 'Reward must be a positive number').optional().describe('Reward points for completing the action'),
})

const actionParamsSchema = z.object({
  id: z.string().ulid('Invalid action ID').describe('Action unique identifier'),
})

const institutionParamsSchema = z.object({
  institutionId: z.string().ulid('Invalid institution ID').describe('Institution unique identifier'),
})

const searchQuerySchema = z.object({
  term: z.string().min(2, 'Search term must be at least 2 characters long').describe('Search term for actions'),
})

const actionResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  reward: z.number(),
  institutionId: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

const actionWithInstitutionSchema = actionResponseSchema.extend({
  institution: z.object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
  }),
})

export async function actionRoutes(fastify: FastifyInstance) {
  // Criar action (protegida por autenticação)
  fastify.post('/actions', {
    schema: {
      tags: ['actions'],
      summary: 'Create action',
      description: 'Creates a new action for the authenticated institution',
      security: [{ bearerAuth: [] }],
      body: createActionSchema,
      response: {
        201: z.object({
          message: z.string(),
          data: actionResponseSchema,
        }),
        400: z.object({
          error: z.string(),
          details: z.array(z.any()).optional(),
        }),
        404: z.object({
          error: z.string(),
        }),
        401: z.object({
          error: z.string(),
        }),
      },
    },
    preHandler: institutionAuthMiddleware,
    handler: ActionController.createAction,
  })

  // Obter todas as actions
  fastify.get('/actions', {
    schema: {
      tags: ['actions'],
      summary: 'Get all actions',
      description: 'Retrieves a list of all actions',
      response: {
        200: z.object({
          data: z.array(actionResponseSchema),
        }),
        500: z.object({
          error: z.string(),
        }),
      },
    },
    handler: ActionController.getAllActions,
  })

  // Obter actions públicas
  fastify.get('/actions/public', {
    schema: {
      tags: ['actions'],
      summary: 'Get public actions',
      description: 'Retrieves a list of all public actions with institution information',
      response: {
        200: z.object({
          data: z.array(actionWithInstitutionSchema),
        }),
        500: z.object({
          error: z.string(),
        }),
      },
    },
    handler: ActionController.getPublicActions,
  })

  // Buscar actions por termo
  fastify.get('/actions/search', {
    schema: {
      tags: ['actions'],
      summary: 'Search actions',
      description: 'Search actions by name or description',
      querystring: searchQuerySchema,
      response: {
        200: z.object({
          data: z.array(actionWithInstitutionSchema),
        }),
        400: z.object({
          error: z.string(),
          details: z.array(z.any()).optional(),
        }),
        500: z.object({
          error: z.string(),
        }),
      },
    },
    handler: ActionController.searchActions,
  })

  // Obter action por ID
  fastify.get('/actions/:id', {
    schema: {
      tags: ['actions'],
      summary: 'Get action by ID',
      description: 'Retrieves a specific action by its ID',
      params: actionParamsSchema,
      response: {
        200: z.object({
          data: actionResponseSchema,
        }),
        400: z.object({
          error: z.string(),
          details: z.array(z.any()).optional(),
        }),
        404: z.object({
          error: z.string(),
        }),
        500: z.object({
          error: z.string(),
        }),
      },
    },
    handler: ActionController.getActionById,
  })

  // Atualizar action (protegida por autenticação)
  fastify.put('/actions/:id', {
    schema: {
      tags: ['actions'],
      summary: 'Update action',
      description: 'Updates an existing action',
      security: [{ bearerAuth: [] }],
      params: actionParamsSchema,
      body: updateActionSchema,
      response: {
        200: z.object({
          message: z.string(),
          data: actionResponseSchema,
        }),
        400: z.object({
          error: z.string(),
          details: z.array(z.any()).optional(),
        }),
        404: z.object({
          error: z.string(),
        }),
        401: z.object({
          error: z.string(),
        }),
      },
    },
    preHandler: institutionAuthMiddleware,
    handler: ActionController.updateAction,
  })

  // Deletar action (protegida por autenticação)
  fastify.delete('/actions/:id', {
    schema: {
      tags: ['actions'],
      summary: 'Delete action',
      description: 'Soft deletes an action',
      security: [{ bearerAuth: [] }],
      params: actionParamsSchema,
      response: {
        200: z.object({
          message: z.string(),
        }),
        404: z.object({
          error: z.string(),
        }),
        401: z.object({
          error: z.string(),
        }),
      },
    },
    preHandler: institutionAuthMiddleware,
    handler: ActionController.deleteAction,
  })

  // Obter action com detalhes
  fastify.get('/actions/:id/details', {
    schema: {
      tags: ['actions'],
      summary: 'Get action with details',
      description: 'Retrieves a specific action with institution details',
      params: actionParamsSchema,
      response: {
        200: z.object({
          data: actionWithInstitutionSchema,
        }),
        400: z.object({
          error: z.string(),
          details: z.array(z.any()).optional(),
        }),
        404: z.object({
          error: z.string(),
        }),
        500: z.object({
          error: z.string(),
        }),
      },
    },
    handler: ActionController.getActionWithDetails,
  })

  // Obter usuários que executaram a action
  fastify.get('/actions/:id/users', {
    schema: {
      tags: ['actions'],
      summary: 'Get action users',
      description: 'Retrieves users who have executed a specific action',
      params: actionParamsSchema,
      response: {
        200: z.object({
          data: z.object({
            id: z.string(),
            name: z.string(),
            description: z.string().nullable(),
            reward: z.number(),
            institutionId: z.string(),
            createdAt: z.string(),
            updatedAt: z.string(),
            users: z.array(z.object({
              id: z.string(),
              executedAt: z.string(),
              user: z.object({
                id: z.string(),
                name: z.string(),
                email: z.string(),
              }),
            })),
          }),
        }),
        400: z.object({
          error: z.string(),
          details: z.array(z.any()).optional(),
        }),
        404: z.object({
          error: z.string(),
        }),
        500: z.object({
          error: z.string(),
        }),
      },
    },
    handler: ActionController.getActionUsers,
  })

  // Obter actions de uma instituição específica
  fastify.get('/institutions/:institutionId/actions', {
    schema: {
      tags: ['actions'],
      summary: 'Get actions by institution',
      description: 'Retrieves all actions from a specific institution',
      params: institutionParamsSchema,
      response: {
        200: z.object({
          data: z.array(actionResponseSchema),
        }),
        400: z.object({
          error: z.string(),
          details: z.array(z.any()).optional(),
        }),
        404: z.object({
          error: z.string(),
        }),
        500: z.object({
          error: z.string(),
        }),
      },
    },
    handler: ActionController.getActionsByInstitution,
  })
}
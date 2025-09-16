import type { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { ActionService } from '../services/action.service.js'

// Schemas de validação
const createActionSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  reward: z.number().min(0, 'Reward must be a positive number'),
})

const updateActionSchema = z.object({
  name: z.string().min(1, 'Name is required').optional(),
  description: z.string().optional(),
  reward: z.number().min(0, 'Reward must be a positive number').optional(),
})

const actionParamsSchema = z.object({
  id: z.string().ulid('Invalid action ID'),
})

const institutionParamsSchema = z.object({
  institutionId: z.string().ulid('Invalid institution ID'),
})

const searchQuerySchema = z.object({
  term: z.string().min(2, 'Search term must be at least 2 characters long'),
})

export class ActionController {
  // POST /actions
  static async createAction(
    request: FastifyRequest<{
      Body: z.infer<typeof createActionSchema>
    }>,
    reply: FastifyReply
  ) {
    try {
      const validatedData = createActionSchema.parse(request.body)
      
      // Obter institutionId do token JWT (middleware já validou)
      const institutionId = request.user!.institutionId
      
      const result = await ActionService.createAction(validatedData, institutionId)

      if (!result.success) {
        const statusCode = 
          result.error === 'Institution not found' ? 404 :
          result.error === 'Reward must be a positive number' ? 400 : 400
        
        return reply.status(statusCode).send({
          error: result.error,
        })
      }

      return reply.status(201).send({
        message: 'Action created successfully',
        data: result.data,
      })
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({
          error: 'Validation error',
          details: error.errors,
        })
      }

      return reply.status(500).send({
        error: 'Internal server error',
      })
    }
  }

  // GET /actions
  static async getAllActions(request: FastifyRequest, reply: FastifyReply) {
    try {
      const result = await ActionService.getAllActions()

      if (!result.success) {
        return reply.status(500).send({
          error: result.error,
        })
      }

      return reply.status(200).send({
        data: result.data,
      })
    } catch (error) {
      return reply.status(500).send({
        error: 'Internal server error',
      })
    }
  }

  // GET /actions/public
  static async getPublicActions(request: FastifyRequest, reply: FastifyReply) {
    try {
      const result = await ActionService.getPublicActions()

      if (!result.success) {
        return reply.status(500).send({
          error: result.error,
        })
      }

      return reply.status(200).send({
        data: result.data,
      })
    } catch (error) {
      return reply.status(500).send({
        error: 'Internal server error',
      })
    }
  }

  // GET /actions/search
  static async searchActions(
    request: FastifyRequest<{
      Querystring: z.infer<typeof searchQuerySchema>
    }>,
    reply: FastifyReply
  ) {
    try {
      const { term } = searchQuerySchema.parse(request.query)
      const result = await ActionService.searchActions(term)

      if (!result.success) {
        return reply.status(400).send({
          error: result.error,
        })
      }

      return reply.status(200).send({
        data: result.data,
      })
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({
          error: 'Validation error',
          details: error.errors,
        })
      }

      return reply.status(500).send({
        error: 'Internal server error',
      })
    }
  }

  // GET /actions/:id
  static async getActionById(
    request: FastifyRequest<{
      Params: z.infer<typeof actionParamsSchema>
    }>,
    reply: FastifyReply
  ) {
    try {
      const { id } = actionParamsSchema.parse(request.params)
      const result = await ActionService.getActionById(id)

      if (!result.success) {
        const statusCode = result.error === 'Action not found' ? 404 : 500
        return reply.status(statusCode).send({
          error: result.error,
        })
      }

      return reply.status(200).send({
        data: result.data,
      })
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({
          error: 'Validation error',
          details: error.errors,
        })
      }

      return reply.status(500).send({
        error: 'Internal server error',
      })
    }
  }

  // PUT /actions/:id
  static async updateAction(
    request: FastifyRequest<{
      Params: z.infer<typeof actionParamsSchema>
      Body: z.infer<typeof updateActionSchema>
    }>,
    reply: FastifyReply
  ) {
    try {
      const { id } = actionParamsSchema.parse(request.params)
      const validatedData = updateActionSchema.parse(request.body)

      const result = await ActionService.updateAction(id, validatedData)

      if (!result.success) {
        const statusCode = result.error === 'Action not found' ? 404 : 400
        return reply.status(statusCode).send({
          error: result.error,
        })
      }

      return reply.status(200).send({
        message: 'Action updated successfully',
        data: result.data,
      })
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({
          error: 'Validation error',
          details: error.errors,
        })
      }

      return reply.status(500).send({
        error: 'Internal server error',
      })
    }
  }

  // DELETE /actions/:id
  static async deleteAction(
    request: FastifyRequest<{
      Params: z.infer<typeof actionParamsSchema>
    }>,
    reply: FastifyReply
  ) {
    try {
      const { id } = actionParamsSchema.parse(request.params)
      const result = await ActionService.deleteAction(id)

      if (!result.success) {
        const statusCode = result.error === 'Action not found' ? 404 : 500
        return reply.status(statusCode).send({
          error: result.error,
        })
      }

      return reply.status(200).send({
        message: 'Action deleted successfully',
      })
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({
          error: 'Validation error',
          details: error.errors,
        })
      }

      return reply.status(500).send({
        error: 'Internal server error',
      })
    }
  }

  // GET /actions/:id/details
  static async getActionWithDetails(
    request: FastifyRequest<{
      Params: z.infer<typeof actionParamsSchema>
    }>,
    reply: FastifyReply
  ) {
    try {
      const { id } = actionParamsSchema.parse(request.params)
      const result = await ActionService.getActionWithDetails(id)

      if (!result.success) {
        const statusCode = result.error === 'Action not found' ? 404 : 500
        return reply.status(statusCode).send({
          error: result.error,
        })
      }

      return reply.status(200).send({
        data: result.data,
      })
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({
          error: 'Validation error',
          details: error.errors,
        })
      }

      return reply.status(500).send({
        error: 'Internal server error',
      })
    }
  }

  // GET /actions/:id/users
  static async getActionUsers(
    request: FastifyRequest<{
      Params: z.infer<typeof actionParamsSchema>
    }>,
    reply: FastifyReply
  ) {
    try {
      const { id } = actionParamsSchema.parse(request.params)
      const result = await ActionService.getActionUsers(id)

      if (!result.success) {
        const statusCode = result.error === 'Action not found' ? 404 : 500
        return reply.status(statusCode).send({
          error: result.error,
        })
      }

      return reply.status(200).send({
        data: result.data,
      })
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({
          error: 'Validation error',
          details: error.errors,
        })
      }

      return reply.status(500).send({
        error: 'Internal server error',
      })
    }
  }

  // GET /institutions/:institutionId/actions
  static async getActionsByInstitution(
    request: FastifyRequest<{
      Params: z.infer<typeof institutionParamsSchema>
    }>,
    reply: FastifyReply
  ) {
    try {
      const { institutionId } = institutionParamsSchema.parse(request.params)
      const result = await ActionService.getActionsByInstitution(institutionId)

      if (!result.success) {
        const statusCode = result.error === 'Institution not found' ? 404 : 500
        return reply.status(statusCode).send({
          error: result.error,
        })
      }

      return reply.status(200).send({
        data: result.data,
      })
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({
          error: 'Validation error',
          details: error.errors,
        })
      }

      return reply.status(500).send({
        error: 'Internal server error',
      })
    }
  }
}
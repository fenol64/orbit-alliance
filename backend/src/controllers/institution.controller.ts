import type { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { InstitutionService } from '../services/institution.service.js'

// Schemas de validação
const createInstitutionSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().min(1, 'Name is required'),
})

const updateInstitutionSchema = z.object({
  email: z.string().email('Invalid email format').optional(),
  password: z.string().min(6, 'Password must be at least 6 characters').optional(),
  name: z.string().min(1, 'Name is required').optional(),
})

const institutionParamsSchema = z.object({
  id: z.string().ulid('Invalid institution ID'),
})

const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
})

export class InstitutionController {
  // POST /institutions
  static async createInstitution(
    request: FastifyRequest<{
      Body: z.infer<typeof createInstitutionSchema>
    }>,
    reply: FastifyReply
  ) {
    try {
      const validatedData = createInstitutionSchema.parse(request.body)
      const result = await InstitutionService.createInstitution(validatedData)

      if (!result.success) {
        return reply.status(400).send({
          error: result.error,
        })
      }

      return reply.status(201).send({
        message: 'Institution created successfully',
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

  // GET /institutions/:id
  static async getInstitutionById(
    request: FastifyRequest<{
      Params: z.infer<typeof institutionParamsSchema>
    }>,
    reply: FastifyReply
  ) {
    try {
      const { id } = institutionParamsSchema.parse(request.params)
      const result = await InstitutionService.getInstitutionById(id)

      if (!result.success) {
        return reply.status(404).send({
          error: result.error,
        })
      }

      return reply.status(200).send({
        data: result.data,
      })
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({
          error: 'Invalid institution ID',
          details: error.errors,
        })
      }

      return reply.status(500).send({
        error: 'Internal server error',
      })
    }
  }

  // GET /institutions
  static async getAllInstitutions(request: FastifyRequest, reply: FastifyReply) {
    try {
      const result = await InstitutionService.getAllInstitutions()

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

  // PUT /institutions/:id
  static async updateInstitution(
    request: FastifyRequest<{
      Params: z.infer<typeof institutionParamsSchema>
      Body: z.infer<typeof updateInstitutionSchema>
    }>,
    reply: FastifyReply
  ) {
    try {
      const { id } = institutionParamsSchema.parse(request.params)
      const validatedData = updateInstitutionSchema.parse(request.body)

      const result = await InstitutionService.updateInstitution(id, validatedData)

      if (!result.success) {
        const statusCode = result.error === 'Institution not found' ? 404 : 400
        return reply.status(statusCode).send({
          error: result.error,
        })
      }

      return reply.status(200).send({
        message: 'Institution updated successfully',
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

  // DELETE /institutions/:id
  static async deleteInstitution(
    request: FastifyRequest<{
      Params: z.infer<typeof institutionParamsSchema>
    }>,
    reply: FastifyReply
  ) {
    try {
      const { id } = institutionParamsSchema.parse(request.params)
      const result = await InstitutionService.deleteInstitution(id)

      if (!result.success) {
        return reply.status(404).send({
          error: result.error,
        })
      }

      return reply.status(200).send({
        message: 'Institution deleted successfully',
      })
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({
          error: 'Invalid institution ID',
          details: error.errors,
        })
      }

      return reply.status(500).send({
        error: 'Internal server error',
      })
    }
  }

  // GET /institutions/:id/details
  static async getInstitutionWithDetails(
    request: FastifyRequest<{
      Params: z.infer<typeof institutionParamsSchema>
    }>,
    reply: FastifyReply
  ) {
    try {
      const { id } = institutionParamsSchema.parse(request.params)
      const result = await InstitutionService.getInstitutionWithDetails(id)

      if (!result.success) {
        return reply.status(404).send({
          error: result.error,
        })
      }

      return reply.status(200).send({
        data: result.data,
      })
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({
          error: 'Invalid institution ID',
          details: error.errors,
        })
      }

      return reply.status(500).send({
        error: 'Internal server error',
      })
    }
  }

  // POST /institutions/login
  static async loginInstitution(
    request: FastifyRequest<{
      Body: z.infer<typeof loginSchema>
    }>,
    reply: FastifyReply
  ) {
    try {
      const { email, password } = loginSchema.parse(request.body)
      const result = await InstitutionService.authenticateInstitution(email, password)

      if (!result.success) {
        return reply.status(401).send({
          error: result.error,
        })
      }

      return reply.status(200).send({
        message: 'Login successful',
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
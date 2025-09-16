import type { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { PurchaseService } from '../services/purchase.service.js'

// Schemas de validação
const purchaseParamsSchema = z.object({
  id: z.string().ulid('Invalid purchase ID'),
})

const createPurchaseSchema = z.object({
  productId: z.string().ulid('Invalid product ID'),
})

export class PurchaseController {
  // POST /purchases
  static async createPurchase(
    request: FastifyRequest<{
      Body: z.infer<typeof createPurchaseSchema>
    }>,
    reply: FastifyReply
  ) {
    try {
      const validatedData = createPurchaseSchema.parse(request.body)
      
      // Extrair o ID do usuário do token JWT
      if (!request.user || !request.user.userId) {
        return reply.status(401).send({
          error: 'User not authenticated',
        })
      }
      
      const userId = request.user.userId

      const result = await PurchaseService.createPurchase(validatedData, userId)

      if (!result.success) {
        return reply.status(400).send({
          error: result.error,
        })
      }

      return reply.status(201).send({
        message: 'Purchase created successfully',
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

  // GET /purchases
  static async getUserPurchases(
    request: FastifyRequest,
    reply: FastifyReply
  ) {
    try {
      // Extrair o ID do usuário do token JWT
      if (!request.user || !request.user.userId) {
        return reply.status(401).send({
          error: 'User not authenticated',
        })
      }
      
      const userId = request.user.userId

      const result = await PurchaseService.getUserPurchases(userId)

      if (!result.success) {
        return reply.status(400).send({
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

  // GET /institutions/purchases
  static async getInstitutionPurchases(
    request: FastifyRequest,
    reply: FastifyReply
  ) {
    try {
      // Extrair o ID da instituição do token JWT
      if (!request.institution || !request.institution.institutionId) {
        return reply.status(401).send({
          error: 'Institution not authenticated',
        })
      }
      
      const institutionId = request.institution.institutionId

      const result = await PurchaseService.getInstitutionPurchases(institutionId)

      if (!result.success) {
        return reply.status(400).send({
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
}
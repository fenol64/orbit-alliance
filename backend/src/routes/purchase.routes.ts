import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { PurchaseController } from '../controllers/purchase.controller.js'
import { institutionAuthMiddleware, userAuthMiddleware } from '../middleware/institution.middleware.ts'

// Schemas para validação de entrada e saída
const purchaseResponseSchema = z.object({
  id: z.string(),
  productId: z.string(),
  userId: z.string(),
  priceAtPurchase: z.number(),
  purchasedAt: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  deletedAt: z.string().nullable(),
})

const createPurchaseSchema = z.object({
  productId: z.string().ulid('Invalid product ID'),
})

export default async function purchaseRoutes(fastify: FastifyInstance) {
  // Criar uma compra (requer autenticação de usuário)
  fastify.post('/purchases', {
    preHandler: userAuthMiddleware,
    schema: {
      tags: ['purchases'],
      summary: 'Create a new purchase',
      description: 'Creates a new purchase of a product by the authenticated user',
      body: createPurchaseSchema,
      response: {
        201: z.object({
          message: z.string(),
          data: purchaseResponseSchema,
        }),
        400: z.object({
          error: z.string(),
        }),
        401: z.object({
          error: z.string(),
        }),
      },
    },
    handler: PurchaseController.createPurchase,
  })

  // Listar compras do usuário (requer autenticação de usuário)
  fastify.get('/purchases', {
    preHandler: userAuthMiddleware,
    schema: {
      tags: ['purchases'],
      summary: 'List user purchases',
      description: 'Lists all purchases made by the authenticated user',
      response: {
        200: z.object({
          data: z.array(purchaseResponseSchema),
        }),
        401: z.object({
          error: z.string(),
        }),
      },
    },
    handler: PurchaseController.getUserPurchases,
  })

  // Listar compras da instituição (requer autenticação de instituição)
  fastify.get('/institutions/purchases', {
    preHandler: institutionAuthMiddleware,
    schema: {
      tags: ['purchases'],
      summary: 'List institution purchases',
      description: 'Lists all purchases made for products of the authenticated institution',
      response: {
        200: z.object({
          data: z.array(purchaseResponseSchema),
        }),
        401: z.object({
          error: z.string(),
        }),
      },
    },
    handler: PurchaseController.getInstitutionPurchases,
  })
}
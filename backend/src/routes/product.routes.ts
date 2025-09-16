import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { ProductController } from '../controllers/product.controller.js'
import { institutionAuthMiddleware, userAuthMiddleware } from '../middleware/institution.middleware.ts'

// Schemas para documentação
const createProductSchema = z.object({
  name: z.string().min(1, 'Name is required').describe('Product name'),
  price: z.number().min(0, 'Price must be a positive number').describe('Product price in cents'),
  isInternal: z.boolean().describe('Whether the product is internal to the institution'),
  image: z.string().url('Invalid image URL').optional().describe('Product image URL'),
  description: z.string().optional().describe('Product description'),
})

const updateProductSchema = z.object({
  name: z.string().min(1, 'Name is required').optional().describe('Product name'),
  price: z.number().min(0, 'Price must be a positive number').optional().describe('Product price in cents'),
  isInternal: z.boolean().optional().describe('Whether the product is internal to the institution'),
  image: z.string().url('Invalid image URL').optional().describe('Product image URL'),
  description: z.string().optional().describe('Product description'),
})

const productParamsSchema = z.object({
  id: z.string().ulid('Invalid product ID').describe('Product ID'),
})

const institutionParamsSchema = z.object({
  institutionId: z.string().ulid('Invalid institution ID').describe('Institution ID'),
})

const searchQuerySchema = z.object({
  q: z.string().min(2, 'Search query must be at least 2 characters long').describe('Search query'),
})

const productResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number(),
  institutionId: z.string(),
  isInternal: z.boolean(),
  image: z.string().nullable(),
  description: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export async function productRoutes(fastify: FastifyInstance) {
  // Criar produto
  fastify.post('/products', {
    schema: {
      tags: ['products'],
      summary: 'Create a new product',
      description: 'Creates a new product for an institution',
      body: createProductSchema,
      response: {
        201: z.object({
          message: z.string(),
          data: productResponseSchema,
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
    handler: ProductController.createProduct,
  })

  // Obter todos os produtos
  fastify.get('/products', {
    schema: {
      tags: ['products'],
      summary: 'Get all products',
      description: 'Retrieves a list of all products',
      response: {
        200: z.object({
          data: z.array(productResponseSchema),
        }),
      },
    },
    handler: ProductController.getAllProducts,
  })

  // Obter produtos públicos
  fastify.get('/products/public', {
    schema: {
      tags: ['products'],
      summary: 'Get public products',
      description: 'Retrieves a list of public products (isInternal = false)',
      response: {
        200: z.object({
          data: z.array(productResponseSchema.extend({
            institution: z.object({
              id: z.string(),
              name: z.string(),
            }),
          })),
        }),
      },
    },
    handler: ProductController.getPublicProducts,
  })

  // Buscar produtos
  fastify.get('/products/search', {
    schema: {
      tags: ['products'],
      summary: 'Search products',
      description: 'Search products by name or description',
      querystring: searchQuerySchema,
      response: {
        200: z.object({
          data: z.array(productResponseSchema.extend({
            institution: z.object({
              id: z.string(),
              name: z.string(),
            }),
          })),
        }),
        400: z.object({
          error: z.string(),
          details: z.array(z.any()).optional(),
        }),
      },
    },
    handler: ProductController.searchProducts,
  })

  // Obter produto por ID
  fastify.get('/products/:id', {
    schema: {
      tags: ['products'],
      summary: 'Get product by ID',
      description: 'Retrieves a specific product by its ID',
      params: productParamsSchema,
      response: {
        200: z.object({
          data: productResponseSchema,
        }),
        404: z.object({
          error: z.string(),
        }),
      },
    },
    handler: ProductController.getProductById,
  })

  // Atualizar produto
  fastify.put('/products/:id', {
    schema: {
      tags: ['products'],
      summary: 'Update product',
      description: 'Updates an existing product',
      params: productParamsSchema,
      body: updateProductSchema,
      response: {
        200: z.object({
          message: z.string(),
          data: productResponseSchema,
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
    handler: ProductController.updateProduct,
  })

  // Deletar produto
  fastify.delete('/products/:id', {
    schema: {
      tags: ['products'],
      summary: 'Delete product',
      description: 'Soft deletes a product',
      params: productParamsSchema,
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
    handler: ProductController.deleteProduct,
  })

  // Obter produto com detalhes
  fastify.get('/products/:id/details', {
    schema: {
      tags: ['products'],
      summary: 'Get product with detailed information',
      description: 'Retrieves product with institution and purchase information',
      params: productParamsSchema,
      response: {
        200: z.object({
          data: productResponseSchema.extend({
            institution: z.object({
              id: z.string(),
              name: z.string(),
              email: z.string(),
            }),
            purchases: z.array(z.any()),
          }),
        }),
        404: z.object({
          error: z.string(),
        }),
      },
    },
    handler: ProductController.getProductWithDetails,
  })

  // Obter compras do produto
  fastify.get('/products/:id/purchases', {
    schema: {
      tags: ['products'],
      summary: 'Get product purchases',
      description: 'Retrieves all purchases for a specific product',
      params: productParamsSchema,
      response: {
        200: z.object({
          data: productResponseSchema.extend({
            purchases: z.array(z.any()),
          }),
        }),
        404: z.object({
          error: z.string(),
        }),
      },
    },
    handler: ProductController.getProductPurchases,
  })

  // Obter produtos de uma instituição
  fastify.get('/institutions/:institutionId/products', {
    schema: {
      tags: ['products'],
      summary: 'Get products by institution',
      description: 'Retrieves all products from a specific institution',
      params: institutionParamsSchema,
      response: {
        200: z.object({
          data: z.array(productResponseSchema),
        }),
        404: z.object({
          error: z.string(),
        }),
      },
    },
    handler: ProductController.getProductsByInstitution,
  })
}
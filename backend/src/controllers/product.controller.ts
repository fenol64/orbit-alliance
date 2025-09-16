import type { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { ProductService } from '../services/product.service.js'

// Schemas de validação
const createProductSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  price: z.number().min(0, 'Price must be a positive number'),
  isInternal: z.boolean(),
  image: z.string().url('Invalid image URL').optional(),
  description: z.string().optional(),
})

const updateProductSchema = z.object({
  name: z.string().min(1, 'Name is required').optional(),
  price: z.number().min(0, 'Price must be a positive number').optional(),
  institutionId: z.string().ulid('Invalid institution ID').optional(),
  isInternal: z.boolean().optional(),
  image: z.string().url('Invalid image URL').optional(),
  description: z.string().optional(),
})

const productParamsSchema = z.object({
  id: z.string().ulid('Invalid product ID'),
})

const institutionParamsSchema = z.object({
  institutionId: z.string().ulid('Invalid institution ID'),
})

const searchQuerySchema = z.object({
  q: z.string().min(2, 'Search query must be at least 2 characters long'),
})

export class ProductController {
  // POST /products
  static async createProduct(
    request: FastifyRequest<{
      Body: z.infer<typeof createProductSchema>
    }>,
    reply: FastifyReply
  ) {
    try {
      const validatedData = createProductSchema.parse(request.body)
      
      // Obter institutionId do token JWT (middleware já validou)
      const institutionId = request.user!.institutionId
      
      const result = await ProductService.createProduct(validatedData, institutionId)

      if (!result.success) {
        const statusCode = 
          result.error === 'Institution not found' ? 404 :
          result.error === 'Price must be a positive number' ? 400 : 400
        
        return reply.status(statusCode).send({
          error: result.error,
        })
      }

      return reply.status(201).send({
        message: 'Product created successfully',
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

  // GET /products/:id
  static async getProductById(
    request: FastifyRequest<{
      Params: z.infer<typeof productParamsSchema>
    }>,
    reply: FastifyReply
  ) {
    try {
      const { id } = productParamsSchema.parse(request.params)
      const result = await ProductService.getProductById(id)

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
          error: 'Invalid product ID',
          details: error.errors,
        })
      }

      return reply.status(500).send({
        error: 'Internal server error',
      })
    }
  }

  // GET /products
  static async getAllProducts(request: FastifyRequest, reply: FastifyReply) {
    try {
      const result = await ProductService.getAllProducts()

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

  // GET /products/public
  static async getPublicProducts(request: FastifyRequest, reply: FastifyReply) {
    try {
      const result = await ProductService.getPublicProducts()

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

  // GET /institutions/:institutionId/products
  static async getProductsByInstitution(
    request: FastifyRequest<{
      Params: z.infer<typeof institutionParamsSchema>
    }>,
    reply: FastifyReply
  ) {
    try {
      const { institutionId } = institutionParamsSchema.parse(request.params)
      const result = await ProductService.getProductsByInstitution(institutionId)

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
          error: 'Invalid institution ID',
          details: error.errors,
        })
      }

      return reply.status(500).send({
        error: 'Internal server error',
      })
    }
  }

  // PUT /products/:id
  static async updateProduct(
    request: FastifyRequest<{
      Params: z.infer<typeof productParamsSchema>
      Body: z.infer<typeof updateProductSchema>
    }>,
    reply: FastifyReply
  ) {
    try {
      const { id } = productParamsSchema.parse(request.params)
      const validatedData = updateProductSchema.parse(request.body)

      const result = await ProductService.updateProduct(id, validatedData)

      if (!result.success) {
        const statusCode = 
          result.error === 'Product not found' ? 404 :
          result.error === 'Institution not found' ? 404 :
          result.error === 'Price must be a positive number' ? 400 : 400
        
        return reply.status(statusCode).send({
          error: result.error,
        })
      }

      return reply.status(200).send({
        message: 'Product updated successfully',
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

  // DELETE /products/:id
  static async deleteProduct(
    request: FastifyRequest<{
      Params: z.infer<typeof productParamsSchema>
    }>,
    reply: FastifyReply
  ) {
    try {
      const { id } = productParamsSchema.parse(request.params)
      const result = await ProductService.deleteProduct(id)

      if (!result.success) {
        return reply.status(404).send({
          error: result.error,
        })
      }

      return reply.status(200).send({
        message: 'Product deleted successfully',
      })
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({
          error: 'Invalid product ID',
          details: error.errors,
        })
      }

      return reply.status(500).send({
        error: 'Internal server error',
      })
    }
  }

  // GET /products/:id/details
  static async getProductWithDetails(
    request: FastifyRequest<{
      Params: z.infer<typeof productParamsSchema>
    }>,
    reply: FastifyReply
  ) {
    try {
      const { id } = productParamsSchema.parse(request.params)
      const result = await ProductService.getProductWithDetails(id)

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
          error: 'Invalid product ID',
          details: error.errors,
        })
      }

      return reply.status(500).send({
        error: 'Internal server error',
      })
    }
  }

  // GET /products/:id/purchases
  static async getProductPurchases(
    request: FastifyRequest<{
      Params: z.infer<typeof productParamsSchema>
    }>,
    reply: FastifyReply
  ) {
    try {
      const { id } = productParamsSchema.parse(request.params)
      const result = await ProductService.getProductPurchases(id)

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
          error: 'Invalid product ID',
          details: error.errors,
        })
      }

      return reply.status(500).send({
        error: 'Internal server error',
      })
    }
  }

  // GET /products/search?q=query
  static async searchProducts(
    request: FastifyRequest<{
      Querystring: z.infer<typeof searchQuerySchema>
    }>,
    reply: FastifyReply
  ) {
    try {
      const { q } = searchQuerySchema.parse(request.query)
      const result = await ProductService.searchProducts(q)

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
          error: 'Invalid search query',
          details: error.errors,
        })
      }

      return reply.status(500).send({
        error: 'Internal server error',
      })
    }
  }
}
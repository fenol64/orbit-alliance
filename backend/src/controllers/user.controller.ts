import type { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { UserService } from '../services/user.service.js'

// Schemas de validação
const createUserSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  wallet: z.string().min(1, 'Wallet is required'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

const updateUserSchema = z.object({
  name: z.string().min(1, 'Name is required').optional(),
  wallet: z.string().min(1, 'Wallet is required').optional(),
  email: z.string().email('Invalid email format').optional(),
  password: z.string().min(6, 'Password must be at least 6 characters').optional(),
})

const userParamsSchema = z.object({
  id: z.string().ulid('Invalid user ID'),
})

const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
})

const walletLoginSchema = z.object({
  wallet: z.string().min(1, 'Wallet is required'),
})

export class UserController {
  // POST /users
  static async createUser(
    request: FastifyRequest<{
      Body: z.infer<typeof createUserSchema>
    }>,
    reply: FastifyReply
  ) {
    try {
      const validatedData = createUserSchema.parse(request.body)
      const result = await UserService.createUser(validatedData)

      if (!result.success) {
        return reply.status(400).send({
          error: result.error,
        })
      }

      return reply.status(201).send({
        message: 'User created successfully',
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

  // GET /users/:id
  static async getUserById(
    request: FastifyRequest<{
      Params: z.infer<typeof userParamsSchema>
    }>,
    reply: FastifyReply
  ) {
    try {
      const { id } = userParamsSchema.parse(request.params)
      const result = await UserService.getUserById(id)

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
          error: 'Invalid user ID',
          details: error.errors,
        })
      }

      return reply.status(500).send({
        error: 'Internal server error',
      })
    }
  }

  // GET /users
  static async getAllUsers(request: FastifyRequest, reply: FastifyReply) {
    try {
      const result = await UserService.getAllUsers()

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

  // PUT /users/:id
  static async updateUser(
    request: FastifyRequest<{
      Params: z.infer<typeof userParamsSchema>
      Body: z.infer<typeof updateUserSchema>
    }>,
    reply: FastifyReply
  ) {
    try {
      const { id } = userParamsSchema.parse(request.params)
      const validatedData = updateUserSchema.parse(request.body)

      const result = await UserService.updateUser(id, validatedData)

      if (!result.success) {
        const statusCode = result.error === 'User not found' ? 404 : 400
        return reply.status(statusCode).send({
          error: result.error,
        })
      }

      return reply.status(200).send({
        message: 'User updated successfully',
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

  // DELETE /users/:id
  static async deleteUser(
    request: FastifyRequest<{
      Params: z.infer<typeof userParamsSchema>
    }>,
    reply: FastifyReply
  ) {
    try {
      const { id } = userParamsSchema.parse(request.params)
      const result = await UserService.deleteUser(id)

      if (!result.success) {
        return reply.status(404).send({
          error: result.error,
        })
      }

      return reply.status(200).send({
        message: 'User deleted successfully',
      })
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({
          error: 'Invalid user ID',
          details: error.errors,
        })
      }

      return reply.status(500).send({
        error: 'Internal server error',
      })
    }
  }

  // GET /users/:id/details
  static async getUserWithDetails(
    request: FastifyRequest<{
      Params: z.infer<typeof userParamsSchema>
    }>,
    reply: FastifyReply
  ) {
    try {
      const { id } = userParamsSchema.parse(request.params)
      const result = await UserService.getUserWithDetails(id)

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
          error: 'Invalid user ID',
          details: error.errors,
        })
      }

      return reply.status(500).send({
        error: 'Internal server error',
      })
    }
  }

  // POST /users/login
  static async loginUser(
    request: FastifyRequest<{
      Body: z.infer<typeof loginSchema>
    }>,
    reply: FastifyReply
  ) {
    try {
      const { email, password } = loginSchema.parse(request.body)
      const result = await UserService.authenticateUser(email, password)

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

  // POST /users/login/wallet
  static async loginUserByWallet(
    request: FastifyRequest<{
      Body: z.infer<typeof walletLoginSchema>
    }>,
    reply: FastifyReply
  ) {
    try {
      const { wallet } = walletLoginSchema.parse(request.body)
      const result = await UserService.authenticateUserByWallet(wallet)

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
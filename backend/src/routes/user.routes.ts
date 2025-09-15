import type { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { UserController } from '../controllers/user.controller.js'

// Schemas para documentação
const createUserSchema = z.object({
  name: z.string().min(1, 'Name is required').describe('User full name'),
  wallet: z.string().min(1, 'Wallet is required').describe('User wallet address'),
  email: z.string().email('Invalid email format').describe('User email'),
  password: z.string().min(6, 'Password must be at least 6 characters').describe('User password'),
})

const updateUserSchema = z.object({
  name: z.string().min(1, 'Name is required').optional().describe('User full name'),
  wallet: z.string().min(1, 'Wallet is required').optional().describe('User wallet address'),
  email: z.string().email('Invalid email format').optional().describe('User email'),
  password: z.string().min(6, 'Password must be at least 6 characters').optional().describe('User password'),
})

const userParamsSchema = z.object({
  id: z.string().ulid('Invalid user ID').describe('User ID'),
})

const loginSchema = z.object({
  email: z.string().email('Invalid email format').describe('User email'),
  password: z.string().min(1, 'Password is required').describe('User password'),
})

const walletLoginSchema = z.object({
  wallet: z.string().min(1, 'Wallet is required').describe('User wallet address'),
})

const userResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  wallet: z.string(),
  email: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export async function userRoutes(fastify: FastifyInstance) {
  // Criar usuário
  fastify.post('/users', {
    schema: {
      tags: ['users'],
      summary: 'Create a new user',
      description: 'Creates a new user with name, wallet, email and password',
      body: createUserSchema,
      response: {
        201: z.object({
          message: z.string(),
          data: userResponseSchema,
        }),
        400: z.object({
          error: z.string(),
          details: z.array(z.any()).optional(),
        }),
      },
    },
    handler: UserController.createUser,
  })

  // Obter todos os usuários
  fastify.get('/users', {
    schema: {
      tags: ['users'],
      summary: 'Get all users',
      description: 'Retrieves a list of all users',
      response: {
        200: z.object({
          data: z.array(userResponseSchema),
        }),
      },
    },
    handler: UserController.getAllUsers,
  })

  // Obter usuário por ID
  fastify.get('/users/:id', {
    schema: {
      tags: ['users'],
      summary: 'Get user by ID',
      description: 'Retrieves a specific user by its ID',
      params: userParamsSchema,
      response: {
        200: z.object({
          data: userResponseSchema,
        }),
        404: z.object({
          error: z.string(),
        }),
      },
    },
    handler: UserController.getUserById,
  })

  // Atualizar usuário
  fastify.put('/users/:id', {
    schema: {
      tags: ['users'],
      summary: 'Update user',
      description: 'Updates an existing user',
      params: userParamsSchema,
      body: updateUserSchema,
      response: {
        200: z.object({
          message: z.string(),
          data: userResponseSchema,
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
    handler: UserController.updateUser,
  })

  // Deletar usuário
  fastify.delete('/users/:id', {
    schema: {
      tags: ['users'],
      summary: 'Delete user',
      description: 'Soft deletes a user',
      params: userParamsSchema,
      response: {
        200: z.object({
          message: z.string(),
        }),
        404: z.object({
          error: z.string(),
        }),
      },
    },
    handler: UserController.deleteUser,
  })

  // Obter usuário com detalhes (instituições, compras, ações)
  fastify.get('/users/:id/details', {
    schema: {
      tags: ['users'],
      summary: 'Get user with detailed information',
      description: 'Retrieves user with related institutions, purchases, and actions',
      params: userParamsSchema,
      response: {
        200: z.object({
          data: userResponseSchema.extend({
            institutions: z.array(z.any()),
            purchases: z.array(z.any()),
            actions: z.array(z.any()),
          }),
        }),
        404: z.object({
          error: z.string(),
        }),
      },
    },
    handler: UserController.getUserWithDetails,
  })

  // Login do usuário (email/senha)
  fastify.post('/users/login', {
    schema: {
      tags: ['users'],
      summary: 'User login with email and password',
      description: 'Authenticates a user with email and password',
      body: loginSchema,
      response: {
        200: z.object({
          message: z.string(),
          data: userResponseSchema,
        }),
        401: z.object({
          error: z.string(),
        }),
      },
    },
    handler: UserController.loginUser,
  })

  // Login do usuário (wallet)
  fastify.post('/users/login/wallet', {
    schema: {
      tags: ['users'],
      summary: 'User login with wallet',
      description: 'Authenticates a user with wallet address',
      body: walletLoginSchema,
      response: {
        200: z.object({
          message: z.string(),
          data: userResponseSchema,
        }),
        401: z.object({
          error: z.string(),
        }),
      },
    },
    handler: UserController.loginUserByWallet,
  })
}
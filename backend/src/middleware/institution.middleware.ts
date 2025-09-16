import type { FastifyRequest, FastifyReply } from 'fastify'
import jwt from 'jsonwebtoken'
import { env } from '../env.ts'

export interface InstitutionJWTPayload {
  institutionId: string
  email: string
  type: 'institution'
  iat?: number
  exp?: number
}

export interface UserJWTPayload {
  userId: string
  email: string
  type: 'user'
  iat?: number
  exp?: number
}

// Declarar o tipo para request.user e request.institution
declare module 'fastify' {
  interface FastifyRequest {
    institution?: InstitutionJWTPayload
    user?: UserJWTPayload
  }
}

export async function institutionAuthMiddleware(request: FastifyRequest, reply: FastifyReply) {
  try {
    // Verificar se o header Authorization existe
    const authHeader = request.headers.authorization
    
    if (!authHeader) {
      return reply.status(401).send({
        error: 'Authorization header is required'
      })
    }

    // Verificar se o token está no formato correto (Bearer <token>)
    const parts = authHeader.split(' ')
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return reply.status(401).send({
        error: 'Authorization header must be in format: Bearer <token>'
      })
    }

    const token = parts[1]

    console.log('Verifying JWT token...')
    console.log('JWT_SECRET:', env.JWT_SECRET)
    
    // Verificar e decodificar o JWT token
    const decoded = jwt.verify(token, env.JWT_SECRET) as InstitutionJWTPayload

    console.log('Token decoded successfully:', decoded)

    // Verificar se é um token de instituição
    if (decoded.type !== 'institution') {
      console.log('Invalid token type:', decoded.type)
      return reply.status(401).send({
        error: 'Invalid token type'
      })
    }

    // Adicionar as informações da instituição ao request
    request.institution = decoded

    console.log('Authenticated institution:', decoded.institutionId)
  } catch (error) {
    console.error('JWT verification error:', error)
    if (error instanceof jwt.JsonWebTokenError) {
      return reply.status(401).send({
        error: 'Invalid or expired token'
      })
    }

    console.error('Auth middleware error:', error)
    return reply.status(500).send({
      error: 'Authentication failed'
    })
  }
}

export async function userAuthMiddleware(request: FastifyRequest, reply: FastifyReply) {
  try {
    // Verificar se o header Authorization existe
    const authHeader = request.headers.authorization
    
    if (!authHeader) {
      return reply.status(401).send({
        error: 'Authorization header is required'
      })
    }

    // Verificar se o token está no formato correto (Bearer <token>)
    const parts = authHeader.split(' ')
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return reply.status(401).send({
        error: 'Authorization header must be in format: Bearer <token>'
      })
    }

    const token = parts[1]

    console.log('Verifying user JWT token...')
    
    // Verificar e decodificar o JWT token
    const decoded = jwt.verify(token, env.JWT_SECRET) as UserJWTPayload

    console.log('User token decoded successfully:', decoded)

    // Verificar se é um token de usuário
    if (decoded.type !== 'user') {
      console.log('Invalid token type:', decoded.type)
      return reply.status(401).send({
        error: 'Invalid token type, user token required'
      })
    }

    // Adicionar as informações do usuário ao request
    request.user = decoded

    console.log('Authenticated user:', decoded.userId)
  } catch (error) {
    console.error('JWT verification error:', error)
    if (error instanceof jwt.JsonWebTokenError) {
      return reply.status(401).send({
        error: 'Invalid or expired token'
      })
    }

    console.error('User auth middleware error:', error)
    return reply.status(500).send({
      error: 'Authentication failed'
    })
  }
}
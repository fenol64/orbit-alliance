import type { FastifyRequest, FastifyReply } from 'fastify'
import jwt from 'jsonwebtoken'
import { env } from '../env.js'

export interface UserJWTPayload {
  userId: string
  email: string
  type: 'user'
  iat?: number
  exp?: number
}

// Declarar o tipo para request.teacher
declare module 'fastify' {
  interface FastifyRequest {
    teacher?: UserJWTPayload & {
      institutionId: string
      role: string
    }
  }
}

export async function teacherMiddleware(request: FastifyRequest, reply: FastifyReply) {
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

    console.log('Verifying User JWT token...')
    
    // Verificar e decodificar o JWT token
    const decoded = jwt.verify(token, env.JWT_SECRET) as UserJWTPayload

    console.log('User token decoded successfully:', decoded)

    // Verificar se é um token de usuário
    if (decoded.type !== 'user') {
      console.log('Invalid token type:', decoded.type)
      return reply.status(401).send({
        error: 'Invalid token type - user token required'
      })
    }

    // Aqui precisamos verificar se o usuário é professor em alguma instituição
    // Vamos importar o modelo necessário
    const { InstitutionModel } = await import('../models/institution.model.js')
    
    // Buscar se o usuário é professor em alguma instituição
    const userInstitutions = await InstitutionModel.findUserInstitutions(decoded.userId)
    
    // Filtrar apenas instituições onde o usuário é professor
    const teacherInstitutions = userInstitutions.filter(
      (inst: any) => inst.role === 'teacher' && !inst.leftAt && !inst.deletedAt
    )

    if (teacherInstitutions.length === 0) {
      return reply.status(403).send({
        error: 'User is not a teacher in any institution'
      })
    }

    // Para simplificar, vamos usar a primeira instituição onde ele é professor
    // Em um sistema mais complexo, poderia ser passado como parâmetro qual instituição usar
    const primaryTeacherInstitution = teacherInstitutions[0]

    // Adicionar as informações do professor ao request
    request.teacher = {
      ...decoded,
      institutionId: primaryTeacherInstitution.institutionId,
      role: primaryTeacherInstitution.role
    }

    console.log('Authenticated teacher:', {
      userId: decoded.userId,
      institutionId: primaryTeacherInstitution.institutionId
    })
  } catch (error) {
    console.error('JWT verification error:', error)
    if (error instanceof jwt.JsonWebTokenError) {
      return reply.status(401).send({
        error: 'Invalid or expired token'
      })
    }

    console.error('Teacher middleware error:', error)
    return reply.status(500).send({
      error: 'Authentication failed'
    })
  }
}
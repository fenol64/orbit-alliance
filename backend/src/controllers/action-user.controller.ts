import type { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { ActionUserService } from '../services/action-user.service.js'

// Schema de validação para declaração de ação
const declareActionSchema = z.object({
  studentEmail: z.string().email('Invalid email format'),
  actionId: z.string().min(1, 'Action ID is required'),
  executedAt: z.string().datetime().optional(),
})

export class ActionUserController {
  // POST /action-executions/declare
  static async declareActionExecution(
    request: FastifyRequest,
    reply: FastifyReply
  ) {
    try {
      const validatedData = declareActionSchema.parse(request.body)
      
      // Extrair informações do professor do token JWT (vem do teacherMiddleware)
      const teacher = (request as any).teacher
      
      if (!teacher) {
        return reply.status(401).send({
          error: 'Teacher authentication required',
        })
      }

      // Converter executedAt de string para Date se fornecido
      const declareData = {
        ...validatedData,
        executedAt: validatedData.executedAt ? new Date(validatedData.executedAt) : undefined,
      }

      const result = await ActionUserService.declareActionExecution(
        teacher.userId,
        teacher.institutionId,
        declareData
      )

      if (!result.success) {
        return reply.status(400).send({
          error: result.error,
        })
      }

      return reply.status(201).send({
        message: 'Action execution declared successfully',
        data: result.data,
      })
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({
          error: 'Validation error',
          details: error.errors,
        })
      }

      console.error('Error in declareActionExecution:', error)
      return reply.status(500).send({
        error: 'Internal server error',
      })
    }
  }

  // GET /action-executions/student/:studentId
  static async getStudentActions(
    request: FastifyRequest,
    reply: FastifyReply
  ) {
    try {
      const { studentId } = request.params as any
      const { institutionId } = request.query as any

      const result = await ActionUserService.getStudentActions(studentId, institutionId)

      if (!result.success) {
        return reply.status(400).send({
          error: result.error,
        })
      }

      return reply.status(200).send({
        data: result.data,
      })
    } catch (error) {
      console.error('Error in getStudentActions:', error)
      return reply.status(500).send({
        error: 'Internal server error',
      })
    }
  }

  // GET /action-executions/institution
  static async getInstitutionActionExecutions(
    request: FastifyRequest,
    reply: FastifyReply
  ) {
    try {
      // Extrair institutionId do token JWT (pode vir do authMiddleware ou teacherMiddleware)
      const teacher = (request as any).teacher
      const institution = (request as any).user
      
      const institutionId = teacher?.institutionId || institution?.institutionId
      
      if (!institutionId) {
        return reply.status(401).send({
          error: 'Institution authentication required',
        })
      }

      const result = await ActionUserService.getInstitutionActionExecutions(institutionId)

      if (!result.success) {
        return reply.status(400).send({
          error: result.error,
        })
      }

      return reply.status(200).send({
        data: result.data,
      })
    } catch (error) {
      console.error('Error in getInstitutionActionExecutions:', error)
      return reply.status(500).send({
        error: 'Internal server error',
      })
    }
  }
}
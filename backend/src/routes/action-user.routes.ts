import type { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { ActionUserController } from '../controllers/action-user.controller.js'
import { teacherMiddleware } from '../middleware/teacher.middleware.js'
import { authMiddleware } from '../middleware/auth.middleware.js'

export async function actionUserRoutes(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>()

  // POST /action-executions/declare - Declarar execução de ação (apenas professores)
  app.post(
    '/action-executions/declare',
    {
      preHandler: teacherMiddleware,
      schema: {
        description: 'Declare that a student executed an action (teachers only)',
        tags: ['Action Executions'],
        security: [{ bearerAuth: [] }],
        body: z.object({
          studentEmail: z.string().email().describe('Email of the student who executed the action'),
          actionId: z.string().describe('ID of the action that was executed'),
          executedAt: z.string().datetime().optional().describe('When the action was executed (defaults to now)'),
        }),
        response: {
          201: z.object({
            message: z.string(),
            data: z.object({
              id: z.string(),
              student: z.object({
                id: z.string(),
                name: z.string(),
                email: z.string(),
              }),
              action: z.object({
                id: z.string(),
                name: z.string(),
                description: z.string().nullable(),
                reward: z.number(),
              }),
              institution: z.object({
                id: z.string(),
                name: z.string(),
              }),
              executedAt: z.string(),
              createdAt: z.string(),
            }),
          }),
          400: z.object({
            error: z.string(),
          }),
          401: z.object({
            error: z.string(),
          }),
          403: z.object({
            error: z.string(),
          }),
        },
      },
    },
    ActionUserController.declareActionExecution
  )

  // GET /action-executions/student/:studentId - Buscar ações executadas por um estudante
  app.get(
    '/action-executions/student/:studentId',
    {
      schema: {
        description: 'Get actions executed by a specific student',
        tags: ['Action Executions'],
        params: z.object({
          studentId: z.string().describe('ID of the student'),
        }),
        querystring: z.object({
          institutionId: z.string().optional().describe('Filter by institution ID'),
        }),
        response: {
          200: z.object({
            data: z.array(z.object({
              id: z.string(),
              action: z.object({
                id: z.string(),
                name: z.string(),
                description: z.string().nullable(),
                reward: z.number(),
              }),
              institution: z.object({
                id: z.string(),
                name: z.string(),
              }),
              executedAt: z.string(),
              createdAt: z.string(),
            })),
          }),
          400: z.object({
            error: z.string(),
          }),
        },
      },
    },
    ActionUserController.getStudentActions
  )

  // GET /action-executions/institution - Buscar todas as execuções de ação de uma instituição
  app.get(
    '/action-executions/institution',
    {
      preHandler: [authMiddleware],
      schema: {
        description: 'Get all action executions for an institution',
        tags: ['Action Executions'],
        security: [{ bearerAuth: [] }],
        response: {
          200: z.object({
            data: z.array(z.object({
              id: z.string(),
              student: z.object({
                id: z.string(),
                name: z.string(),
                email: z.string(),
              }),
              action: z.object({
                id: z.string(),
                name: z.string(),
                description: z.string().nullable(),
                reward: z.number(),
              }),
              executedAt: z.string(),
              createdAt: z.string(),
            })),
          }),
          400: z.object({
            error: z.string(),
          }),
          401: z.object({
            error: z.string(),
          }),
        },
      },
    },
    ActionUserController.getInstitutionActionExecutions
  )
}
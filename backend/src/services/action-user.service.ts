import { ActionUserModel, type CreateActionUserData } from '../models/action-user.model.js'
import { ActionModel } from '../models/action.model.js'
import { InstitutionModel } from '../models/institution.model.js'

export interface ActionUserServiceResponse<T = any> {
  success: boolean
  data?: T
  error?: string
}

export interface DeclareActionData {
  studentEmail: string
  actionId: string
  executedAt?: Date
}

export class ActionUserService {
  static async declareActionExecution(
    teacherId: string,
    teacherInstitutionId: string,
    data: DeclareActionData
  ): Promise<ActionUserServiceResponse<any>> {
    try {
      console.log('Declaring action execution:', {
        teacherId,
        teacherInstitutionId,
        data,
      })

      // 1. Verificar se a ação existe e pertence à mesma instituição do professor
      const action = await ActionModel.findById(data.actionId)
      if (!action) {
        return {
          success: false,
          error: 'Action not found',
        }
      }

      if (action.institutionId !== teacherInstitutionId) {
        return {
          success: false,
          error: 'Action does not belong to your institution',
        }
      }

      // 2. Verificar se o usuário (estudante) existe
      const student = await InstitutionModel.findUserByEmail(data.studentEmail)
      if (!student) {
        return {
          success: false,
          error: 'Student not found',
        }
      }

      // 3. Verificar se o estudante está vinculado à mesma instituição do professor
      const studentInstitutionLink = await InstitutionModel.findInstitutionUser(
        student.id,
        teacherInstitutionId
      )

      if (!studentInstitutionLink || studentInstitutionLink.leftAt || studentInstitutionLink.deletedAt) {
        return {
          success: false,
          error: 'Student is not active in your institution',
        }
      }

      // 4. Verificar se o estudante tem role "comum" (não é professor)
      if (studentInstitutionLink.role !== 'comum') {
        return {
          success: false,
          error: 'Only students with "comum" role can have actions declared for them',
        }
      }

      // 6. Criar o registro de execução da ação
      const executedAt = data.executedAt || new Date()
      
      const actionUserData: CreateActionUserData = {
        userId: student.id,
        actionId: data.actionId,
        institutionId: teacherInstitutionId,
        executedAt,
      }

      const actionUser = await ActionUserModel.create(actionUserData)

      console.log('Action execution declared successfully:', actionUser.id)

      return {
        success: true,
        data: {
          id: actionUser.id,
          student: {
            id: actionUser.user.id,
            name: actionUser.user.name,
            email: actionUser.user.email,
          },
          action: {
            id: actionUser.action.id,
            name: actionUser.action.name,
            description: actionUser.action.description,
            reward: actionUser.action.reward,
          },
          institution: {
            id: actionUser.institution.id,
            name: actionUser.institution.name,
          },
          executedAt: actionUser.executedAt.toISOString(),
          createdAt: actionUser.createdAt.toISOString(),
        },
      }
    } catch (error) {
      console.error('Error declaring action execution:', error)
      return {
        success: false,
        error: 'Failed to declare action execution',
      }
    }
  }

  static async getStudentActions(
    studentId: string,
    institutionId?: string
  ): Promise<ActionUserServiceResponse<any[]>> {
    try {
      let actions
      
      if (institutionId) {
        actions = await ActionUserModel.findUserActionsByInstitution(studentId, institutionId)
      } else {
        actions = await ActionUserModel.findByUser(studentId)
      }

      const formattedActions = actions.map(actionUser => ({
        id: actionUser.id,
        action: actionUser.action,
        institution: actionUser.institution,
        executedAt: actionUser.executedAt.toISOString(),
        createdAt: actionUser.createdAt.toISOString(),
      }))

      return {
        success: true,
        data: formattedActions,
      }
    } catch (error) {
      console.error('Error getting student actions:', error)
      return {
        success: false,
        error: 'Failed to get student actions',
      }
    }
  }

  static async getInstitutionActionExecutions(
    institutionId: string
  ): Promise<ActionUserServiceResponse<any[]>> {
    try {
      const executions = await ActionUserModel.findByInstitution(institutionId)

      const formattedExecutions = executions.map(execution => ({
        id: execution.id,
        student: execution.user,
        action: execution.action,
        executedAt: execution.executedAt.toISOString(),
        createdAt: execution.createdAt.toISOString(),
      }))

      return {
        success: true,
        data: formattedExecutions,
      }
    } catch (error) {
      console.error('Error getting institution action executions:', error)
      return {
        success: false,
        error: 'Failed to get action executions',
      }
    }
  }
}
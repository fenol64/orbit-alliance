import { ActionModel, type CreateActionData, type CreateActionDataWithInstitution, type UpdateActionData } from '../models/action.model.js'
import { InstitutionModel } from '../models/institution.model.js'
import type { Action } from '@prisma/client'

export interface ActionServiceResponse<T = any> {
  success: boolean
  data?: T
  error?: string
}

export class ActionService {
  static async createAction(data: CreateActionData, institutionId: string): Promise<ActionServiceResponse<Action>> {
    try {
      console.log('Creating action with data:', { name: data.name, reward: data.reward, institutionId })
      
      // Verificar se a instituição existe
      const institution = await InstitutionModel.findById(institutionId)
      if (!institution) {
        console.log('Institution not found:', institutionId)
        return {
          success: false,
          error: 'Institution not found',
        }
      }

      // Validar recompensa
      if (data.reward < 0) {
        return {
          success: false,
          error: 'Reward must be a positive number',
        }
      }

      // Criar a action
      console.log('Creating action in database...')
      const actionData: CreateActionDataWithInstitution = {
        ...data,
        institutionId,
      }
      const action = await ActionModel.create(actionData)

      console.log('Action created successfully:', action.id)

      return {
        success: true,
        data: {
          ...action,
          createdAt: action.createdAt.toISOString(),
          updatedAt: action.updatedAt.toISOString(),
        } as any,
      }
    } catch (error) {
      console.error('Error creating action:', error)
      console.error('Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        data: { ...data, institutionId },
      })
      return {
        success: false,
        error: `Failed to create action: ${error instanceof Error ? error.message : 'Unknown error'}`,
      }
    }
  }

  static async getActionById(id: string): Promise<ActionServiceResponse<Action>> {
    try {
      const action = await ActionModel.findById(id)
      
      if (!action) {
        return {
          success: false,
          error: 'Action not found',
        }
      }

      return {
        success: true,
        data: {
          ...action,
          createdAt: action.createdAt.toISOString(),
          updatedAt: action.updatedAt.toISOString(),
        } as any,
      }
    } catch (error) {
      return {
        success: false,
        error: 'Failed to fetch action',
      }
    }
  }

  static async getAllActions(): Promise<ActionServiceResponse<Action[]>> {
    try {
      const actions = await ActionModel.findAll()
      
      // Converter datas para strings
      const actionsWithStringDates = actions.map(action => ({
        ...action,
        createdAt: action.createdAt.toISOString(),
        updatedAt: action.updatedAt.toISOString(),
      }))

      return {
        success: true,
        data: actionsWithStringDates as any[],
      }
    } catch (error) {
      return {
        success: false,
        error: 'Failed to fetch actions',
      }
    }
  }

  static async getActionsByInstitution(institutionId: string): Promise<ActionServiceResponse<Action[]>> {
    try {
      // Verificar se a instituição existe
      const institution = await InstitutionModel.findById(institutionId)
      if (!institution) {
        return {
          success: false,
          error: 'Institution not found',
        }
      }

      const actions = await ActionModel.findByInstitution(institutionId)
      
      // Converter datas para strings
      const actionsWithStringDates = actions.map(action => ({
        ...action,
        createdAt: action.createdAt.toISOString(),
        updatedAt: action.updatedAt.toISOString(),
      }))

      return {
        success: true,
        data: actionsWithStringDates as any[],
      }
    } catch (error) {
      return {
        success: false,
        error: 'Failed to fetch actions',
      }
    }
  }

  static async getPublicActions(): Promise<ActionServiceResponse<any[]>> {
    try {
      const actions = await ActionModel.findPublicActions()
      
      // Converter datas para strings
      const actionsWithStringDates = actions.map(action => ({
        ...action,
        createdAt: action.createdAt.toISOString(),
        updatedAt: action.updatedAt.toISOString(),
      }))

      return {
        success: true,
        data: actionsWithStringDates,
      }
    } catch (error) {
      return {
        success: false,
        error: 'Failed to fetch public actions',
      }
    }
  }

  static async updateAction(id: string, data: UpdateActionData): Promise<ActionServiceResponse<Action>> {
    try {
      // Verificar se a action existe
      const existingAction = await ActionModel.findById(id)
      if (!existingAction) {
        return {
          success: false,
          error: 'Action not found',
        }
      }

      // Validar recompensa se está sendo alterada
      if (data.reward !== undefined && data.reward < 0) {
        return {
          success: false,
          error: 'Reward must be a positive number',
        }
      }

      const updatedAction = await ActionModel.update(id, data)
      
      if (!updatedAction) {
        return {
          success: false,
          error: 'Failed to update action',
        }
      }

      return {
        success: true,
        data: {
          ...updatedAction,
          createdAt: updatedAction.createdAt.toISOString(),
          updatedAt: updatedAction.updatedAt.toISOString(),
        } as any,
      }
    } catch (error) {
      return {
        success: false,
        error: 'Failed to update action',
      }
    }
  }

  static async deleteAction(id: string): Promise<ActionServiceResponse<boolean>> {
    try {
      const action = await ActionModel.delete(id)
      
      if (!action) {
        return {
          success: false,
          error: 'Action not found',
        }
      }

      return {
        success: true,
        data: true,
      }
    } catch (error) {
      return {
        success: false,
        error: 'Failed to delete action',
      }
    }
  }

  static async getActionWithDetails(id: string): Promise<ActionServiceResponse<any>> {
    try {
      const action = await ActionModel.findWithInstitution(id)
      
      if (!action) {
        return {
          success: false,
          error: 'Action not found',
        }
      }

      return {
        success: true,
        data: {
          ...action,
          createdAt: action.createdAt.toISOString(),
          updatedAt: action.updatedAt.toISOString(),
        },
      }
    } catch (error) {
      return {
        success: false,
        error: 'Failed to fetch action details',
      }
    }
  }

  static async getActionUsers(id: string): Promise<ActionServiceResponse<any>> {
    try {
      const action = await ActionModel.findWithUsers(id)
      
      if (!action) {
        return {
          success: false,
          error: 'Action not found',
        }
      }

      return {
        success: true,
        data: {
          ...action,
          createdAt: action.createdAt.toISOString(),
          updatedAt: action.updatedAt.toISOString(),
        },
      }
    } catch (error) {
      return {
        success: false,
        error: 'Failed to fetch action users',
      }
    }
  }

  static async searchActions(query: string): Promise<ActionServiceResponse<any[]>> {
    try {
      if (!query || query.trim().length < 2) {
        return {
          success: false,
          error: 'Search query must be at least 2 characters long',
        }
      }

      const actions = await ActionModel.searchActions(query.trim())
      
      // Converter datas para strings
      const actionsWithStringDates = actions.map(action => ({
        ...action,
        createdAt: action.createdAt.toISOString(),
        updatedAt: action.updatedAt.toISOString(),
      }))

      return {
        success: true,
        data: actionsWithStringDates,
      }
    } catch (error) {
      return {
        success: false,
        error: 'Failed to search actions',
      }
    }
  }
}
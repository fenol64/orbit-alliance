import { InstitutionModel, type CreateInstitutionData, type UpdateInstitutionData } from '../models/institution.model.js'
import type { Institution } from '@prisma/client'
import bcrypt from 'bcrypt'

export interface InstitutionServiceResponse<T = any> {
  success: boolean
  data?: T
  error?: string
}

export class InstitutionService {
  static async createInstitution(data: CreateInstitutionData): Promise<InstitutionServiceResponse<Institution>> {
    try {
      console.log('Creating institution with data:', { email: data.email, name: data.name })
      
      // Verificar se já existe uma instituição com o mesmo email
      const existingInstitution = await InstitutionModel.findByEmail(data.email)
      if (existingInstitution) {
        console.log('Institution with email already exists:', data.email)
        return {
          success: false,
          error: 'Email already registered',
        }
      }

      // Hash da senha
      console.log('Hashing password...')
      const hashedPassword = await bcrypt.hash(data.password, 10)

      // Criar a instituição
      console.log('Creating institution in database...')
      const institution = await InstitutionModel.create({
        ...data,
        password: hashedPassword,
      })

      console.log('Institution created successfully:', institution.id)

      // Remover a senha do retorno por segurança e converter datas para strings
      const { password, ...institutionWithoutPassword } = institution

      return {
        success: true,
        data: {
          ...institutionWithoutPassword,
          createdAt: institutionWithoutPassword.createdAt.toISOString(),
          updatedAt: institutionWithoutPassword.updatedAt.toISOString(),
        } as any,
      }
    } catch (error) {
      console.error('Error creating institution:', error)
      console.error('Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        data,
      })
      return {
        success: false,
        error: `Failed to create institution: ${error instanceof Error ? error.message : 'Unknown error'}`,
      }
    }
  }

  static async getInstitutionById(id: string): Promise<InstitutionServiceResponse<Institution>> {
    try {
      const institution = await InstitutionModel.findById(id)
      
      if (!institution) {
        return {
          success: false,
          error: 'Institution not found',
        }
      }

      // Remover a senha do retorno por segurança e converter datas para strings
      const { password, ...institutionWithoutPassword } = institution

      return {
        success: true,
        data: {
          ...institutionWithoutPassword,
          createdAt: institutionWithoutPassword.createdAt.toISOString(),
          updatedAt: institutionWithoutPassword.updatedAt.toISOString(),
        } as any,
      }
    } catch (error) {
      return {
        success: false,
        error: 'Failed to fetch institution',
      }
    }
  }

  static async getAllInstitutions(): Promise<InstitutionServiceResponse<Institution[]>> {
    try {
      const institutions = await InstitutionModel.findAll()
      
      // Remover senhas de todas as instituições e converter datas para strings
      const institutionsWithoutPassword = institutions.map(({ password, ...institution }) => ({
        ...institution,
        createdAt: institution.createdAt.toISOString(),
        updatedAt: institution.updatedAt.toISOString(),
      }))

      return {
        success: true,
        data: institutionsWithoutPassword as any[],
      }
    } catch (error) {
      return {
        success: false,
        error: 'Failed to fetch institutions',
      }
    }
  }

  static async updateInstitution(id: string, data: UpdateInstitutionData): Promise<InstitutionServiceResponse<Institution>> {
    try {
      // Verificar se a instituição existe
      const existingInstitution = await InstitutionModel.findById(id)
      if (!existingInstitution) {
        return {
          success: false,
          error: 'Institution not found',
        }
      }

      // Se está alterando o email, verificar se já não existe outro com o mesmo email
      if (data.email && data.email !== existingInstitution.email) {
        const institutionWithSameEmail = await InstitutionModel.findByEmail(data.email)
        if (institutionWithSameEmail) {
          return {
            success: false,
            error: 'Email already registered',
          }
        }
      }

      // Se está alterando a senha, fazer o hash
      const updateData = { ...data }
      if (data.password) {
        updateData.password = await bcrypt.hash(data.password, 10)
      }

      const updatedInstitution = await InstitutionModel.update(id, updateData)
      
      if (!updatedInstitution) {
        return {
          success: false,
          error: 'Failed to update institution',
        }
      }

      // Remover a senha do retorno por segurança e converter datas para strings
      const { password, ...institutionWithoutPassword } = updatedInstitution

      return {
        success: true,
        data: {
          ...institutionWithoutPassword,
          createdAt: institutionWithoutPassword.createdAt.toISOString(),
          updatedAt: institutionWithoutPassword.updatedAt.toISOString(),
        } as any,
      }
    } catch (error) {
      return {
        success: false,
        error: 'Failed to update institution',
      }
    }
  }

  static async deleteInstitution(id: string): Promise<InstitutionServiceResponse<boolean>> {
    try {
      const institution = await InstitutionModel.delete(id)
      
      if (!institution) {
        return {
          success: false,
          error: 'Institution not found',
        }
      }

      return {
        success: true,
        data: true,
      }
    } catch (error) {
      return {
        success: false,
        error: 'Failed to delete institution',
      }
    }
  }

  static async getInstitutionWithDetails(id: string): Promise<InstitutionServiceResponse<any>> {
    try {
      const institution = await InstitutionModel.findWithUsers(id)
      
      if (!institution) {
        return {
          success: false,
          error: 'Institution not found',
        }
      }

      // Remover a senha do retorno por segurança
      const { password, ...institutionWithoutPassword } = institution

      return {
        success: true,
        data: institutionWithoutPassword,
      }
    } catch (error) {
      return {
        success: false,
        error: 'Failed to fetch institution details',
      }
    }
  }

  static async authenticateInstitution(email: string, password: string): Promise<InstitutionServiceResponse<Institution>> {
    try {
      const institution = await InstitutionModel.findByEmail(email)
      
      if (!institution) {
        return {
          success: false,
          error: 'Invalid credentials',
        }
      }

      const isPasswordValid = await bcrypt.compare(password, institution.password)
      
      if (!isPasswordValid) {
        return {
          success: false,
          error: 'Invalid credentials',
        }
      }

      // Remover a senha do retorno por segurança e converter datas para strings
      const { password: _, ...institutionWithoutPassword } = institution

      return {
        success: true,
        data: {
          ...institutionWithoutPassword,
          createdAt: institutionWithoutPassword.createdAt.toISOString(),
          updatedAt: institutionWithoutPassword.updatedAt.toISOString(),
        } as any,
      }
    } catch (error) {
      return {
        success: false,
        error: 'Authentication failed',
      }
    }
  }
}
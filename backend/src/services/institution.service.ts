import { InstitutionModel, type CreateInstitutionData, type UpdateInstitutionData } from '../models/institution.model.js'
import type { Institution } from '@prisma/client'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { env } from '../env.js'

export interface InstitutionServiceResponse<T = any> {
  success: boolean
  data?: T
  error?: string
}

export interface LoginData {
  email: string
  password: string
}

export interface LoginResponse {
  institution: {
    id: string
    name: string
    email: string
    createdAt: string
    updatedAt: string
  }
  token: string
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

  static async getInstitutionUsers(institutionId: string): Promise<InstitutionServiceResponse<any[]>> {
    try {
      // Verificar se a instituição existe
      const institution = await InstitutionModel.findById(institutionId)
      if (!institution) {
        return {
          success: false,
          error: 'Institution not found',
        }
      }

      // Buscar todos os usuários da instituição
      const institutionUsers = await InstitutionModel.findInstitutionUsers(institutionId)

      // Formatar os dados para o formato desejado
      const formattedUsers = institutionUsers.map(iu => ({
        user: {
          ...iu.user,
          createdAt: iu.user.createdAt.toISOString(),
          updatedAt: iu.user.updatedAt.toISOString(),
        },
        role: iu.role,
        joinedAt: iu.joinedAt.toISOString(),
        leftAt: iu.leftAt ? iu.leftAt.toISOString() : null,
      }))

      return {
        success: true,
        data: formattedUsers,
      }
    } catch (error) {
      console.error('Error fetching institution users:', error)
      return {
        success: false,
        error: 'Failed to fetch institution users',
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

  static async login(data: LoginData): Promise<InstitutionServiceResponse<LoginResponse>> {
    try {
      console.log('Attempting login for institution:', data.email)

      // Validar email
      if (!data.email || !data.email.includes('@')) {
        return {
          success: false,
          error: 'Invalid email format',
        }
      }

      // Validar senha
      if (!data.password || data.password.length < 6) {
        return {
          success: false,
          error: 'Password must be at least 6 characters',
        }
      }

      // Buscar instituição pelo email
      const institution = await InstitutionModel.findByEmail(data.email)
      if (!institution) {
        return {
          success: false,
          error: 'Invalid credentials',
        }
      }

      console.log('Institution found, validating password...')

      // Verificar senha
      const isPasswordValid = await bcrypt.compare(data.password, institution.password)
      if (!isPasswordValid) {
        return {
          success: false,
          error: 'Invalid credentials',
        }
      }

      console.log('Password valid, generating JWT token...')

      // Gerar JWT token
      const token = jwt.sign(
        { 
          institutionId: institution.id,
          email: institution.email,
          type: 'institution'
        },
        env.JWT_SECRET,
        { expiresIn: '24h' }
      )

      console.log('Login successful for institution:', institution.id)

      // Remover a senha do retorno
      const { password: _, ...institutionWithoutPassword } = institution

      return {
        success: true,
        data: {
          institution: {
            ...institutionWithoutPassword,
            createdAt: institutionWithoutPassword.createdAt.toISOString(),
            updatedAt: institutionWithoutPassword.updatedAt.toISOString(),
          },
          token,
        },
      }
    } catch (error) {
      console.error('Error during login:', error)
      return {
        success: false,
        error: 'Login failed',
      }
    }
  }

  static async linkUser(institutionId: string, email: string, role: string): Promise<InstitutionServiceResponse<any>> {
    try {
      console.log('Linking user to institution:', { institutionId, email, role })

      // Verificar se a instituição existe
      const institution = await InstitutionModel.findById(institutionId)
      if (!institution) {
        return {
          success: false,
          error: 'Institution not found',
        }
      }

      // Verificar se o usuário existe pelo email
      const user = await InstitutionModel.findUserByEmail(email)
      if (!user) {
        return {
          success: false,
          error: 'User not found',
        }
      }

      // Verificar se o usuário já está vinculado à instituição
      const existingLink = await InstitutionModel.findInstitutionUser(user.id, institutionId)
      if (existingLink && !existingLink.leftAt) {
        return {
          success: false,
          error: 'User is already linked to this institution',
        }
      }

      // Criar a vinculação
      const institutionUser = await InstitutionModel.createInstitutionUser({
        userId: user.id,
        institutionId,
        role,
        joinedAt: new Date(),
      })

      console.log('User linked successfully:', institutionUser)

      return {
        success: true,
        data: {
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
          },
          role,
          joinedAt: institutionUser.joinedAt.toISOString(),
        },
      }
    } catch (error) {
      console.error('Error linking user:', error)
      return {
        success: false,
        error: 'Failed to link user',
      }
    }
  }
}
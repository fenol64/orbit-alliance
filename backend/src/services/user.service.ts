import { UserModel, type CreateUserData, type UpdateUserData } from '../models/user.model.js'
import type { User } from '@prisma/client'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { env } from '../env.js'

export interface UserServiceResponse<T = any> {
  success: boolean
  data?: T
  error?: string
}

export interface LoginData {
  email: string
  password: string
}

export interface LoginResponse {
  user: {
    id: string
    name: string
    email: string
    wallet: string
    createdAt: string
    updatedAt: string
  }
  token: string
}

export class UserService {
  static async createUser(data: CreateUserData): Promise<UserServiceResponse<User>> {
    try {
      console.log('Creating user with data:', { email: data.email, name: data.name, wallet: data.wallet })
      
      // Verificar se já existe um usuário com o mesmo email
      const existingUserByEmail = await UserModel.findByEmail(data.email)
      if (existingUserByEmail) {
        console.log('User with email already exists:', data.email)
        return {
          success: false,
          error: 'Email already registered',
        }
      }

      // Verificar se já existe um usuário com a mesma wallet
      const existingUserByWallet = await UserModel.findByWallet(data.wallet)
      if (existingUserByWallet) {
        console.log('User with wallet already exists:', data.wallet)
        return {
          success: false,
          error: 'Wallet already registered',
        }
      }

      // Hash da senha
      console.log('Hashing password...')
      const hashedPassword = await bcrypt.hash(data.password, 10)

      // Criar o usuário
      console.log('Creating user in database...')
      const user = await UserModel.create({
        ...data,
        password: hashedPassword,
      })

      console.log('User created successfully:', user.id)

      // Remover a senha do retorno por segurança e converter datas para strings
      const { password, ...userWithoutPassword } = user

      return {
        success: true,
        data: {
          ...userWithoutPassword,
          createdAt: userWithoutPassword.createdAt.toISOString(),
          updatedAt: userWithoutPassword.updatedAt.toISOString(),
        } as any,
      }
    } catch (error) {
      console.error('Error creating user:', error)
      console.error('Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        data,
      })
      return {
        success: false,
        error: `Failed to create user: ${error instanceof Error ? error.message : 'Unknown error'}`,
      }
    }
  }

  static async getUserById(id: string): Promise<UserServiceResponse<User>> {
    try {
      const user = await UserModel.findById(id)
      
      if (!user) {
        return {
          success: false,
          error: 'User not found',
        }
      }

      // Remover a senha do retorno por segurança e converter datas para strings
      const { password, ...userWithoutPassword } = user

      return {
        success: true,
        data: {
          ...userWithoutPassword,
          createdAt: userWithoutPassword.createdAt.toISOString(),
          updatedAt: userWithoutPassword.updatedAt.toISOString(),
        } as any,
      }
    } catch (error) {
      return {
        success: false,
        error: 'Failed to fetch user',
      }
    }
  }

  static async getAllUsers(): Promise<UserServiceResponse<User[]>> {
    try {
      const users = await UserModel.findAll()
      
      // Remover senhas de todos os usuários e converter datas para strings
      const usersWithoutPassword = users.map(({ password, ...user }) => ({
        ...user,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
      }))

      return {
        success: true,
        data: usersWithoutPassword as any[],
      }
    } catch (error) {
      return {
        success: false,
        error: 'Failed to fetch users',
      }
    }
  }

  static async updateUser(id: string, data: UpdateUserData): Promise<UserServiceResponse<User>> {
    try {
      // Verificar se o usuário existe
      const existingUser = await UserModel.findById(id)
      if (!existingUser) {
        return {
          success: false,
          error: 'User not found',
        }
      }

      // Se está alterando o email, verificar se já não existe outro com o mesmo email
      if (data.email && data.email !== existingUser.email) {
        const userWithSameEmail = await UserModel.findByEmail(data.email)
        if (userWithSameEmail) {
          return {
            success: false,
            error: 'Email already registered',
          }
        }
      }

      // Se está alterando a wallet, verificar se já não existe outro com a mesma wallet
      if (data.wallet && data.wallet !== existingUser.wallet) {
        const userWithSameWallet = await UserModel.findByWallet(data.wallet)
        if (userWithSameWallet) {
          return {
            success: false,
            error: 'Wallet already registered',
          }
        }
      }

      // Se está alterando a senha, fazer o hash
      const updateData = { ...data }
      if (data.password) {
        updateData.password = await bcrypt.hash(data.password, 10)
      }

      const updatedUser = await UserModel.update(id, updateData)
      
      if (!updatedUser) {
        return {
          success: false,
          error: 'Failed to update user',
        }
      }

      // Remover a senha do retorno por segurança e converter datas para strings
      const { password, ...userWithoutPassword } = updatedUser

      return {
        success: true,
        data: {
          ...userWithoutPassword,
          createdAt: userWithoutPassword.createdAt.toISOString(),
          updatedAt: userWithoutPassword.updatedAt.toISOString(),
        } as any,
      }
    } catch (error) {
      return {
        success: false,
        error: 'Failed to update user',
      }
    }
  }

  static async deleteUser(id: string): Promise<UserServiceResponse<boolean>> {
    try {
      const user = await UserModel.delete(id)
      
      if (!user) {
        return {
          success: false,
          error: 'User not found',
        }
      }

      return {
        success: true,
        data: true,
      }
    } catch (error) {
      return {
        success: false,
        error: 'Failed to delete user',
      }
    }
  }

  static async getUserWithDetails(id: string): Promise<UserServiceResponse<any>> {
    try {
      const user = await UserModel.findWithInstitutions(id)
      
      if (!user) {
        return {
          success: false,
          error: 'User not found',
        }
      }

      // Remover a senha do retorno por segurança e converter datas para strings
      const { password, ...userWithoutPassword } = user

      return {
        success: true,
        data: {
          ...userWithoutPassword,
          createdAt: userWithoutPassword.createdAt.toISOString(),
          updatedAt: userWithoutPassword.updatedAt.toISOString(),
        },
      }
    } catch (error) {
      return {
        success: false,
        error: 'Failed to fetch user details',
      }
    }
  }

  static async authenticateUser(email: string, password: string): Promise<UserServiceResponse<User>> {
    try {
      const user = await UserModel.findByEmail(email)
      
      if (!user) {
        return {
          success: false,
          error: 'Invalid credentials',
        }
      }

      const isPasswordValid = await bcrypt.compare(password, user.password)
      
      if (!isPasswordValid) {
        return {
          success: false,
          error: 'Invalid credentials',
        }
      }

      // Remover a senha do retorno por segurança e converter datas para strings
      const { password: _, ...userWithoutPassword } = user

      return {
        success: true,
        data: {
          ...userWithoutPassword,
          createdAt: userWithoutPassword.createdAt.toISOString(),
          updatedAt: userWithoutPassword.updatedAt.toISOString(),
        } as any,
      }
    } catch (error) {
      return {
        success: false,
        error: 'Authentication failed',
      }
    }
  }

  static async authenticateUserByWallet(wallet: string): Promise<UserServiceResponse<User>> {
    try {
      const user = await UserModel.findByWallet(wallet)
      
      if (!user) {
        return {
          success: false,
          error: 'Wallet not found',
        }
      }

      // Remover a senha do retorno por segurança e converter datas para strings
      const { password, ...userWithoutPassword } = user

      return {
        success: true,
        data: {
          ...userWithoutPassword,
          createdAt: userWithoutPassword.createdAt.toISOString(),
          updatedAt: userWithoutPassword.updatedAt.toISOString(),
        } as any,
      }
    } catch (error) {
      return {
        success: false,
        error: 'Authentication failed',
      }
    }
  }

  static async login(data: LoginData): Promise<UserServiceResponse<LoginResponse>> {
    try {
      console.log('Attempting user login for:', data.email)

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

      // Buscar usuário pelo email
      const user = await UserModel.findByEmail(data.email)
      if (!user) {
        return {
          success: false,
          error: 'Invalid credentials',
        }
      }

      console.log('User found, validating password...')

      // Verificar senha
      const isPasswordValid = await bcrypt.compare(data.password, user.password)
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
          userId: user.id,
          email: user.email,
          type: 'user'
        },
        env.JWT_SECRET,
        { expiresIn: '24h' }
      )

      console.log('Login successful for user:', user.id)

      // Remover a senha do retorno
      const { password: _, ...userWithoutPassword } = user

      return {
        success: true,
        data: {
          user: {
            id: userWithoutPassword.id,
            name: userWithoutPassword.name,
            email: userWithoutPassword.email,
            wallet: userWithoutPassword.wallet,
            createdAt: userWithoutPassword.createdAt.toISOString(),
            updatedAt: userWithoutPassword.updatedAt.toISOString(),
          },
          token,
        },
      }
    } catch (error) {
      console.error('Error during user login:', error)
      return {
        success: false,
        error: 'Login failed',
      }
    }
  }
}
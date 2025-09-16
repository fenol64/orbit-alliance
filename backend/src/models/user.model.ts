import { db } from '../db/client.js'
import type { User } from '@prisma/client'

export interface CreateUserData {
  name: string
  wallet: string
  email: string
  password: string
}

export interface UpdateUserData {
  name?: string
  wallet?: string
  email?: string
  password?: string
}

export class UserModel {
  static async create(data: CreateUserData): Promise<User> {
    return await db.user.create({
      data,
    })
  }

  static async findById(id: string): Promise<User | null> {
    return await db.user.findUnique({
      where: {
        id,
        deletedAt: null,
      },
    })
  }

  static async findByEmail(email: string): Promise<User | null> {
    return await db.user.findFirst({
      where: {
        email,
        deletedAt: null,
      },
    })
  }

  static async findByWallet(wallet: string): Promise<User | null> {
    return await db.user.findFirst({
      where: {
        wallet,
        deletedAt: null,
      },
    })
  }

  static async findAll(): Promise<User[]> {
    return await db.user.findMany({
      where: {
        deletedAt: null,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
  }

  static async update(id: string, data: UpdateUserData): Promise<User | null> {
    try {
      return await db.user.update({
        where: {
          id,
          deletedAt: null,
        },
        data: {
          ...data,
          updatedAt: new Date(),
        },
      })
    } catch (error) {
      return null
    }
  }

  static async delete(id: string): Promise<User | null> {
    try {
      return await db.user.update({
        where: {
          id,
          deletedAt: null,
        },
        data: {
          deletedAt: new Date(),
        },
      })
    } catch (error) {
      return null
    }
  }

  static async findWithInstitutions(id: string) {
    return await db.user.findUnique({
      where: {
        id,
        deletedAt: null,
      },
      include: {
        institutions: {
          where: {
            deletedAt: null,
          },
          include: {
            institution: {
              select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
              },
            },
          },
        },
        purchases: {
          where: {
            deletedAt: null,
          },
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                institutionId: true,
              },
            },
          },
        },
        actions: {
          where: {
            deletedAt: null,
          },
          include: {
            action: {
              select: {
                id: true,
                name: true,
                description: true,
                reward: true,
                institutionId: true,
              },
            },
          },
        },
      },
    })
  }
}
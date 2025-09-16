import { db } from '../db/client.js'
import type { Action } from '@prisma/client'

export interface CreateActionData {
  name: string
  description?: string
  reward: number
}

export interface CreateActionDataWithInstitution extends CreateActionData {
  institutionId: string
}

export interface UpdateActionData {
  name?: string
  description?: string
  reward?: number
}

export class ActionModel {
  static async create(data: CreateActionDataWithInstitution): Promise<Action> {
    return await db.action.create({
      data,
    })
  }

  static async findById(id: string): Promise<Action | null> {
    return await db.action.findUnique({
      where: {
        id,
        deletedAt: null,
      },
    })
  }

  static async findAll(): Promise<Action[]> {
    return await db.action.findMany({
      where: {
        deletedAt: null,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
  }

  static async findByInstitution(institutionId: string): Promise<Action[]> {
    return await db.action.findMany({
      where: {
        institutionId,
        deletedAt: null,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
  }

  static async update(id: string, data: UpdateActionData): Promise<Action | null> {
    try {
      return await db.action.update({
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

  static async delete(id: string): Promise<Action | null> {
    try {
      return await db.action.update({
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

  static async findWithInstitution(id: string): Promise<any | null> {
    return await db.action.findUnique({
      where: {
        id,
        deletedAt: null,
      },
      include: {
        institution: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })
  }

  static async findWithUsers(id: string): Promise<any | null> {
    return await db.action.findUnique({
      where: {
        id,
        deletedAt: null,
      },
      include: {
        users: {
          where: {
            deletedAt: null,
          },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
          orderBy: {
            executedAt: 'desc',
          },
        },
      },
    })
  }

  static async searchActions(query: string): Promise<any[]> {
    return await db.action.findMany({
      where: {
        deletedAt: null,
        OR: [
          {
            name: {
              contains: query,
              mode: 'insensitive',
            },
          },
          {
            description: {
              contains: query,
              mode: 'insensitive',
            },
          },
        ],
      },
      include: {
        institution: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
  }

  static async findPublicActions(): Promise<any[]> {
    // Actions públicas são todas as actions (diferente de produtos que têm flag isInternal)
    // Pode ser implementado um filtro específico se necessário
    return await db.action.findMany({
      where: {
        deletedAt: null,
      },
      include: {
        institution: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        reward: 'desc', // Ordenar por recompensa
      },
    })
  }
}
import { db } from '../db/client.js'

export interface CreateActionUserData {
  userId: string
  actionId: string
  institutionId: string
  executedAt: Date
}

export class ActionUserModel {
  static async create(data: CreateActionUserData) {
    return await db.actionUser.create({ 
      data,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        action: {
          select: {
            id: true,
            name: true,
            description: true,
            reward: true,
          },
        },
        institution: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })
  }

  static async findById(id: string) {
    return await db.actionUser.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        action: {
          select: {
            id: true,
            name: true,
            description: true,
            reward: true,
          },
        },
        institution: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })
  }

  static async findByUser(userId: string) {
    return await db.actionUser.findMany({
      where: { 
        userId,
        deletedAt: null,
      },
      include: {
        action: {
          select: {
            id: true,
            name: true,
            description: true,
            reward: true,
          },
        },
        institution: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        executedAt: 'desc',
      },
    })
  }

  static async findByAction(actionId: string) {
    return await db.actionUser.findMany({
      where: { 
        actionId,
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
        institution: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        executedAt: 'desc',
      },
    })
  }

  static async findByInstitution(institutionId: string) {
    return await db.actionUser.findMany({
      where: { 
        institutionId,
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
        action: {
          select: {
            id: true,
            name: true,
            description: true,
            reward: true,
          },
        },
      },
      orderBy: {
        executedAt: 'desc',
      },
    })
  }

  // Verificar se um usuário já executou uma ação específica
  static async findUserAction(userId: string, actionId: string) {
    return await db.actionUser.findFirst({
      where: {
        userId,
        actionId,
        deletedAt: null,
      },
    })
  }

  // Buscar execuções de ações por usuário em uma instituição específica
  static async findUserActionsByInstitution(userId: string, institutionId: string) {
    return await db.actionUser.findMany({
      where: {
        userId,
        institutionId,
        deletedAt: null,
      },
      include: {
        action: {
          select: {
            id: true,
            name: true,
            description: true,
            reward: true,
          },
        },
        institution: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        executedAt: 'desc',
      },
    })
  }
}
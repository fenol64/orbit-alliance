import { db } from '../db/client.js'
import type { Institution } from '@prisma/client'

export interface CreateInstitutionData {
  email: string
  password: string
  name: string
  wallet?: string
}

export interface UpdateInstitutionData {
  email?: string
  password?: string
  name?: string
  wallet?: string
}

export class InstitutionModel {
  static async create(data: CreateInstitutionData): Promise<Institution> {
    return await db.institution.create({
      data,
    })
  }

  static async findById(id: string): Promise<Institution | null> {
    return await db.institution.findUnique({
      where: {
        id,
        deletedAt: null,
      },
    })
  }

  static async findByEmail(email: string): Promise<Institution | null> {
    return await db.institution.findFirst({
      where: {
        email,
        deletedAt: null,
      },
    })
  }

  static async findAll(): Promise<Institution[]> {
    return await db.institution.findMany({
      where: {
        deletedAt: null,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
  }

  static async update(id: string, data: UpdateInstitutionData): Promise<Institution | null> {
    try {
      return await db.institution.update({
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

  static async delete(id: string): Promise<Institution | null> {
    try {
      return await db.institution.update({
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

  static async findWithUsers(id: string) {
    return await db.institution.findUnique({
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
                wallet: true,
                createdAt: true,
              },
            },
          },
        },
        products: {
          where: {
            deletedAt: null,
          },
        },
        actions: {
          where: {
            deletedAt: null,
          },
        },
      },
    })
  }

  static async findUserByEmail(email: string) {
    return await db.user.findFirst({
      where: {
        email,
        deletedAt: null,
      },
    })
  }

  static async findInstitutionUser(userId: string, institutionId: string) {
    return await db.institutionUser.findFirst({
      where: {
        userId,
        institutionId,
        deletedAt: null,
      },
    })
  }

  static async createInstitutionUser(data: {
    userId: string
    institutionId: string
    role: string
    joinedAt: Date
  }) {
    return await db.institutionUser.create({
      data,
    })
  }

  static async findUserInstitutions(userId: string) {
    return await db.institutionUser.findMany({
      where: {
        userId,
        deletedAt: null,
      },
      include: {
        institution: true,
      },
    })
  }
}
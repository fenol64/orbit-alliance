import { db } from '../db/client.js'
import type { Product } from '@prisma/client'

export interface CreateProductData {
  name: string
  price: number
  isInternal: boolean
  image?: string
  description?: string
}

export interface CreateProductDataWithInstitution extends CreateProductData {
  institutionId: string
}

export interface UpdateProductData {
  name?: string
  price?: number
  institutionId?: string
  isInternal?: boolean
  image?: string
  description?: string
}

export class ProductModel {
  static async create(data: CreateProductDataWithInstitution): Promise<Product> {
    return await db.product.create({
      data,
    })
  }

  static async findById(id: string): Promise<Product | null> {
    return await db.product.findUnique({
      where: {
        id,
        deletedAt: null,
      },
    })
  }

  static async findAll(): Promise<Product[]> {
    return await db.product.findMany({
      where: {
        deletedAt: null,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
  }

  static async findByInstitution(institutionId: string): Promise<Product[]> {
    return await db.product.findMany({
      where: {
        institutionId,
        deletedAt: null,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
  }

  static async findPublicProducts(): Promise<Product[]> {
    return await db.product.findMany({
      where: {
        isInternal: false,
        deletedAt: null,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        institution: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })
  }

  static async update(id: string, data: UpdateProductData): Promise<Product | null> {
    try {
      return await db.product.update({
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

  static async delete(id: string): Promise<Product | null> {
    try {
      return await db.product.update({
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

  static async findWithInstitution(id: string) {
    return await db.product.findUnique({
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
        purchases: {
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
              },
            },
          },
        },
      },
    })
  }

  static async findWithPurchases(id: string) {
    return await db.product.findUnique({
      where: {
        id,
        deletedAt: null,
      },
      include: {
        purchases: {
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
              },
            },
          },
          orderBy: {
            purchasedAt: 'desc',
          },
        },
      },
    })
  }

  static async searchProducts(query: string): Promise<Product[]> {
    return await db.product.findMany({
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
}
import { db } from '../db/client.js'
import type { Purchase } from '@prisma/client'

export interface CreatePurchaseData {
  productId: string
}

export class PurchaseModel {
  static async create(data: CreatePurchaseData, userId: string): Promise<Purchase> {
    // Primeiro, obtemos o preço atual do produto para registrar no momento da compra
    const product = await db.product.findUnique({
      where: { id: data.productId }
    })
    
    if (!product) {
      throw new Error('Product not found')
    }
    
    // Criamos a compra registrando o preço no momento da compra
    return db.purchase.create({
      data: {
        productId: data.productId,
        userId: userId,
        priceAtPurchase: product.price,
        purchasedAt: new Date()
      }
    })
  }

  static async findById(id: string): Promise<Purchase | null> {
    return db.purchase.findUnique({
      where: { id }
    })
  }

  static async findByUser(userId: string): Promise<Purchase[]> {
    return db.purchase.findMany({
      where: { 
        userId,
        deletedAt: null
      },
      include: {
        product: true
      }
    })
  }

  static async findByInstitution(institutionId: string): Promise<Purchase[]> {
    return db.purchase.findMany({
      where: {
        product: {
          institutionId,
          deletedAt: null
        },
        deletedAt: null
      },
      include: {
        product: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            wallet: true,
            createdAt: true,
            updatedAt: true
          }
        }
      }
    })
  }

  static async delete(id: string): Promise<Purchase> {
    return db.purchase.update({
      where: { id },
      data: {
        deletedAt: new Date()
      }
    })
  }
}
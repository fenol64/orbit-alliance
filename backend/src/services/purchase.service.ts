import { PurchaseModel, type CreatePurchaseData } from '../models/purchase.model.js'
import { ProductModel } from '../models/product.model.js'
import { InstitutionModel } from '../models/institution.model.js'
import type { Purchase } from '@prisma/client'

export interface PurchaseServiceResponse<T = any> {
  success: boolean
  data?: T
  error?: string
}

export class PurchaseService {
  static async createPurchase(data: CreatePurchaseData, userId: string): Promise<PurchaseServiceResponse<Purchase>> {
    try {
      // Validação: Produto existe?
      const product = await ProductModel.findById(data.productId)
      if (!product) {
        return {
          success: false,
          error: 'Product not found'
        }
      }

      // Validação: Se o produto for interno, o usuário deve pertencer à instituição
      if (product.isInternal) {
        // Verificar se o usuário pertence à instituição do produto
        const userInstitutions = await InstitutionModel.findUserInstitutions(userId)
        const belongsToInstitution = userInstitutions.some(ui => ui.institutionId === product.institutionId)
        
        if (!belongsToInstitution) {
          return {
            success: false,
            error: 'This is an internal product. Only members of the institution can purchase it.'
          }
        }
      }

      // Criar a compra
      const purchase = await PurchaseModel.create(data, userId)

      // Converter objetos Date para strings ISO
      const formattedPurchase = {
        ...purchase,
        purchasedAt: purchase.purchasedAt.toISOString(),
        createdAt: purchase.createdAt.toISOString(),
        updatedAt: purchase.updatedAt.toISOString(),
        deletedAt: purchase.deletedAt ? purchase.deletedAt.toISOString() : null
      }

      return {
        success: true,
        data: formattedPurchase as any // Usando type assertion para contornar o erro de tipagem
      }
    } catch (error) {
      console.error('Error creating purchase:', error)
      return {
        success: false,
        error: 'Failed to create purchase'
      }
    }
  }

  static async getUserPurchases(userId: string): Promise<PurchaseServiceResponse<any[]>> {
    try {
      const purchases = await PurchaseModel.findByUser(userId)
      
      // Converter datas para strings em cada compra
      const formattedPurchases = purchases.map(purchase => {
        // Usar type assertion para acessar o produto incluído
        const purchaseWithProduct = purchase as any;
        
        return {
          id: purchase.id,
          productId: purchase.productId,
          userId: purchase.userId,
          priceAtPurchase: purchase.priceAtPurchase,
          purchasedAt: purchase.purchasedAt.toISOString(),
          createdAt: purchase.createdAt.toISOString(),
          updatedAt: purchase.updatedAt.toISOString(),
          deletedAt: purchase.deletedAt ? purchase.deletedAt.toISOString() : null,
          // Adicionar o produto se estiver disponível
          ...(purchaseWithProduct.product ? {
            product: {
              ...purchaseWithProduct.product,
              createdAt: purchaseWithProduct.product.createdAt.toISOString(),
              updatedAt: purchaseWithProduct.product.updatedAt.toISOString(),
              deletedAt: purchaseWithProduct.product.deletedAt ? purchaseWithProduct.product.deletedAt.toISOString() : null
            }
          } : {})
        };
      })
      
      return {
        success: true,
        data: formattedPurchases
      }
    } catch (error) {
      console.error('Error fetching user purchases:', error)
      return {
        success: false,
        error: 'Failed to fetch user purchases'
      }
    }
  }

  static async getInstitutionPurchases(institutionId: string): Promise<PurchaseServiceResponse<any[]>> {
    try {
      const purchases = await PurchaseModel.findByInstitution(institutionId)
      
      // Converter datas para strings em cada compra
      const formattedPurchases = purchases.map(purchase => {
        // Usar type assertion para acessar o produto e usuário incluídos
        const purchaseWithIncludes = purchase as any;
        
        return {
          id: purchase.id,
          productId: purchase.productId,
          userId: purchase.userId,
          priceAtPurchase: purchase.priceAtPurchase,
          purchasedAt: purchase.purchasedAt.toISOString(),
          createdAt: purchase.createdAt.toISOString(),
          updatedAt: purchase.updatedAt.toISOString(),
          deletedAt: purchase.deletedAt ? purchase.deletedAt.toISOString() : null,
          // Adicionar o produto se estiver disponível
          ...(purchaseWithIncludes.product ? {
            product: {
              ...purchaseWithIncludes.product,
              createdAt: purchaseWithIncludes.product.createdAt.toISOString(),
              updatedAt: purchaseWithIncludes.product.updatedAt.toISOString(),
              deletedAt: purchaseWithIncludes.product.deletedAt ? purchaseWithIncludes.product.deletedAt.toISOString() : null
            }
          } : {}),
          // Adicionar o usuário se estiver disponível
          ...(purchaseWithIncludes.user ? {
            user: {
              ...purchaseWithIncludes.user,
              createdAt: purchaseWithIncludes.user.createdAt.toISOString(),
              updatedAt: purchaseWithIncludes.user.updatedAt.toISOString(),
              deletedAt: purchaseWithIncludes.user.deletedAt ? purchaseWithIncludes.user.deletedAt.toISOString() : null
            }
          } : {})
        };
      });
      
      return {
        success: true,
        data: formattedPurchases
      }
    } catch (error) {
      console.error('Error fetching institution purchases:', error)
      return {
        success: false,
        error: 'Failed to fetch institution purchases'
      }
    }
  }
}
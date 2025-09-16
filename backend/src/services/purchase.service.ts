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

      return {
        success: true,
        data: purchase
      }
    } catch (error) {
      console.error('Error creating purchase:', error)
      return {
        success: false,
        error: 'Failed to create purchase'
      }
    }
  }

  static async getUserPurchases(userId: string): Promise<PurchaseServiceResponse<Purchase[]>> {
    try {
      const purchases = await PurchaseModel.findByUser(userId)
      
      return {
        success: true,
        data: purchases
      }
    } catch (error) {
      console.error('Error fetching user purchases:', error)
      return {
        success: false,
        error: 'Failed to fetch user purchases'
      }
    }
  }

  static async getInstitutionPurchases(institutionId: string): Promise<PurchaseServiceResponse<Purchase[]>> {
    try {
      const purchases = await PurchaseModel.findByInstitution(institutionId)
      
      return {
        success: true,
        data: purchases
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
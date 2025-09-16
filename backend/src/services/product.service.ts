import { ProductModel, type CreateProductData, type CreateProductDataWithInstitution, type UpdateProductData } from '../models/product.model.js'
import { InstitutionModel } from '../models/institution.model.js'
import type { Product } from '@prisma/client'

export interface ProductServiceResponse<T = any> {
  success: boolean
  data?: T
  error?: string
}

export class ProductService {
  static async createProduct(data: CreateProductData, institutionId: string): Promise<ProductServiceResponse<Product>> {
    try {
      console.log('Creating product with data:', { name: data.name, price: data.price, institutionId })
      
      // Verificar se a instituição existe
      const institution = await InstitutionModel.findById(institutionId)
      if (!institution) {
        console.log('Institution not found:', institutionId)
        return {
          success: false,
          error: 'Institution not found',
        }
      }

      // Validar preço
      if (data.price < 0) {
        return {
          success: false,
          error: 'Price must be a positive number',
        }
      }

      // Criar o produto
      console.log('Creating product in database...')
      const productData: CreateProductDataWithInstitution = {
        ...data,
        institutionId,
      }
      const product = await ProductModel.create(productData)

      console.log('Product created successfully:', product.id)

      return {
        success: true,
        data: {
          ...product,
          createdAt: product.createdAt.toISOString(),
          updatedAt: product.updatedAt.toISOString(),
        } as any,
      }
    } catch (error) {
      console.error('Error creating product:', error)
      console.error('Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        data: { ...data, institutionId },
      })
      return {
        success: false,
        error: `Failed to create product: ${error instanceof Error ? error.message : 'Unknown error'}`,
      }
    }
  }

  static async getProductById(id: string): Promise<ProductServiceResponse<Product>> {
    try {
      const product = await ProductModel.findById(id)
      
      if (!product) {
        return {
          success: false,
          error: 'Product not found',
        }
      }

      return {
        success: true,
        data: {
          ...product,
          createdAt: product.createdAt.toISOString(),
          updatedAt: product.updatedAt.toISOString(),
        } as any,
      }
    } catch (error) {
      return {
        success: false,
        error: 'Failed to fetch product',
      }
    }
  }

  static async getAllProducts(): Promise<ProductServiceResponse<Product[]>> {
    try {
      const products = await ProductModel.findAll()
      
      // Converter datas para strings
      const productsWithStringDates = products.map(product => ({
        ...product,
        createdAt: product.createdAt.toISOString(),
        updatedAt: product.updatedAt.toISOString(),
      }))

      return {
        success: true,
        data: productsWithStringDates as any[],
      }
    } catch (error) {
      return {
        success: false,
        error: 'Failed to fetch products',
      }
    }
  }

  static async getProductsByInstitution(institutionId: string): Promise<ProductServiceResponse<Product[]>> {
    try {
      // Verificar se a instituição existe
      const institution = await InstitutionModel.findById(institutionId)
      if (!institution) {
        return {
          success: false,
          error: 'Institution not found',
        }
      }

      const products = await ProductModel.findByInstitution(institutionId)
      
      // Converter datas para strings
      const productsWithStringDates = products.map(product => ({
        ...product,
        createdAt: product.createdAt.toISOString(),
        updatedAt: product.updatedAt.toISOString(),
      }))

      return {
        success: true,
        data: productsWithStringDates as any[],
      }
    } catch (error) {
      return {
        success: false,
        error: 'Failed to fetch products',
      }
    }
  }

  static async getPublicProducts(): Promise<ProductServiceResponse<any[]>> {
    try {
      const products = await ProductModel.findPublicProducts()
      
      // Converter datas para strings
      const productsWithStringDates = products.map(product => ({
        ...product,
        createdAt: product.createdAt.toISOString(),
        updatedAt: product.updatedAt.toISOString(),
      }))

      return {
        success: true,
        data: productsWithStringDates,
      }
    } catch (error) {
      return {
        success: false,
        error: 'Failed to fetch public products',
      }
    }
  }

  static async updateProduct(id: string, data: UpdateProductData): Promise<ProductServiceResponse<Product>> {
    try {
      // Verificar se o produto existe
      const existingProduct = await ProductModel.findById(id)
      if (!existingProduct) {
        return {
          success: false,
          error: 'Product not found',
        }
      }

      // Se está alterando instituição, verificar se a nova instituição existe
      if (data.institutionId && data.institutionId !== existingProduct.institutionId) {
        const institution = await InstitutionModel.findById(data.institutionId)
        if (!institution) {
          return {
            success: false,
            error: 'Institution not found',
          }
        }
      }

      // Validar preço se está sendo alterado
      if (data.price !== undefined && data.price < 0) {
        return {
          success: false,
          error: 'Price must be a positive number',
        }
      }

      const updatedProduct = await ProductModel.update(id, data)
      
      if (!updatedProduct) {
        return {
          success: false,
          error: 'Failed to update product',
        }
      }

      return {
        success: true,
        data: {
          ...updatedProduct,
          createdAt: updatedProduct.createdAt.toISOString(),
          updatedAt: updatedProduct.updatedAt.toISOString(),
        } as any,
      }
    } catch (error) {
      return {
        success: false,
        error: 'Failed to update product',
      }
    }
  }

  static async deleteProduct(id: string): Promise<ProductServiceResponse<boolean>> {
    try {
      const product = await ProductModel.delete(id)
      
      if (!product) {
        return {
          success: false,
          error: 'Product not found',
        }
      }

      return {
        success: true,
        data: true,
      }
    } catch (error) {
      return {
        success: false,
        error: 'Failed to delete product',
      }
    }
  }

  static async getProductWithDetails(id: string): Promise<ProductServiceResponse<any>> {
    try {
      const product = await ProductModel.findWithInstitution(id)
      
      if (!product) {
        return {
          success: false,
          error: 'Product not found',
        }
      }

      return {
        success: true,
        data: {
          ...product,
          createdAt: product.createdAt.toISOString(),
          updatedAt: product.updatedAt.toISOString(),
        },
      }
    } catch (error) {
      return {
        success: false,
        error: 'Failed to fetch product details',
      }
    }
  }

  static async getProductPurchases(id: string): Promise<ProductServiceResponse<any>> {
    try {
      const product = await ProductModel.findWithPurchases(id)
      
      if (!product) {
        return {
          success: false,
          error: 'Product not found',
        }
      }

      return {
        success: true,
        data: {
          ...product,
          createdAt: product.createdAt.toISOString(),
          updatedAt: product.updatedAt.toISOString(),
        },
      }
    } catch (error) {
      return {
        success: false,
        error: 'Failed to fetch product purchases',
      }
    }
  }

  static async searchProducts(query: string): Promise<ProductServiceResponse<any[]>> {
    try {
      if (!query || query.trim().length < 2) {
        return {
          success: false,
          error: 'Search query must be at least 2 characters long',
        }
      }

      const products = await ProductModel.searchProducts(query.trim())
      
      // Converter datas para strings
      const productsWithStringDates = products.map(product => ({
        ...product,
        createdAt: product.createdAt.toISOString(),
        updatedAt: product.updatedAt.toISOString(),
      }))

      return {
        success: true,
        data: productsWithStringDates,
      }
    } catch (error) {
      return {
        success: false,
        error: 'Failed to search products',
      }
    }
  }
}
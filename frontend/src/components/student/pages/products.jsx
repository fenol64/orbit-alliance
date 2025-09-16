"use client"

import { useState } from 'react'
import { ShoppingCart, Star, Award, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function StudentProductsPage() {
  const [products] = useState([
    {
      id: 1,
      name: "Certificação AWS Cloud Practitioner",
      description: "Prepare-se para a certificação AWS Cloud Practitioner com materiais exclusivos e simulados.",
      price: 150,
      category: "Certificação",
      rating: 4.8,
      reviews: 234,
      image: "/api/placeholder/300/200",
      features: ["Materiais de estudo", "10 simulados", "Suporte 24/7", "Certificado de conclusão"],
      duration: "40 horas"
    },
    {
      id: 2,
      name: "Curso Completo de React.js",
      description: "Domine React.js do básico ao avançado com projetos práticos e exercícios.",
      price: 89,
      category: "Curso",
      rating: 4.9,
      reviews: 567,
      image: "/api/placeholder/300/200",
      features: ["50+ aulas", "5 projetos práticos", "Código fonte", "Mentoria em grupo"],
      duration: "60 horas"
    },
    {
      id: 3,
      name: "Bootcamp Full Stack Developer",
      description: "Torne-se um desenvolvedor full stack em 6 meses com nosso bootcamp intensivo.",
      price: 299,
      category: "Bootcamp",
      rating: 4.7,
      reviews: 189,
      image: "/api/placeholder/300/200",
      features: ["Frontend e Backend", "Projetos reais", "Mentoria individual", "Garantia de emprego"],
      duration: "180 horas"
    },
    {
      id: 4,
      name: "Kit de Templates UI/UX",
      description: "Coleção de templates e componentes para acelerar seus projetos de design.",
      price: 45,
      category: "Design",
      rating: 4.6,
      reviews: 89,
      image: "/api/placeholder/300/200",
      features: ["50+ templates", "Componentes Figma", "Guia de estilo", "Atualizações gratuitas"],
      duration: "Acesso vitalício"
    },
    {
      id: 5,
      name: "Workshop: Machine Learning Basics",
      description: "Introdução prática ao Machine Learning com Python e scikit-learn.",
      price: 75,
      category: "Workshop",
      rating: 4.5,
      reviews: 145,
      image: "/api/placeholder/300/200",
      features: ["Workshop ao vivo", "Material didático", "Projetos práticos", "Certificado"],
      duration: "8 horas"
    },
    {
      id: 6,
      name: "E-book: Carreira em Tech",
      description: "Guia completo para construir uma carreira sólida na área de tecnologia.",
      price: 25,
      category: "E-book",
      rating: 4.4,
      reviews: 312,
      image: "/api/placeholder/300/200",
      features: ["200+ páginas", "Casos reais", "Templates de CV", "Lista de recursos"],
      duration: "Leitura livre"
    }
  ])

  const [balance] = useState(1275) // Saldo atual do aluno
  const [cart, setCart] = useState([])

  const addToCart = (product) => {
    setCart(prev => [...prev, product])
  }

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.id !== productId))
  }

  const getTotalCartValue = () => {
    return cart.reduce((total, item) => total + item.price, 0)
  }

  const canAfford = (price) => {
    return balance >= price
  }

  const isInCart = (productId) => {
    return cart.some(item => item.id === productId)
  }

  const categories = [...new Set(products.map(p => p.category))]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Loja de Produtos</h1>
          <p className="text-gray-600">Invista em seu desenvolvimento com nossos produtos educacionais</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="bg-white px-4 py-2 rounded-lg border shadow-sm">
            <div className="flex items-center space-x-2">
              <Award className="h-5 w-5 text-purple-600" />
              <span className="font-medium text-gray-900">Saldo: {balance} pontos</span>
            </div>
          </div>
          {cart.length > 0 && (
            <div className="bg-purple-600 text-white px-4 py-2 rounded-lg">
              <div className="flex items-center space-x-2">
                <ShoppingCart className="h-5 w-5" />
                <span className="font-medium">Carrinho: {cart.length} itens</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">Todos</TabsTrigger>
          {categories.map(category => (
            <TabsTrigger key={category} value={category}>{category}</TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={addToCart}
                onRemoveFromCart={removeFromCart}
                canAfford={canAfford(product.price)}
                isInCart={isInCart(product.id)}
              />
            ))}
          </div>
        </TabsContent>

        {categories.map(category => (
          <TabsContent key={category} value={category} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.filter(p => p.category === category).map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={addToCart}
                  onRemoveFromCart={removeFromCart}
                  canAfford={canAfford(product.price)}
                  isInCart={isInCart(product.id)}
                />
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Carrinho */}
      {cart.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Carrinho de Compras</h3>
          <div className="space-y-3">
            {cart.map((item) => (
              <div key={item.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                <div>
                  <p className="font-medium text-gray-900">{item.name}</p>
                  <p className="text-sm text-gray-600">{item.category}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="font-medium text-purple-600">{item.price} pts</span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-600 border-red-200 hover:bg-red-50"
                  >
                    Remover
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-lg font-medium text-gray-900">Total: {getTotalCartValue()} pontos</span>
              <Button className="bg-purple-600 hover:bg-purple-700" disabled={balance < getTotalCartValue()}>
                {balance < getTotalCartValue() ? 'Saldo Insuficiente' : 'Finalizar Compra'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function ProductCard({ product, onAddToCart, onRemoveFromCart, canAfford, isInCart }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
      <div className="aspect-video bg-gray-100 rounded-t-lg flex items-center justify-center">
        <div className="text-gray-400 text-center">
          <ShoppingCart className="h-12 w-12 mx-auto mb-2" />
          <p className="text-sm">{product.category}</p>
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-medium text-gray-900 line-clamp-2">{product.name}</h3>
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
            {product.category}
          </span>
        </div>

        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>

        <div className="flex items-center space-x-4 mb-3 text-xs text-gray-500">
          <div className="flex items-center space-x-1">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span>{product.rating}</span>
            <span>({product.reviews})</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="h-3 w-3" />
            <span>{product.duration}</span>
          </div>
        </div>

        <div className="space-y-2 mb-4">
          {product.features.slice(0, 3).map((feature, index) => (
            <div key={index} className="text-xs text-gray-600 flex items-center">
              <div className="w-1 h-1 bg-purple-400 rounded-full mr-2"></div>
              {feature}
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <Award className="h-4 w-4 text-purple-600" />
            <span className="font-bold text-purple-600">{product.price} pts</span>
          </div>

          {isInCart ? (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onRemoveFromCart(product.id)}
              className="text-red-600 border-red-200 hover:bg-red-50"
            >
              Remover
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={() => onAddToCart(product)}
              disabled={!canAfford}
              className={`${canAfford ? 'bg-purple-600 hover:bg-purple-700' : 'bg-gray-300 cursor-not-allowed'}`}
            >
              {canAfford ? 'Adicionar' : 'Sem Saldo'}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

"use client";

import { useState } from "react";
import { ShoppingCart, Star, Award, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StudentDashboardLayout from "../layouts/dashboard-layout";

export default function StudentProductsPage({ products, balance }) {

  const canAfford = (price) => {
    return balance >= price;
  };

  const handleBuy = (product) => {
  }

  const categories = [...new Set(products.map((p) => p.category))];

  return (
    <StudentDashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Product Store
            </h1>
            <p className="text-gray-600">
              Invest in your development with our educational products
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-white px-4 py-2 rounded-lg border shadow-sm">
              <div className="flex items-center space-x-2">
                <Award className="h-5 w-5 text-purple-600" />
                <span className="font-medium text-gray-900">
                  Balance: {balance} points
                </span>
              </div>
            </div>
          </div>
        </div>

        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            {categories.map((category) => (
              <TabsTrigger key={category} value={category}>
                {category}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onBuy={handleBuy}
                  canAfford={canAfford(product.price)}
                />
              ))}
            </div>
          </TabsContent>

          {categories.map((category) => (
            <TabsContent key={category} value={category} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products
                  .filter((p) => p.category === category)
                  .map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onBuy={handleBuy}
                      canAfford={canAfford(product.price)}
                    />
                  ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </StudentDashboardLayout>
  );
}

function ProductCard({
  product,
  onAddToCart,
  onRemoveFromCart,
  canAfford,
  isInCart,
}) {
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
            <h3 className="font-medium text-gray-900 line-clamp-2">
              {product.name}
            </h3>
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
              {product.category}
            </span>
          </div>

          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {product.description}
          </p>

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
              <div
                key={index}
                className="text-xs text-gray-600 flex items-center"
              >
                <div className="w-1 h-1 bg-purple-400 rounded-full mr-2"></div>
                {feature}
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              <Award className="h-4 w-4 text-purple-600" />
              <span className="font-bold text-purple-600">
                {product.price} pts
              </span>
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
                className={`${
                  canAfford
                    ? "bg-purple-600 hover:bg-purple-700"
                    : "bg-gray-300 cursor-not-allowed"
                }`}
              >
                {canAfford ? "Adicionar" : "Sem Saldo"}
              </Button>
            )}
          </div>
        </div>
      </div>
  );
}

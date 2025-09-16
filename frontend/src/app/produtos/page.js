"use client"

import DashboardLayout from '@/components/dashboard-layout'
import DataTemplate from '@/components/ui/data-template'
import ProdutoForm from '@/components/forms/produto-form'
import { useState } from 'react'

export default function ProdutosPage() {
  // Dados de exemplo - em um app real, isso viria de uma API
  const [produtos, setProdutos] = useState([
    {
      id: 1,
      nome: 'Curso de React',
      descricao: 'Curso completo de React para iniciantes',
      preco: 299.99,
      categoria: 'Programação'
    },
    {
      id: 2,
      nome: 'Curso de Node.js',
      descricao: 'Backend com Node.js e Express',
      preco: 249.99,
      categoria: 'Programação'
    },
    {
      id: 3,
      nome: 'Design UI/UX',
      descricao: 'Fundamentos de design de interfaces',
      preco: 199.99,
      categoria: 'Design'
    }
  ])

  const columns = [
    { key: 'nome', label: 'Nome' },
    { key: 'descricao', label: 'Descrição' },
    { 
      key: 'preco', 
      label: 'Preço',
      render: (value) => `R$ ${value.toFixed(2)}`
    },
    { key: 'categoria', label: 'Categoria' }
  ]

  const handleAdd = (formData) => {
    const newProduto = {
      id: Date.now(),
      ...formData,
      preco: parseFloat(formData.preco)
    }
    setProdutos(prev => [...prev, newProduto])
  }

  const handleEdit = (id, formData) => {
    setProdutos(prev => 
      prev.map(produto => 
        produto.id === id ? { ...produto, ...formData, preco: parseFloat(formData.preco) } : produto
      )
    )
  }

  const handleDelete = (id) => {
    setProdutos(prev => prev.filter(produto => produto.id !== id))
  }

  return (
    <DashboardLayout>
      <DataTemplate
        title="Produtos"
        description="Gerencie todos os produtos da plataforma"
        data={produtos}
        columns={columns}
        searchPlaceholder="Buscar por nome, descrição ou categoria..."
        FormComponent={ProdutoForm}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </DashboardLayout>
  )
}

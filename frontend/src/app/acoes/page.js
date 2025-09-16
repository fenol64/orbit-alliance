"use client"

import DashboardLayout from '@/components/dashboard-layout'
import DataTemplate from '@/components/ui/data-template'
import AcaoForm from '@/components/forms/acao-form'
import { useState } from 'react'

export default function AcoesPage() {
  // Dados de exemplo - em um app real, isso viria de uma API
  const [acoes, setAcoes] = useState([
    {
      id: 1,
      titulo: 'Implementar novo sistema de login',
      descricao: 'Desenvolver sistema de autenticação com 2FA',
      status: 'Em Andamento',
      responsavel: 'João Silva'
    },
    {
      id: 2,
      titulo: 'Atualizar dashboard',
      descricao: 'Melhorar interface do painel de controle',
      status: 'Concluído',
      responsavel: 'Maria Santos'
    },
    {
      id: 3,
      titulo: 'Backup automático',
      descricao: 'Configurar rotina de backup diário',
      status: 'Pendente',
      responsavel: 'Carlos Lima'
    },
    {
      id: 4,
      titulo: 'Migração de dados',
      descricao: 'Migrar dados legados para novo formato',
      status: 'Em Andamento',
      responsavel: 'Ana Costa'
    }
  ])

  const columns = [
    { key: 'titulo', label: 'Título' },
    { key: 'descricao', label: 'Descrição' },
    { 
      key: 'status', 
      label: 'Status',
      render: (value) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          value === 'Concluído' ? 'bg-green-100 text-green-800' :
          value === 'Em Andamento' ? 'bg-blue-100 text-blue-800' :
          'bg-yellow-100 text-yellow-800'
        }`}>
          {value}
        </span>
      )
    },
    { key: 'responsavel', label: 'Responsável' }
  ]

  const handleAdd = (formData) => {
    const newAcao = {
      id: Date.now(),
      ...formData
    }
    setAcoes(prev => [...prev, newAcao])
  }

  const handleEdit = (id, formData) => {
    setAcoes(prev => 
      prev.map(acao => 
        acao.id === id ? { ...acao, ...formData } : acao
      )
    )
  }

  const handleDelete = (id) => {
    setAcoes(prev => prev.filter(acao => acao.id !== id))
  }

  return (
    <DashboardLayout>
      <DataTemplate
        title="Ações"
        description="Monitore e gerencie todas as ações do sistema"
        data={acoes}
        columns={columns}
        searchPlaceholder="Buscar por título, descrição ou responsável..."
        FormComponent={AcaoForm}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </DashboardLayout>
  )
}

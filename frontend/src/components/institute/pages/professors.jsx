"use client"

import DashboardLayout from '@/components/institute/layouts/dashboard-layout'
import DataTemplate from '@/components/institute/layouts/data-template'
import ProfessorForm from '@/components/institute/forms/professor-form'
import { useState } from 'react'

export default function InstituteProfessorsPage() {
  // Dados de exemplo - em um app real, isso viria de uma API
  const [professores, setProfessores] = useState([
    {
      id: 1,
      nome: 'Dr. João Silva',
      email: 'joao.silva@email.com',
      especialidade: 'Matemática',
      telefone: '(11) 99999-9999'
    },
    {
      id: 2,
      nome: 'Dra. Maria Santos',
      email: 'maria.santos@email.com',
      especialidade: 'Física',
      telefone: '(11) 88888-8888'
    },
    {
      id: 3,
      nome: 'Prof. Carlos Lima',
      email: 'carlos.lima@email.com',
      especialidade: 'Química',
      telefone: '(11) 77777-7777'
    }
  ])

  const columns = [
    { key: 'nome', label: 'Nome' },
    { key: 'email', label: 'Email' },
    { key: 'especialidade', label: 'Especialidade' },
    { key: 'telefone', label: 'Telefone' }
  ]

  const handleAdd = (formData) => {
    const newProfessor = {
      id: Date.now(),
      ...formData
    }
    setProfessores(prev => [...prev, newProfessor])
  }

  const handleEdit = (id, formData) => {
    setProfessores(prev =>
      prev.map(professor =>
        professor.id === id ? { ...professor, ...formData } : professor
      )
    )
  }

  const handleDelete = (id) => {
    setProfessores(prev => prev.filter(professor => professor.id !== id))
  }

  return (
    <DashboardLayout>
      <DataTemplate
        title="Professores"
        description="Gerencie todos os professores da plataforma"
        data={professores}
        columns={columns}
        searchPlaceholder="Buscar por nome, email ou especialidade..."
        FormComponent={ProfessorForm}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </DashboardLayout>
  )
}

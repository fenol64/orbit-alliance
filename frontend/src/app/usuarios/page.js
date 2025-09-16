"use client"

import DashboardLayout from '@/components/dashboard-layout'
import DataTemplate from '@/components/ui/data-template'
import UsuarioForm from '@/components/forms/usuario-form'
import { useState } from 'react'

export default function UsuariosPage() {
  // Dados de exemplo - em um app real, isso viria de uma API
  const [usuarios, setUsuarios] = useState([
    {
      id: 1,
      nome: 'Admin User',
      email: 'admin@orbitalliance.com',
      role: 'Administrador',
      telefone: '(11) 99999-9999'
    },
    {
      id: 2,
      nome: 'Editor Silva',
      email: 'editor@orbitalliance.com',
      role: 'Editor',
      telefone: '(11) 88888-8888'
    },
    {
      id: 3,
      nome: 'Viewer Costa',
      email: 'viewer@orbitalliance.com',
      role: 'Visualizador',
      telefone: '(11) 77777-7777'
    }
  ])

  const columns = [
    { key: 'nome', label: 'Nome' },
    { key: 'email', label: 'Email' },
    {
      key: 'role',
      label: 'Função',
      render: (value) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          value === 'Administrador' ? 'bg-red-100 text-red-800' :
          value === 'Editor' ? 'bg-blue-100 text-blue-800' :
          'bg-green-100 text-green-800'
        }`}>
          {value}
        </span>
      )
    },
    { key: 'telefone', label: 'Telefone' }
  ]

  const handleAdd = (formData) => {
    const newUsuario = {
      id: Date.now(),
      ...formData
    }
    setUsuarios(prev => [...prev, newUsuario])
  }

  const handleEdit = (id, formData) => {
    setUsuarios(prev =>
      prev.map(usuario =>
        usuario.id === id ? { ...usuario, ...formData } : usuario
      )
    )
  }

  const handleDelete = (id) => {
    setUsuarios(prev => prev.filter(usuario => usuario.id !== id))
  }

  return (
    <DashboardLayout>
      <DataTemplate
        title="Usuários"
        description="Gerencie todos os usuários da plataforma"
        data={usuarios}
        columns={columns}
        searchPlaceholder="Buscar por nome, email ou função..."
        FormComponent={UsuarioForm}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </DashboardLayout>
  )
}

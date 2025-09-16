"use client"

import DashboardLayout from '@/components/institute/layouts/dashboard-layout'
import DataTemplate from '@/components/institute/layouts/data-template'
import UsuarioForm from '@/components/institute/forms/usuario-form'
import { useState } from 'react'

export default function InstituteUsersPage({ students }) {
  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    {
      key: 'role',
      label: 'Role',
      render: (value) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          value === 'Administrator' ? 'bg-red-100 text-red-800' :
          value === 'Editor' ? 'bg-blue-100 text-blue-800' :
          'bg-green-100 text-green-800'
        }`}>
          {value}
        </span>
      )
    },
    { key: 'telephone', label: 'Telephone' }
  ]

  const handleAdd = (formData) => {

  }

  const handleEdit = (id, formData) => {

  }

  const handleDelete = (id) => {

  }

  return (
    <DashboardLayout>
      <DataTemplate
        title="Students"
        description="Manage all platform students"
        data={students}
        columns={columns}
        searchPlaceholder="Search by name, email or role..."
        FormComponent={UsuarioForm}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </DashboardLayout>
  )
}

"use client"

import DashboardLayout from '@/components/institute/layouts/dashboard-layout'
import DataTemplate from '@/components/institute/layouts/data-template'
import UsuarioForm from '@/components/institute/forms/usuario-form'
import { useState } from 'react'

export default function InstituteUsersPage({ students }) {
  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'wallet', label: 'Wallet' }
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

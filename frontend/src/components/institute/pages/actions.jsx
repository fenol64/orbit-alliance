"use client"

import DashboardLayout from '@/components/institute/layouts/dashboard-layout'
import DataTemplate from '@/components/institute/layouts/data-template'
import AcaoForm from '@/components/institute/forms/acao-form'
import { useState } from 'react'

export default function InstituteActionsPage({ actions }) {

  const columns = [
    { key: 'title', label: 'Title' },
    { key: 'description', label: 'Description' },
    {
      key: 'price',
      label: 'Price',
      render: (value) => `$ ${(value || 0).toFixed(2)}`
    },
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
        title="Actions"
        description="Monitor and manage all system actions"
        data={actions}
        columns={columns}
        searchPlaceholder="Search by title, description or responsible..."
        FormComponent={AcaoForm}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </DashboardLayout>
  )
}

"use client"

import DashboardLayout from '@/components/institute/layouts/dashboard-layout'
import DataTemplate from '@/components/institute/layouts/data-template'
import ProductForm from '@/components/institute/forms/produto-form'

export default function InstituteProductsPage({ products }) {

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'description', label: 'Description' },
    {
      key: 'price',
      label: 'Price',
      render: (value) => `$ ${(value || 0).toFixed(2)}`
    }
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
        title="Products"
        description="Manage all products on the platform"
        data={products}
        columns={columns}
        searchPlaceholder="Search by name, description or category..."
        FormComponent={ProductForm}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </DashboardLayout>
  )
}

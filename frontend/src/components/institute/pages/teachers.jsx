"use client"

import DashboardLayout from '@/components/institute/layouts/dashboard-layout'
import DataTemplate from '@/components/institute/layouts/data-template'
import TeacherForm from '@/components/institute/forms/professor-form'

export default function InstituteTeachersPage({ teachers }) {

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'specialty', label: 'Specialty' },
    { key: 'phone', label: 'Phone' }
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
        title="Teachers"
        description="Manage all the teachers on platform"
        data={teachers}
        columns={columns}
        searchPlaceholder="Search by name, email or specialty..."
        FormComponent={TeacherForm}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </DashboardLayout>
  )
}

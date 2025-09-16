"use client"

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { DialogFooter } from '@/components/ui/dialog'
import { axios } from '@/gateway/database'

const UsuarioForm = ({ initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    email: initialData?.email || '',
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    await axios.post('/institutions/users', JSON.stringify({
        ...formData,
        role: "comum"
    }))

    e.target.reset()
  }

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => handleChange('email', e.target.value)}
          placeholder="email@exemplo.com"
          required
        />
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">
          {initialData ? 'Atualizar' : 'Adicionar'}
        </Button>
      </DialogFooter>
    </form>
  )
}

export default UsuarioForm

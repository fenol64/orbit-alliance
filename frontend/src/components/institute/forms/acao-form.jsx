"use client"

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { DialogFooter } from '@/components/ui/dialog'

const AcaoForm = ({ initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    titulo: initialData?.titulo || '',
    descricao: initialData?.descricao || '',
    status: initialData?.status || '',
    responsavel: initialData?.responsavel || ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="titulo">Título</Label>
        <Input
          id="titulo"
          value={formData.titulo}
          onChange={(e) => handleChange('titulo', e.target.value)}
          placeholder="Título da ação"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="descricao">Descrição</Label>
        <Input
          id="descricao"
          value={formData.descricao}
          onChange={(e) => handleChange('descricao', e.target.value)}
          placeholder="Descrição da ação"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <Input
          id="status"
          value={formData.status}
          onChange={(e) => handleChange('status', e.target.value)}
          placeholder="Pendente, Em Andamento, Concluído..."
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="responsavel">Responsável</Label>
        <Input
          id="responsavel"
          value={formData.responsavel}
          onChange={(e) => handleChange('responsavel', e.target.value)}
          placeholder="Nome do responsável"
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

export default AcaoForm

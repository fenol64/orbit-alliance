"use client"

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { DialogFooter } from '@/components/ui/dialog'
import { axios } from '@/gateway/database'

const AcaoForm = ({ initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    reward: 0
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    await axios.post('/actions', JSON.stringify(formData))

    e.target.reset()
  }

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          placeholder="Name of the action"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="Description of the action"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="reward">Reward</Label>
        <Input
          id="reward"
          value={formData.reward}
          type="number"
          onChange={(e) => handleChange('reward', parseFloat(e.target.value))}
          placeholder="Action reward"
          required
        />
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {initialData ? 'Update' : 'Add'}
        </Button>
      </DialogFooter>
    </form>
  )
}

export default AcaoForm

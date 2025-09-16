"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'

export default function InstituteRegister() {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    wallet: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    // Simular envio para API
    await new Promise(resolve => setTimeout(resolve, 2000))

    console.log('Dados da instituição:', formData)
    setSuccess(true)
    setIsLoading(false)
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Register finished!</h2>
            <p className="text-gray-600 mb-6">
              Your institution has been successfully registered. We will contact you soon.
            </p>
            <Link href="/">
              <Button className="w-full">
                Go to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xl">O</span>
            </div>
            <span className="ml-3 text-2xl font-bold text-gray-900">Orbit Alliance</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Register Institution
          </h1>
          <p className="text-gray-600">
            Register your institution to access our platform
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Name of Institution</Label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Ex: University of California"
              required
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Institutional Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="contact@institution.edu"
              required
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="wallet">Cryptocurrency Wallet</Label>
            <Input
              id="wallet"
              type="text"
              value={formData.wallet}
              onChange={(e) => handleChange('wallet', e.target.value)}
              placeholder="0x1234567890abcdef..."
              required
              className="w-full"
              pattern="^0x[a-fA-F0-9]{40}$"
              title="Valid Ethereum wallet format (0x followed by 40 hexadecimal characters)"
            />
            <p className="text-xs text-gray-500">
              Ethereum wallet address (format: 0x...)
            </p>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processando...
              </span>
            ) : (
              'Register Institution'
            )}
          </Button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link href="/instituicao/entrar" className="text-primary hover:underline">
              Log in
            </Link>
          </p>
        </div>

        {/* Info Box */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="text-sm font-medium text-blue-900 mb-2">
            Why do we need the wallet?
          </h3>
          <p className="text-xs text-blue-700">
            A carteira de criptomoedas será utilizada para transações relacionadas aos
            certificados e pagamentos na plataforma blockchain.
          </p>
        </div>
      </div>
    </div>
  )
}

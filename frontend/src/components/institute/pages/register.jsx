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
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Cadastro Realizado!</h2>
            <p className="text-gray-600 mb-6">
              Sua instituição foi registrada com sucesso. Em breve entraremos em contato.
            </p>
            <Link href="/">
              <Button className="w-full">
                Ir para Dashboard
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
            Cadastro de Instituição
          </h1>
          <p className="text-gray-600">
            Registre sua instituição para acessar nossa plataforma
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome da Instituição</Label>
            <Input
              id="nome"
              type="text"
              value={formData.nome}
              onChange={(e) => handleChange('nome', e.target.value)}
              placeholder="Ex: Universidade Federal do Brasil"
              required
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Institucional</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="contato@instituicao.edu.br"
              required
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="wallet">Carteira de Criptomoedas</Label>
            <Input
              id="wallet"
              type="text"
              value={formData.wallet}
              onChange={(e) => handleChange('wallet', e.target.value)}
              placeholder="0x1234567890abcdef..."
              required
              className="w-full"
              pattern="^0x[a-fA-F0-9]{40}$"
              title="Formato de carteira Ethereum válido (0x seguido de 40 caracteres hexadecimais)"
            />
            <p className="text-xs text-gray-500">
              Endereço da carteira Ethereum (formato: 0x...)
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
              'Cadastrar Instituição'
            )}
          </Button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            Já possui cadastro?{' '}
            <Link href="/entrar" className="text-primary hover:underline">
              Fazer login
            </Link>
          </p>
        </div>

        {/* Info Box */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="text-sm font-medium text-blue-900 mb-2">
            Por que precisamos da carteira?
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

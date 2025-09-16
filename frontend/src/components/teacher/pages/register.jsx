"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'

export default function ProfessorRegister() {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    password: '',
    confirmPassword: '',
    instituicao: '',
    telefone: '',
    especializacao: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      alert('As senhas não coincidem!')
      return
    }

    setIsLoading(true)

    // Simular envio para API
    await new Promise(resolve => setTimeout(resolve, 2000))

    console.log('Dados do professor:', formData)
    setSuccess(true)
    setIsLoading(false)
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Cadastro Realizado!</h2>
            <p className="text-gray-600 mb-6">
              Seu cadastro como professor foi enviado com sucesso. Aguarde aprovação da instituição.
            </p>
            <Link href="/professores/entrar">
              <Button className="w-full bg-green-600 hover:bg-green-700">
                Fazer Login
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">O</span>
            </div>
            <span className="ml-3 text-2xl font-bold text-gray-900">Orbit Alliance</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Cadastro de Professor
          </h1>
          <p className="text-gray-600">
            Junte-se à nossa plataforma educacional
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome Completo</Label>
            <Input
              id="nome"
              type="text"
              value={formData.nome}
              onChange={(e) => handleChange('nome', e.target.value)}
              placeholder="Seu nome completo"
              required
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="professor@email.com"
              required
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => handleChange('password', e.target.value)}
              placeholder="Crie uma senha"
              required
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar Senha</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => handleChange('confirmPassword', e.target.value)}
              placeholder="Confirme sua senha"
              required
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="instituicao">Instituição</Label>
            <Input
              id="instituicao"
              type="text"
              value={formData.instituicao}
              onChange={(e) => handleChange('instituicao', e.target.value)}
              placeholder="Nome da sua instituição"
              required
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="telefone">Telefone</Label>
            <Input
              id="telefone"
              type="tel"
              value={formData.telefone}
              onChange={(e) => handleChange('telefone', e.target.value)}
              placeholder="(11) 99999-9999"
              required
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="especializacao">Área de Especialização</Label>
            <Input
              id="especializacao"
              type="text"
              value={formData.especializacao}
              onChange={(e) => handleChange('especializacao', e.target.value)}
              placeholder="Ex: Tecnologia, Matemática, Física"
              required
              className="w-full"
            />
          </div>

          <div className="flex items-start">
            <input
              type="checkbox"
              id="terms"
              required
              className="rounded border-gray-300 text-green-600 focus:ring-green-600 mt-1"
            />
            <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
              Concordo com os{' '}
              <Link href="/termos" className="text-green-600 hover:underline">
                termos de uso
              </Link>
              {' '}e{' '}
              <Link href="/privacidade" className="text-green-600 hover:underline">
                política de privacidade
              </Link>
            </label>
          </div>

          <Button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Cadastrando...
              </span>
            ) : (
              'Cadastrar'
            )}
          </Button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            Já possui conta?{' '}
            <Link href="/professores/entrar" className="text-green-600 hover:underline">
              Fazer login
            </Link>
          </p>
          <p className="text-sm text-gray-500 mt-2">
            <Link href="/instituicao/entrar" className="hover:underline">
              Entrar como instituição
            </Link>
            {' | '}
            <Link href="/alunos/entrar" className="hover:underline">
              Entrar como aluno
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

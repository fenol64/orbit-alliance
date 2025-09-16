"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useConfigStore } from '@/store/configStore'

export default function ProfessorLogin() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { setRole } = useConfigStore()

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    // Simular autenticação
    await new Promise(resolve => setTimeout(resolve, 1500))

    console.log('Login Professor:', formData)

    // Definir role como professor e redirecionar
    setRole('professor')
    router.push('/')
    setIsLoading(false)
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
            Portal do Professor
          </h1>
          <p className="text-gray-600">
            Acesse sua conta de professor
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
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
              placeholder="Sua senha"
              required
              className="w-full"
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-green-600 focus:ring-green-600"
              />
              <span className="ml-2 text-sm text-gray-600">Lembrar de mim</span>
            </label>
            <Link href="/recuperar-senha" className="text-sm text-green-600 hover:underline">
              Esqueceu a senha?
            </Link>
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
                Entrando...
              </span>
            ) : (
              'Entrar'
            )}
          </Button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            Não possui cadastro?{' '}
            <Link href="/professores/cadastrar" className="text-green-600 hover:underline">
              Cadastrar como professor
            </Link>
          </p>
          <p className="text-sm text-gray-500 mt-2">
            <Link href="/instituicao/entrar" className="hover:underline">
              Entrar como instituição
            </Link>
            {' | '}
            <Link href="/aluno/entrar" className="hover:underline">
              Entrar como aluno
            </Link>
          </p>
        </div>

        {/* Demo credentials */}
        <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
          <h3 className="text-sm font-medium text-green-800 mb-2">
            🎓 Demo - Credenciais de teste:
          </h3>
          <p className="text-xs text-green-700">
            Email: professor@demo.com<br />
            Senha: prof123
          </p>
        </div>
      </div>
    </div>
  )
}

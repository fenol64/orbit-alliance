"use client"

import { useState } from 'react'
import { Target, Award, Clock, CheckCircle, Star, Calendar, Play, BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function StudentActionsPage() {
  const [availableActions] = useState([
    {
      id: 1,
      title: "Curso: Next.js Fundamentals",
      description: "Aprenda os fundamentos do Next.js, incluindo roteamento, API routes, e deployment.",
      points: 150,
      category: "Curso",
      difficulty: "Intermediário",
      duration: "8 horas",
      deadline: "2025-10-15",
      requirements: ["Conhecimento básico de React"],
      status: "available"
    },
    {
      id: 2,
      title: "Workshop: UI/UX Design Principles",
      description: "Participe do workshop sobre princípios fundamentais de design de interface e experiência do usuário.",
      points: 100,
      category: "Workshop",
      difficulty: "Iniciante",
      duration: "4 horas",
      deadline: "2025-09-25",
      requirements: ["Nenhum pré-requisito"],
      status: "available"
    },
    {
      id: 3,
      title: "Projeto: E-commerce App",
      description: "Desenvolva um aplicativo de e-commerce completo usando React, Node.js e MongoDB.",
      points: 300,
      category: "Projeto",
      difficulty: "Avançado",
      duration: "20 horas",
      deadline: "2025-10-30",
      requirements: ["React", "Node.js", "Database"],
      status: "available"
    },
    {
      id: 4,
      title: "Certificação: AWS Cloud Practitioner",
      description: "Prepare-se e obtenha a certificação AWS Cloud Practitioner.",
      points: 500,
      category: "Certificação",
      difficulty: "Intermediário",
      duration: "40 horas",
      deadline: "2025-11-15",
      requirements: ["Conhecimentos básicos de cloud"],
      status: "available"
    },
    {
      id: 5,
      title: "Estudo Dirigido: TypeScript Avançado",
      description: "Módulo de estudos sobre recursos avançados do TypeScript.",
      points: 75,
      category: "Estudo",
      difficulty: "Intermediário",
      duration: "6 horas",
      deadline: "2025-09-20",
      requirements: ["TypeScript básico"],
      status: "available"
    },
    {
      id: 6,
      title: "Hackathon: Green Tech Solutions",
      description: "Participe do hackathon focado em soluções tecnológicas sustentáveis.",
      points: 250,
      category: "Evento",
      difficulty: "Todos os níveis",
      duration: "48 horas",
      deadline: "2025-09-30",
      requirements: ["Trabalho em equipe"],
      status: "available"
    }
  ])

  const [inProgressActions] = useState([
    {
      id: 101,
      title: "Curso: React Hooks Avançados",
      description: "Domine os hooks avançados do React para criar aplicações mais eficientes.",
      points: 200,
      category: "Curso",
      difficulty: "Avançado",
      duration: "12 horas",
      deadline: "2025-09-18",
      progress: 75,
      startedAt: "2025-09-10"
    },
    {
      id: 102,
      title: "Projeto: Dashboard Analytics",
      description: "Desenvolvimento de um dashboard de analytics com gráficos interativos.",
      points: 180,
      category: "Projeto",
      difficulty: "Intermediário",
      duration: "15 horas",
      deadline: "2025-09-22",
      progress: 40,
      startedAt: "2025-09-08"
    }
  ])

  const startAction = (actionId) => {
    console.log('Iniciando ação:', actionId)
    // Aqui seria a lógica para iniciar uma ação
  }

  const continueAction = (actionId) => {
    console.log('Continuando ação:', actionId)
    // Aqui seria a lógica para continuar uma ação
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Iniciante': return 'bg-green-100 text-green-800'
      case 'Intermediário': return 'bg-yellow-100 text-yellow-800'
      case 'Avançado': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Curso': return <BookOpen className="h-4 w-4" />
      case 'Workshop': return <Star className="h-4 w-4" />
      case 'Projeto': return <Target className="h-4 w-4" />
      case 'Certificação': return <Award className="h-4 w-4" />
      case 'Estudo': return <BookOpen className="h-4 w-4" />
      case 'Evento': return <Calendar className="h-4 w-4" />
      default: return <Target className="h-4 w-4" />
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR')
  }

  const isDeadlineNear = (deadline) => {
    const deadlineDate = new Date(deadline)
    const today = new Date()
    const diffTime = deadlineDate - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays <= 7 && diffDays > 0
  }

  const categories = [...new Set(availableActions.map(a => a.category))]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Ações Disponíveis</h1>
          <p className="text-gray-600">Complete ações para ganhar pontos e desenvolver suas habilidades</p>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <Target className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Ações Disponíveis</p>
              <p className="text-2xl font-bold text-gray-900">{availableActions.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <Play className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Em Progresso</p>
              <p className="text-2xl font-bold text-gray-900">{inProgressActions.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <Award className="h-8 w-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pontos Disponíveis</p>
              <p className="text-2xl font-bold text-gray-900">
                {availableActions.reduce((sum, action) => sum + action.points, 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-red-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Prazos Próximos</p>
              <p className="text-2xl font-bold text-gray-900">
                {availableActions.filter(action => isDeadlineNear(action.deadline)).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="available" className="space-y-4">
        <TabsList>
          <TabsTrigger value="available">Disponíveis</TabsTrigger>
          <TabsTrigger value="in-progress">Em Progresso</TabsTrigger>
          <TabsTrigger value="categories">Por Categoria</TabsTrigger>
        </TabsList>

        <TabsContent value="available" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {availableActions.map((action) => (
              <ActionCard
                key={action.id}
                action={action}
                onStart={startAction}
                type="available"
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="in-progress" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {inProgressActions.map((action) => (
              <ActionCard
                key={action.id}
                action={action}
                onContinue={continueAction}
                type="in-progress"
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="categories" className="space-y-6">
          {categories.map(category => (
            <div key={category} className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 flex items-center space-x-2">
                {getCategoryIcon(category)}
                <span>{category}</span>
                <span className="text-sm text-gray-500">
                  ({availableActions.filter(a => a.category === category).length})
                </span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {availableActions.filter(a => a.category === category).map((action) => (
                  <ActionCard
                    key={action.id}
                    action={action}
                    onStart={startAction}
                    type="available"
                  />
                ))}
              </div>
            </div>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}

function ActionCard({ action, onStart, onContinue, type }) {
  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Iniciante': return 'bg-green-100 text-green-800'
      case 'Intermediário': return 'bg-yellow-100 text-yellow-800'
      case 'Avançado': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Curso': return <BookOpen className="h-4 w-4" />
      case 'Workshop': return <Star className="h-4 w-4" />
      case 'Projeto': return <Target className="h-4 w-4" />
      case 'Certificação': return <Award className="h-4 w-4" />
      case 'Estudo': return <BookOpen className="h-4 w-4" />
      case 'Evento': return <Calendar className="h-4 w-4" />
      default: return <Target className="h-4 w-4" />
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR')
  }

  const isDeadlineNear = (deadline) => {
    const deadlineDate = new Date(deadline)
    const today = new Date()
    const diffTime = deadlineDate - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays <= 7 && diffDays > 0
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            {getCategoryIcon(action.category)}
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
              {action.category}
            </span>
          </div>
          <div className="flex items-center space-x-1">
            <Award className="h-4 w-4 text-purple-600" />
            <span className="font-bold text-purple-600">{action.points} pts</span>
          </div>
        </div>

        <h3 className="font-medium text-gray-900 mb-2">{action.title}</h3>
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{action.description}</p>

        {type === 'in-progress' && action.progress && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-600">Progresso</span>
              <span className="text-xs text-gray-600">{action.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${action.progress}%` }}
              ></div>
            </div>
          </div>
        )}

        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center space-x-1">
              <Clock className="h-3 w-3" />
              <span>{action.duration}</span>
            </div>
            <span className={`px-2 py-1 rounded-full text-xs ${getDifficultyColor(action.difficulty)}`}>
              {action.difficulty}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center space-x-1">
              <Calendar className="h-3 w-3" />
              <span>Prazo: {formatDate(action.deadline)}</span>
            </div>
            {isDeadlineNear(action.deadline) && (
              <span className="text-red-600 font-medium">Prazo próximo!</span>
            )}
          </div>
        </div>

        {action.requirements && (
          <div className="mb-4">
            <p className="text-xs text-gray-500 mb-1">Pré-requisitos:</p>
            <div className="flex flex-wrap gap-1">
              {action.requirements.map((req, index) => (
                <span key={index} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                  {req}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-end">
          {type === 'available' ? (
            <Button
              size="sm"
              onClick={() => onStart(action.id)}
              className="bg-purple-600 hover:bg-purple-700"
            >
              Iniciar
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={() => onContinue(action.id)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Continuar
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

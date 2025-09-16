"use client";

import { useState } from "react";
import {
  CheckCircle,
  XCircle,
  Clock,
  User,
  Award,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfessorDashboardLayout from "../layouts/dashboard-layout";

export default function ProfessorHome() {
  const [pendingActions, setPendingActions] = useState([
    {
      id: 1,
      student: "Maria Silva",
      action: "Completou curso: Introdução ao React",
      date: "2025-09-15",
      time: "10:30",
      points: 100,
      status: "pending",
    },
    {
      id: 2,
      student: "João Santos",
      action: "Finalizou projeto: Dashboard SaaS",
      date: "2025-09-15",
      time: "09:15",
      points: 250,
      status: "pending",
    },
    {
      id: 3,
      student: "Ana Costa",
      action: "Participou do workshop: Web3 Fundamentals",
      date: "2025-09-14",
      time: "16:45",
      points: 75,
      status: "pending",
    },
    {
      id: 4,
      student: "Pedro Lima",
      action: "Completou certificação: TypeScript Avançado",
      date: "2025-09-14",
      time: "14:20",
      points: 200,
      status: "pending",
    },
  ]);

  const [students] = useState([
    {
      id: 1,
      name: "Maria Silva",
      email: "maria.silva@email.com",
      totalPoints: 850,
      completedActions: 12,
      lastActivity: "2025-09-15",
    },
    {
      id: 2,
      name: "João Santos",
      email: "joao.santos@email.com",
      totalPoints: 1200,
      completedActions: 18,
      lastActivity: "2025-09-15",
    },
    {
      id: 3,
      name: "Ana Costa",
      email: "ana.costa@email.com",
      totalPoints: 675,
      completedActions: 9,
      lastActivity: "2025-09-14",
    },
    {
      id: 4,
      name: "Pedro Lima",
      email: "pedro.lima@email.com",
      totalPoints: 920,
      completedActions: 15,
      lastActivity: "2025-09-14",
    },
    {
      id: 5,
      name: "Carla Oliveira",
      email: "carla.oliveira@email.com",
      totalPoints: 480,
      completedActions: 6,
      lastActivity: "2025-09-13",
    },
  ]);

  const handleActionApproval = (actionId, approved) => {
    setPendingActions((prev) =>
      prev.map((action) =>
        action.id === actionId
          ? { ...action, status: approved ? "approved" : "rejected" }
          : action
      )
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR");
  };

  return (
    <ProfessorDashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Dashboard do Professor
            </h1>
            <p className="text-gray-600">
              Gerencie ações dos alunos e acompanhe o progresso da turma
            </p>
          </div>
        </div>

        {/* Cards de resumo */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Ações Pendentes
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {
                    pendingActions.filter(
                      (action) => action.status === "pending"
                    ).length
                  }
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <User className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total de Alunos
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {students.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Ações Aprovadas Hoje
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {
                    pendingActions.filter(
                      (action) =>
                        action.status === "approved" &&
                        action.date === "2025-09-15"
                    ).length
                  }
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <Award className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Pontos Distribuídos
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {pendingActions
                    .filter((action) => action.status === "approved")
                    .reduce((sum, action) => sum + action.points, 0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs para Ações Pendentes e Alunos */}
        <Tabs defaultValue="actions" className="space-y-4">
          <TabsList>
            <TabsTrigger value="actions">Ações Pendentes</TabsTrigger>
            <TabsTrigger value="students">Alunos da Instituição</TabsTrigger>
          </TabsList>

          <TabsContent value="actions" className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  Últimas Ações para Aprovação
                </h3>
                <p className="text-sm text-gray-600">
                  Aprove ou rejeite as ações completadas pelos alunos
                </p>
              </div>

              <div className="divide-y divide-gray-200">
                {pendingActions.map((action) => (
                  <div key={action.id} className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0">
                            <User className="h-10 w-10 text-gray-400 bg-gray-100 rounded-full p-2" />
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">
                              {action.student}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {action.action}
                            </p>
                            <div className="flex items-center space-x-4 mt-1">
                              <span className="text-xs text-gray-500 flex items-center">
                                <Calendar className="h-3 w-3 mr-1" />
                                {formatDate(action.date)} às {action.time}
                              </span>
                              <span className="text-xs font-medium text-purple-600 flex items-center">
                                <Award className="h-3 w-3 mr-1" />
                                {action.points} pontos
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        {action.status === "pending" ? (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                handleActionApproval(action.id, false)
                              }
                              className="text-red-600 border-red-200 hover:bg-red-50"
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Rejeitar
                            </Button>
                            <Button
                              size="sm"
                              onClick={() =>
                                handleActionApproval(action.id, true)
                              }
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Aprovar
                            </Button>
                          </>
                        ) : (
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              action.status === "approved"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {action.status === "approved"
                              ? "Aprovado"
                              : "Rejeitado"}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="students" className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  Alunos da Instituição
                </h3>
                <p className="text-sm text-gray-600">
                  Acompanhe o progresso e pontuação dos seus alunos
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Aluno
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total de Pontos
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ações Completadas
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Última Atividade
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {students.map((student) => (
                      <tr key={student.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <User className="h-8 w-8 text-gray-400 bg-gray-100 rounded-full p-1" />
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-900">
                                {student.name}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-600">
                            {student.email}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Award className="h-4 w-4 text-purple-600 mr-1" />
                            <span className="text-sm font-medium text-purple-600">
                              {student.totalPoints}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {student.completedActions}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-600">
                            {formatDate(student.lastActivity)}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </ProfessorDashboardLayout>
  );
}

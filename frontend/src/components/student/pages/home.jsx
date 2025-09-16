"use client";

import { useState } from "react";
import {
  Award,
  Target,
  TrendingUp,
  Calendar,
  Clock,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StudentDashboardLayout from "../layouts/dashboard-layout";

export default function StudentHome({recentActions = [], balance}) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR");
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "completed":
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Completed
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            Unknown
          </span>
        );
    }
  };

  return (
    <StudentDashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Student Dashboard
            </h1>
            <p className="text-gray-600">
              Track your academic progress and achievements
            </p>
          </div>
        </div>

        {/* Cards de resumo */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <Award className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Balance</p>
                <p className="text-2xl font-bold text-gray-900">
                  {balance?.totalPoints}
                </p>
                <p className="text-xs text-gray-500">points</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">This Month</p>
                <p className="text-2xl font-bold text-gray-900">
                  {balance?.monthlyPoints}
                </p>
                <p className="text-xs text-gray-500">points earned</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <Star className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Current Level</p>
                <p className="text-lg font-bold text-gray-900">
                  {balance?.level}
                </p>
                <p className="text-xs text-gray-500">
                  {balance?.pointsToNextLevel} pts to {balance?.nextLevel}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Barra de progresso para próximo nível */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-medium text-gray-900">
              Progress to Next Level
            </h3>
            <span className="text-sm text-gray-500">
              {balance?.level} → {balance?.nextLevel}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-purple-500 to-blue-500 h-3 rounded-full transition-all duration-300"
              style={{
                width: `${((1500 - balance?.pointsToNextLevel) / 1500) * 100}%`,
              }}
            ></div>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Missing {balance?.pointsToNextLevel} points to reach level{" "}
            {balance?.nextLevel}
          </p>
        </div>

        {/* Seções de Ações e Atividades */}
        <Tabs defaultValue="recent" className="space-y-4">
          <TabsList>
            <TabsTrigger value="recent">Recent Activities</TabsTrigger>
            <TabsTrigger value="available">Available Actions</TabsTrigger>
          </TabsList>

          <TabsContent value="recent" className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  Recent Activities
                </h3>
                <p className="text-sm text-gray-600">
                  Your recently completed actions
                </p>
              </div>

              <div className="divide-y divide-gray-200">
                {recentActions.map((action) => (
                  <div key={action.id} className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0">
                            <Target className="h-10 w-10 text-purple-500 bg-purple-100 rounded-full p-2" />
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">
                              {action.title}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {action.description}
                            </p>
                            <div className="flex items-center space-x-4 mt-2">
                              <span className="text-xs text-gray-500 flex items-center">
                                <Calendar className="h-3 w-3 mr-1" />
                                {formatDate(action.date)} às {action.time}
                              </span>
                              <span className="text-xs font-medium text-purple-600 flex items-center">
                                <Award className="h-3 w-3 mr-1" />
                                {action.points} pontos
                              </span>
                              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                {action.category}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        {getStatusBadge(action.status)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                <Button variant="outline" className="w-full">
                  View All Activities
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="available" className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  Available Actions
                </h3>
                <p className="text-sm text-gray-600">
                  Complete these actions to earn points
                </p>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border border-gray-200 rounded-lg p-4 hover:border-purple-200 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-900">
                        Course: Next.js Fundamentals
                      </h4>
                      <span className="text-sm font-medium text-purple-600">
                        150 pts
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Learn the fundamentals of Next.js and React Server
                      Components
                    </p>
                    <Button
                      size="sm"
                      className="w-full bg-purple-600 hover:bg-purple-700"
                    >
                      Começar Curso
                    </Button>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4 hover:border-purple-200 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-900">
                        Workshop: UI/UX Design
                      </h4>
                      <span className="text-sm font-medium text-purple-600">
                        100 pts
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Participe do workshop sobre princípios de design de
                      interface
                    </p>
                    <Button
                      size="sm"
                      className="w-full bg-purple-600 hover:bg-purple-700"
                    >
                      Participar
                    </Button>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4 hover:border-purple-200 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-900">
                        Projeto: E-commerce App
                      </h4>
                      <span className="text-sm font-medium text-purple-600">
                        300 pts
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Desenvolva um aplicativo de e-commerce completo
                    </p>
                    <Button
                      size="sm"
                      className="w-full bg-purple-600 hover:bg-purple-700"
                    >
                      Iniciar Projeto
                    </Button>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4 hover:border-purple-200 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-900">
                        Certificação: AWS Cloud
                      </h4>
                      <span className="text-sm font-medium text-purple-600">
                        500 pts
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Obtenha certificação em serviços de nuvem AWS
                    </p>
                    <Button
                      size="sm"
                      className="w-full bg-purple-600 hover:bg-purple-700"
                    >
                      Começar Estudo
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </StudentDashboardLayout>
  );
}

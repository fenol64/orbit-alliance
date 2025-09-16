"use client";

import { useState } from "react";
import {
  Plus,
  User,
  Award,
  Calendar,
  BookOpen,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ProfessorDashboardLayout from "../layouts/dashboard-layout";

export default function ProfessorHome({availableActions = [], students = []}) {
  const [selectedAction, setSelectedAction] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleAddActionToStudent = (student) => {
    setSelectedStudent(student);
    setIsDialogOpen(true);
  };

  const handleConfirmAction = () => {
    if (selectedAction && selectedStudent) {
      const action = availableActions.find(a => a.id.toString() === selectedAction);
      console.log(`Adicionando ação "${action?.name}" para o aluno ${selectedStudent.name}`);
      // Aqui você faria a chamada para a API
      setIsDialogOpen(false);
      setSelectedAction("");
      setSelectedStudent(null);
    }
  };

  const totalStudents = students?.length || 0;
  const averagePoints = students?.length > 0 
    ? Math.round(students.reduce((sum, s) => sum + s.totalPoints, 0) / students.length)
    : 0;
  const totalActionsCompleted = students?.reduce((sum, s) => sum + s.completedActions, 0) || 0;

  return (
    <ProfessorDashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Teacher Dashboard
            </h1>
            <p className="text-gray-600">
              Manage student actions and track class progress
            </p>
          </div>
        </div>

        {/* Cards de resumo */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Students
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {totalStudents}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <Award className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Average Points
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {averagePoints}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Actions Completed
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {totalActionsCompleted}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Available Actions
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {availableActions?.length || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs para Ações Disponíveis e Alunos */}
        <Tabs defaultValue="students" className="space-y-4">
          <TabsList>
            <TabsTrigger value="students">Institution Students</TabsTrigger>
            <TabsTrigger value="actions">Available Actions</TabsTrigger>
          </TabsList>

          <TabsContent value="students" className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  Institute students
                </h3>
                <p className="text-sm text-gray-600">
                  Track the progress and points of your students. Click "Add Action" to assign actions to students.
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Student
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total Points
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Completed Actions
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Last Activity
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {students?.map((student) => (
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
                            {student.lastActivity}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Button
                            size="sm"
                            onClick={() => handleAddActionToStudent(student)}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Add Action
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="actions" className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  Available Actions
                </h3>
                <p className="text-sm text-gray-600">
                  Actions that can be assigned to students
                </p>
              </div>

              <div className="divide-y divide-gray-200">
                {availableActions?.map((action) => (
                  <div key={action.id} className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-900">
                          {action.name}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">
                          {action.description}
                        </p>
                        <div className="flex items-center space-x-4 mt-2">
                          <span className="text-xs font-medium text-purple-600 flex items-center">
                            <Award className="h-3 w-3 mr-1" />
                            {action.points} pontos
                          </span>
                          <span className="text-xs text-gray-500">
                            {action.category}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Dialog para adicionar ação a um aluno */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                Add Action to {selectedStudent?.name}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="action-select">Select Action</Label>
                <select
                  id="action-select"
                  value={selectedAction}
                  onChange={(e) => setSelectedAction(e.target.value)}
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select an action...</option>
                  {availableActions?.map((action) => (
                    <option key={action.id} value={action.id}>
                      {action.name} ({action.points} pontos)
                    </option>
                  ))}
                </select>
              </div>
              
              {selectedAction && (
                <div className="p-3 bg-gray-50 rounded-md">
                  {(() => {
                    const action = availableActions.find(a => a.id.toString() === selectedAction);
                    return action ? (
                      <>
                        <p className="text-sm font-medium">{action.name}</p>
                        <p className="text-sm text-gray-600">{action.description}</p>
                        <p className="text-sm text-purple-600 font-medium">
                          Reward: {action.points} points
                        </p>
                      </>
                    ) : null;
                  })()}
                </div>
              )}

              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsDialogOpen(false);
                    setSelectedAction("");
                    setSelectedStudent(null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleConfirmAction}
                  disabled={!selectedAction}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Add Action
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </ProfessorDashboardLayout>
  );
}

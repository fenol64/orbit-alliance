import { useState } from 'react'
import UserHeader from '@/components/ui/user-header'

const professorNavItems = [
  {
    title: "Dashboard",
    href: "/",
    icon: "LayoutDashboard"
  },
  {
    title: "Ações Pendentes",
    href: "/acoes-pendentes",
    icon: "Clock"
  },
  {
    title: "Alunos",
    href: "/alunos",
    icon: "Users"
  },
  {
    title: "Turmas",
    href: "/turmas",
    icon: "BookOpen"
  },
  {
    title: "Relatórios",
    href: "/relatorios",
    icon: "BarChart"
  }
]

export default function ProfessorDashboardLayout({ children }) {
  const [selectedInstitution, setSelectedInstitution] = useState("UNESC - Universidade do Extremo Sul")

  // Mock data - em produção viria da API
  const institutions = [
    { id: 1, name: "UNESC - Universidade do Extremo Sul", role: "Professor" },
    { id: 2, name: "UFSC - Universidade Federal de SC", role: "Aluno" },
    { id: 3, name: "Instituto Federal de SC", role: "Professor" }
  ]

  return (
    <div className="flex h-screen bg-gray-100">
      <main className="flex-1 flex flex-col overflow-hidden">
        <UserHeader
          userType="professor"
          userName="Prof. João Silva"
          institutions={institutions}
          selectedInstitution={selectedInstitution}
          onInstitutionChange={setSelectedInstitution}
        />
        <div className="flex-1 overflow-y-auto p-6">
          {children}
        </div>
      </main>
    </div>
  )
}

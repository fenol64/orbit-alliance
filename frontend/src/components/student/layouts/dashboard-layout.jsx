import { useState } from 'react'
import UserHeader from '@/components/ui/user-header'

export default function StudentDashboardLayout({ children }) {
  const [selectedInstitution, setSelectedInstitution] = useState("UNESC - Universidade do Extremo Sul")

  // Mock data - em produção viria da API
  const institutions = [
    { id: 1, name: "UNESC - Universidade do Extremo Sul", role: "Aluno" },
    { id: 2, name: "UFSC - Universidade Federal de SC", role: "Aluno" },
    { id: 3, name: "Instituto Federal de SC", role: "Professor" }
  ]

  return (
    <div className="flex h-screen bg-gray-100">
      <main className="flex-1 flex flex-col overflow-hidden">
        <UserHeader
          userType="student"
          userName="Maria Silva"
          institutions={institutions}
          selectedInstitution={selectedInstitution}
          onInstitutionChange={setSelectedInstitution}
          showProductsLink={true}
          showActionsLink={true}
        />
        <div className="flex-1 overflow-y-auto p-6">
          {children}
        </div>
      </main>
    </div>
  )
}

import ProfessorHeader from './professor-header'

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
  return (
    <div className="flex h-screen bg-gray-100">
      <main className="flex-1 flex flex-col overflow-hidden">
        <ProfessorHeader />
        <div className="flex-1 overflow-y-auto p-6">
          {children}
        </div>
      </main>
    </div>
  )
}

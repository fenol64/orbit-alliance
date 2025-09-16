import DashboardLayout from '@/components/dashboard-layout'

export default function Home() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Bem-vindo ao painel de controle da Orbit Alliance
          </p>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="tracking-tight text-sm font-medium">Total Professores</h3>
            </div>
            <div className="text-2xl font-bold">145</div>
            <p className="text-xs text-muted-foreground">
              +10% em relação ao mês passado
            </p>
          </div>
          
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="tracking-tight text-sm font-medium">Produtos Ativos</h3>
            </div>
            <div className="text-2xl font-bold">89</div>
            <p className="text-xs text-muted-foreground">
              +5% em relação ao mês passado
            </p>
          </div>
          
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="tracking-tight text-sm font-medium">Ações Realizadas</h3>
            </div>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">
              +15% em relação ao mês passado
            </p>
          </div>
          
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="tracking-tight text-sm font-medium">Usuários Online</h3>
            </div>
            <div className="text-2xl font-bold">67</div>
            <p className="text-xs text-muted-foreground">
              +3% em relação à última hora
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

import DashboardLayout from "@/components/institute/layouts/dashboard-layout";

export default function InstituteHome({ data }) {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome to the Orbit Alliance dashboard
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="tracking-tight text-sm font-medium">
                Teachers
              </h3>
            </div>
            <div className="text-2xl font-bold">{data.teachers}</div>
          </div>

          <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="tracking-tight text-sm font-medium">
                Active Products
              </h3>
            </div>
            <div className="text-2xl font-bold">{data.activeProducts}</div>
          </div>

          <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="tracking-tight text-sm font-medium">
                Actions Taken
              </h3>
            </div>
            <div className="text-2xl font-bold">{data.actionsTaken}</div>
          </div>

          <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="tracking-tight text-sm font-medium">
                Students
              </h3>
            </div>
            <div className="text-2xl font-bold">{data.students}</div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

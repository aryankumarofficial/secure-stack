import ProtectedRoute from "@/components/auth/protected-route"

import DashboardHeader from "@/components/layout/dashboard-header"

import AppSidebar from "@/components/layout/app-sidebar"

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute>
      <div className="flex min-h-screen">
        <AppSidebar />

        <div className="flex-1">
          <DashboardHeader />

          <main className="p-6">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}
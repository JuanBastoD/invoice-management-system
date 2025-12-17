"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { InvoicesTab } from "@/components/invoices-tab"
import { StatsCards } from "@/components/stats-cards"
import { FileText } from "lucide-react"

export function InvoicesDashboard() {
  const [activeTab, setActiveTab] = useState<string | undefined>(undefined)
  const [stats, setStats] = useState<any>(null)

  useEffect(() => {
    setActiveTab("invoices")
    fetch("http://localhost:8000/estadisticas")  // endpoint del backend
      .then(res => res.json())
      .then(data => setStats(data))
  }, [])

  if (!activeTab) return null

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">Sistema de Facturación</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Gestiona tus facturas de forma profesional
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {stats && <StatsCards stats={stats} />}  {/* Mostrar stats solo cuando llegan los datos */}

        <div className="mt-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full max-w-md grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1">
              <TabsTrigger value="invoices" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Facturas
              </TabsTrigger>
            </TabsList>

            <TabsContent value="invoices" className="space-y-4">
              <InvoicesTab />  {/* Aquí está toda la lista de facturas + dialog */}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}

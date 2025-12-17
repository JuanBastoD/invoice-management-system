"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { InvoicesTab } from "@/components/invoices-tab"
import { StatsCards } from "@/components/stats-cards"
import { FileText, Users } from "lucide-react"

export function InvoicesDashboard() {
  const [activeTab, setActiveTab] = useState("invoices")

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">Sistema de Facturación</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Gestiona tus facturas y clientes de forma profesional
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <StatsCards />

        <div className="mt-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="invoices" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Facturas
              </TabsTrigger>
              <TabsTrigger value="clients" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Clientes
              </TabsTrigger>
            </TabsList>

            <TabsContent value="invoices" className="space-y-4">
              <InvoicesTab />
            </TabsContent>

            <TabsContent value="clients" className="space-y-4">
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}

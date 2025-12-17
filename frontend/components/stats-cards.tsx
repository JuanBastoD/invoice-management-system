"use client"

import { Card, CardContent } from "@/components/ui/card"
import { FileText, DollarSign, Clock, CheckCircle, Calendar } from "lucide-react"

interface StatsCardsProps {
  stats: {
    total_facturado: number
    pendientes: number
    pagadas: number
    vencidas: number
    cantidad_total: number
    total_mes_actual: number
  }
}

export function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    { title: "Total Facturas", value: stats.cantidad_total, icon: FileText, color: "text-primary", bgColor: "bg-primary/10" },
    { title: "Ingresos Totales", value: `$${stats.total_facturado.toLocaleString()}`, icon: DollarSign, color: "text-chart-2", bgColor: "bg-chart-2/10" },
    { title: "Pendientes", value: stats.pendientes, icon: Clock, color: "text-chart-1", bgColor: "bg-chart-1/10" },
    { title: "Pagadas", value: stats.pagadas, icon: CheckCircle, color: "text-chart-4", bgColor: "bg-chart-4/10" },
    { title: "Vencidas", value: stats.vencidas, icon: Clock, color: "text-red-500", bgColor: "bg-red-100" },
    { title: "Total Mes Actual", value: `$${stats.total_mes_actual.toLocaleString()}`, icon: Calendar, color: "text-blue-500", bgColor: "bg-blue-100" },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.title} className="overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">{card.title}</p>
                <p className="text-2xl font-bold tracking-tight">{card.value}</p>
              </div>
              <div className={`rounded-lg p-3 ${card.bgColor}`}>
                <card.icon className={`h-6 w-6 ${card.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

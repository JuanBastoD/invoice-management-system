"use client"

import { Card, CardContent } from "@/components/ui/card"
import { FileText, DollarSign, Clock, CheckCircle } from "lucide-react"

export function StatsCards() {
  const stats = [
    {
      title: "Total Facturas",
      value: "24",
      icon: FileText,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Ingresos Totales",
      value: "$45,231",
      icon: DollarSign,
      color: "text-chart-2",
      bgColor: "bg-chart-2/10",
    },
    {
      title: "Pendientes",
      value: "8",
      icon: Clock,
      color: "text-chart-1",
      bgColor: "bg-chart-1/10",
    },
    {
      title: "Pagadas",
      value: "16",
      icon: CheckCircle,
      color: "text-chart-4",
      bgColor: "bg-chart-4/10",
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title} className="overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                <p className="text-2xl font-bold tracking-tight">{stat.value}</p>
              </div>
              <div className={`rounded-lg p-3 ${stat.bgColor}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

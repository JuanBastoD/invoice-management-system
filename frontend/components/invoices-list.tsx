"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreVertical, Edit, Download, Trash2 } from "lucide-react"
import { generateInvoicePDF } from "@/lib/pdf-generator"

interface Invoice {
  id: string
  clientName: string
  date: string
  total: number
  status: "paid" | "pending" | "overdue"
  items: Array<{ description: string; quantity: number; price: number }>
}

// Datos de ejemplo - esto vendrá del backend de Persona A
const mockInvoices: Invoice[] = [
  {
    id: "INV-001",
    clientName: "Empresa ABC S.A.",
    date: "2024-01-15",
    total: 5250.0,
    status: "paid",
    items: [
      { description: "Servicio de Consultoría", quantity: 10, price: 500 },
      { description: "Desarrollo Web", quantity: 1, price: 250 },
    ],
  },
  {
    id: "INV-002",
    clientName: "Tech Solutions Ltd.",
    date: "2024-01-20",
    total: 3800.0,
    status: "pending",
    items: [{ description: "Soporte Técnico", quantity: 20, price: 190 }],
  },
  {
    id: "INV-003",
    clientName: "Comercial XYZ",
    date: "2024-01-10",
    total: 1500.0,
    status: "overdue",
    items: [{ description: "Mantenimiento", quantity: 5, price: 300 }],
  },
]

interface InvoicesListProps {
  searchQuery: string
  onEdit: (invoice: Invoice) => void
}

export function InvoicesList({ searchQuery, onEdit }: InvoicesListProps) {
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices)

  const filteredInvoices = invoices.filter(
    (invoice) =>
      invoice.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.clientName.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleDownloadPDF = async (invoice: Invoice) => {
    await generateInvoicePDF(invoice)
  }

  const handleDelete = (id: string) => {
    // Aquí se integrará con el backend de Persona A
    setInvoices(invoices.filter((inv) => inv.id !== id))
  }

  const getStatusBadge = (status: Invoice["status"]) => {
    const variants = {
      paid: { label: "Pagada", className: "bg-chart-4 text-chart-4-foreground" },
      pending: {
        label: "Pendiente",
        className: "bg-chart-2 text-chart-2-foreground",
      },
      overdue: {
        label: "Vencida",
        className: "bg-chart-1 text-chart-1-foreground",
      },
    }
    const variant = variants[status]
    return <Badge className={variant.className}>{variant.label}</Badge>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lista de Facturas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInvoices.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No se encontraron facturas.
                  </TableCell>
                </TableRow>
              ) : (
                filteredInvoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-mono font-medium">{invoice.id}</TableCell>
                    <TableCell>{invoice.clientName}</TableCell>
                    <TableCell>{new Date(invoice.date).toLocaleDateString("es-ES")}</TableCell>
                    <TableCell className="font-medium">
                      ${invoice.total.toLocaleString("es-ES", { minimumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onEdit(invoice)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDownloadPDF(invoice)}>
                            <Download className="mr-2 h-4 w-4" />
                            Descargar PDF
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDelete(invoice.id)} className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Eliminar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

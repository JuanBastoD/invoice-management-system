"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trash2, Eye } from "lucide-react"

interface Invoice {
  id: number
  tipo: string
  entidad: string
  estado: string
  fecha_emision: string
  fecha_vencimiento: string
  monto: number
  descripcion: string
  path_pdf: string
}

export function InvoicesList() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [refreshKey, setRefreshKey] = useState(0)

  const fetchInvoices = async () => {
    try {
      const res = await fetch("http://localhost:8000/facturas")
      const data = await res.json()
      setInvoices(data)
    } catch (error) {
      console.error("Error al cargar facturas:", error)
    }
  }

  useEffect(() => {
    fetchInvoices()
  }, [refreshKey])

  const handleDelete = async (id: number) => {
    // opcional: POST/DELETE al backend si lo implementas
    setInvoices(invoices.filter((inv) => inv.id !== id))
  }

  const handleViewPDF = (path_pdf: string) => {
    // Solo tomamos el nombre del archivo
    const filename = path_pdf.split("/").pop()
    if (filename) {
      window.open(`http://localhost:8000/pdf/${filename}`, "_blank")
    } else {
      console.error("Nombre de archivo no válido:", path_pdf)
    }
  }

  const getStatusBadge = (estado: string) => {
    const variants: Record<string, { label: string; className: string }> = {
      pendiente: { label: "Pendiente", className: "bg-yellow-500 text-white" },
      pagada: { label: "Pagada", className: "bg-green-500 text-white" },
      vencida: { label: "Vencida", className: "bg-red-500 text-white" },
    }
    const variant = variants[estado] || { label: estado, className: "bg-gray-500 text-white" }
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
                <TableHead>Tipo</TableHead>
                <TableHead>Entidad</TableHead>
                <TableHead>Monto</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No se encontraron facturas.
                  </TableCell>
                </TableRow>
              ) : (
                invoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell>{invoice.id}</TableCell>
                    <TableCell>{invoice.tipo}</TableCell>
                    <TableCell>{invoice.entidad}</TableCell>
                    <TableCell>${invoice.monto.toLocaleString()}</TableCell>
                    <TableCell>{getStatusBadge(invoice.estado)}</TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewPDF(invoice.path_pdf)}
                        className="gap-2"
                      >
                        <Eye className="h-4 w-4" /> Ver PDF
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(invoice.id)}
                        className="ml-2 gap-2"
                      >
                        <Trash2 className="h-4 w-4" /> Eliminar
                      </Button>
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

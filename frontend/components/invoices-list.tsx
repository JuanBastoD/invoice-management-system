"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trash2, Eye, Edit } from "lucide-react"

interface Invoice {
  id: number
  numero_factura: string
  tipo: string
  entidad: string
  estado: string
  fecha_emision: string
  fecha_vencimiento: string
  monto: number
  descripcion: string
  path_pdf: string
}

interface InvoicesListProps {
  searchQuery: string
  onEdit: (invoice: Invoice) => void
  refreshKey: number
}

export function InvoicesList({ searchQuery, onEdit, refreshKey }: InvoicesListProps) {
  const [invoices, setInvoices] = useState<Invoice[]>([])

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
    try {
      const res = await fetch(`http://localhost:8000/facturas/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Error eliminando factura")
      fetchInvoices()
    } catch (error) {
      console.error(error)
      alert("No se pudo eliminar la factura")
    }
  }

  const handleViewPDF = (path_pdf: string) => {
    const filename = path_pdf.split("/").pop()
    if (filename) window.open(`http://localhost:8000/pdf/${filename}`, "_blank")
  }

  const getStatusBadge = (estado: string) => {
    const variants: Record<string, { label: string; className: string }> = {
      pendiente: { label: "Pendiente", className: "bg-yellow-500 text-white" },
      pagada: { label: "Pagada", className: "bg-green-500 text-white" },
      vencida: { label: "Vencida", className: "bg-red-500 text-white" },
    }
    return <Badge className={variants[estado]?.className || "bg-gray-500 text-white"}>{variants[estado]?.label || estado}</Badge>
  }

  const filteredInvoices = invoices.filter(
    (inv) =>
      inv.entidad?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.tipo?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.numero_factura?.toLowerCase().includes(searchQuery.toLowerCase())
  )

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
                <TableHead>Número</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Entidad</TableHead>
                <TableHead>Monto</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Fecha Emisión</TableHead>
                <TableHead>Fecha Vencimiento</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInvoices.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="h-24 text-center">
                    No se encontraron facturas.
                  </TableCell>
                </TableRow>
              ) : (
                filteredInvoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell>{invoice.id}</TableCell>
                    <TableCell>{invoice.numero_factura}</TableCell>
                    <TableCell>{invoice.tipo}</TableCell>
                    <TableCell>{invoice.entidad}</TableCell>
                    <TableCell>${invoice.monto.toLocaleString()}</TableCell>
                    <TableCell>{getStatusBadge(invoice.estado)}</TableCell>
                    <TableCell>{invoice.fecha_emision}</TableCell>
                    <TableCell>{invoice.fecha_vencimiento || "-"}</TableCell>
                    <TableCell className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleViewPDF(invoice.path_pdf)}>
                        <Eye className="h-4 w-4" /> Ver PDF
                      </Button>
                      <Button variant="default" size="sm" onClick={() => onEdit(invoice)}>
                        <Edit className="h-4 w-4" /> Editar
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(invoice.id)}>
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

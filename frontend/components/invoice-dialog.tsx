"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

interface InvoiceDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreated: () => void
  invoice?: any
}

export function InvoiceDialog({ open, onOpenChange, onCreated, invoice }: InvoiceDialogProps) {
  const [numeroFactura, setNumeroFactura] = useState("")
  const [tipo, setTipo] = useState("")
  const [entidad, setEntidad] = useState("")
  const [estado, setEstado] = useState("pendiente")
  const [monto, setMonto] = useState("")
  const [descripcion, setDescripcion] = useState("")
  const [fechaEmision, setFechaEmision] = useState("")
  const [fechaVencimiento, setFechaVencimiento] = useState("")
  const [archivo, setArchivo] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (invoice) {
      setNumeroFactura(invoice.numero_factura || "")
      setTipo(invoice.tipo || "")
      setEntidad(invoice.entidad || "")
      setEstado(invoice.estado || "pendiente")
      setMonto(invoice.monto?.toString() || "")
      setDescripcion(invoice.descripcion || "")
      setFechaEmision(invoice.fecha_emision || "")
      setFechaVencimiento(invoice.fecha_vencimiento || "")
      setArchivo(null)
    } else if (!open) {
      setNumeroFactura("")
      setTipo("")
      setEntidad("")
      setEstado("pendiente")
      setMonto("")
      setDescripcion("")
      setFechaEmision("")
      setFechaVencimiento("")
      setArchivo(null)
    }
  }, [open, invoice])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!numeroFactura || !tipo || !entidad || !fechaEmision || !monto) {
      alert("Completa todos los campos obligatorios")
      return
    }

    try {
      setLoading(true)
      let path_pdf = invoice?.path_pdf || null

      if (archivo) {
        const formData = new FormData()
        formData.append("pdf", archivo)
        const pdfRes = await fetch("http://localhost:8000/upload/pdf", {
          method: "POST",
          body: formData,
        })
        if (!pdfRes.ok) throw new Error("Error subiendo PDF")
        const data = await pdfRes.json()
        path_pdf = data.path_pdf
      }

      const facturaData = {
        numero_factura: numeroFactura,
        tipo,
        entidad,
        estado,
        monto: parseFloat(monto),
        descripcion: descripcion || null,
        fecha_emision: fechaEmision,
        fecha_vencimiento: fechaVencimiento || null,
        path_pdf,
      }

      if (invoice) {
        // Editar factura
        const res = await fetch(`http://localhost:8000/facturas/${invoice.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(facturaData),
        })
        if (!res.ok) throw new Error("Error editando factura")
      } else {
        // Crear factura
        const res = await fetch("http://localhost:8000/facturas", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(facturaData),
        })
        if (!res.ok) throw new Error("Error creando factura")
      }

      onOpenChange(false)
      onCreated()
    } catch (err: any) {
      console.error(err)
      alert("Error: " + (err.message || err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>{invoice ? "Editar Factura" : "Nueva Factura"}</DialogTitle>
          <DialogDescription>
            {invoice ? "Modifica los datos de la factura existente." : "Registra una nueva factura en el sistema."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Campos idénticos a los que ya tenías */}
          {/* Número de factura, tipo, entidad, estado, monto, descripción, fechas y PDF */}
          <div>
            <Label>Número de factura</Label>
            <Input value={numeroFactura} onChange={(e) => setNumeroFactura(e.target.value)} required />
          </div>

          <div>
            <Label>Tipo</Label>
            <Select value={tipo} onValueChange={setTipo} required>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona el tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="entrada">Entrada</SelectItem>
                <SelectItem value="salida">Salida</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Entidad</Label>
            <Input value={entidad} onChange={(e) => setEntidad(e.target.value)} required />
          </div>

          <div>
            <Label>Estado</Label>
            <Select value={estado} onValueChange={setEstado}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pendiente">Pendiente</SelectItem>
                <SelectItem value="pagada">Pagada</SelectItem>
                <SelectItem value="vencida">Vencida</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Monto</Label>
            <Input type="number" step="0.01" value={monto} onChange={(e) => setMonto(e.target.value)} required />
          </div>

          <div>
            <Label>Descripción</Label>
            <Textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Fecha emisión</Label>
              <Input type="date" value={fechaEmision} onChange={(e) => setFechaEmision(e.target.value)} required />
            </div>
            <div>
              <Label>Fecha vencimiento</Label>
              <Input type="date" value={fechaVencimiento} onChange={(e) => setFechaVencimiento(e.target.value)} />
            </div>
          </div>

          <div>
            <Label>PDF</Label>
            <Input type="file" accept="application/pdf" onChange={(e) => setArchivo(e.target.files?.[0] || null)} />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Guardando..." : invoice ? "Guardar cambios" : "Crear factura"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

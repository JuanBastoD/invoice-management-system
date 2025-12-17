"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { InvoicesList } from "@/components/invoices-list"
import { InvoiceDialog } from "@/components/invoice-dialog"
import { Plus, Search } from "lucide-react"

export function InvoicesTab() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null)
  const [refreshKey, setRefreshKey] = useState(0)

  const handleEdit = (invoice: any) => {
    setSelectedInvoice(invoice)
    setIsDialogOpen(true)
  }

  const handleCreate = () => {
    setSelectedInvoice(null)
    setIsDialogOpen(true)
  }

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 sm:max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar facturas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button onClick={handleCreate} className="gap-2">
          <Plus className="h-4 w-4" />
          Nueva Factura
        </Button>
      </div>

      <InvoicesList searchQuery={searchQuery} onEdit={handleEdit} refreshKey={refreshKey} />

      <InvoiceDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onCreated={handleRefresh}
        invoice={selectedInvoice}
      />
    </div>
  )
}

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ClientsList } from "@/components/clients-list"
import { ClientDialog } from "@/components/client-dialog"
import { Plus, Search } from "lucide-react"

export function ClientsTab() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedClient, setSelectedClient] = useState<any>(null)

  const handleEdit = (client: any) => {
    setSelectedClient(client)
    setIsDialogOpen(true)
  }

  const handleCreate = () => {
    setSelectedClient(null)
    setIsDialogOpen(true)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 sm:max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar clientes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button onClick={handleCreate} className="gap-2">
          <Plus className="h-4 w-4" />
          Nuevo Cliente
        </Button>
      </div>

      <ClientsList searchQuery={searchQuery} onEdit={handleEdit} />

      <ClientDialog client={selectedClient} open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </div>
  )
}

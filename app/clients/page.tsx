"use client"

import { useEffect, useState } from "react"
import { Search } from "lucide-react"
import { AppShell } from "@/components/dashboard/app-shell"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { getClients, relanceClient, type ClientsListItem } from "@/lib/api"
import { statusStyles, type Status } from "@/lib/clients-data"
import { cn } from "@/lib/utils"

const filters: (Status | "Tous")[] = ["Tous", "Fidèle", "À relancer", "Perdu"]

export default function ClientsPage() {
  const [query, setQuery] = useState("")
  const [filter, setFilter] = useState<Status | "Tous">("Tous")
  const [clients, setClients] = useState<ClientsListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [relanceMessage, setRelanceMessage] = useState<string | null>(null)

  useEffect(() => {
    const params = new URLSearchParams()

    if (query.trim()) {
      params.set("search", query.trim())
    }

    if (filter !== "Tous") {
      params.set("status", filter)
    }

    setLoading(true)
    setError(null)

    getClients(params)
      .then((response) => setClients(response.data))
      .catch((fetchError) => {
        setError(fetchError instanceof Error ? fetchError.message : "Erreur API")
      })
      .finally(() => setLoading(false))
  }, [query, filter])

  async function handleRelance(clientId: string) {
    setRelanceMessage(null)

    try {
      const response = await relanceClient(clientId, { channel: "email" })
      setRelanceMessage(response.message)
    } catch (relanceError) {
      setRelanceMessage(
        relanceError instanceof Error ? relanceError.message : "Relance impossible",
      )
    }
  }

  return (
    <AppShell>
      <Card className="p-4 sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Rechercher un client..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                  filter === f
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-muted-foreground hover:bg-muted",
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
        {error && (
          <p className="mt-4 text-sm text-rose-600">{error}</p>
        )}
        {relanceMessage && !error && (
          <p className="mt-4 text-sm text-emerald-700">{relanceMessage}</p>
        )}
      </Card>

      <Card className="p-0">
        <div className="overflow-x-auto">
          <Table className="min-w-[640px]">
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="pl-6">Client</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Catégorie</TableHead>
                <TableHead>Dernier Achat</TableHead>
                <TableHead className="text-right">Total dépensé</TableHead>
                <TableHead className="pr-6 text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clients.map((c) => (
                <TableRow key={c.email}>
                  <TableCell className="pl-6">
                    <div className="flex flex-col">
                      <span className="font-medium text-foreground">
                        {c.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {c.email}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`font-medium ${statusStyles[c.status]}`}
                    >
                      {c.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {c.category}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {c.lastPurchase}
                  </TableCell>
                  <TableCell className="text-right font-medium text-foreground">
                    {c.total} €
                  </TableCell>
                  <TableCell className="pr-6 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-accent-foreground hover:bg-accent"
                      onClick={() => handleRelance(c.id)}
                    >
                      Relancer
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {!loading && clients.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="py-10 text-center text-sm text-muted-foreground"
                  >
                    Aucun client ne correspond à votre recherche.
                  </TableCell>
                </TableRow>
              )}
              {loading && (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="py-10 text-center text-sm text-muted-foreground"
                  >
                    Chargement des clients...
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </AppShell>
  )
}

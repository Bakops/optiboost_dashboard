import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type Status = "Fidèle" | "À relancer" | "Perdu"
type DashboardClient = { id: string; name: string; status: Status; lastPurchase: string }

const statusStyles: Record<Status, string> = {
  Fidèle: "bg-emerald-50 text-emerald-700 border-emerald-200",
  "À relancer": "bg-amber-50 text-amber-700 border-amber-200",
  Perdu: "bg-rose-50 text-rose-700 border-rose-200",
}

export function ClientsTable({ clients }: { clients: DashboardClient[] }) {
  return (
    <Card className="p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex flex-col">
          <span className="text-sm font-medium text-foreground">
            Liste des Clients
          </span>
          <p className="text-xs text-muted-foreground">
            {clients.length} clients affichés
          </p>
        </div>
      </div>
      <div className="overflow-x-auto">
        <Table className="min-w-[480px]">
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="pl-6">Nom</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Dernier Achat</TableHead>
            <TableHead className="pr-6 text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients.map((c) => (
            <TableRow key={c.id}>
              <TableCell className="pl-6 font-medium text-foreground">
                {c.name}
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
                {c.lastPurchase}
              </TableCell>
              <TableCell className="pr-6 text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-accent-foreground hover:bg-accent"
                >
                  Relancer
                </Button>
              </TableCell>
            </TableRow>
          ))}
          {clients.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={4}
                className="py-10 text-center text-sm text-muted-foreground"
              >
                Aucun client récent à afficher.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      </div>
    </Card>
  )
}

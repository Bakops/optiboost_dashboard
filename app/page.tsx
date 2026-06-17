import { FileSpreadsheet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AppShell } from "@/components/dashboard/app-shell"
import { KpiCards } from "@/components/dashboard/kpi-cards"
import { RoiAndCampaigns } from "@/components/dashboard/roi-campaigns"
import { ClientsTable } from "@/components/dashboard/clients-table"

export default function Page() {
  return (
    <AppShell
      action={
        <Button className="gap-2">
          <FileSpreadsheet className="h-4 w-4" />
          <span className="hidden sm:inline">Importer un fichier Excel</span>
          <span className="sm:hidden">Importer</span>
        </Button>
      }
    >
      <KpiCards />
      <RoiAndCampaigns />
      <ClientsTable />
    </AppShell>
  )
}

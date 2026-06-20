import Link from "next/link"
import { FileSpreadsheet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AppShell } from "@/components/dashboard/app-shell"
import { KpiCards } from "@/components/dashboard/kpi-cards"
import { RoiAndCampaigns } from "@/components/dashboard/roi-campaigns"
import { ClientsTable } from "@/components/dashboard/clients-table"
import {
  getDashboardCampaignsSummary,
  getDashboardOverview,
  getDashboardRecentClients,
  type DashboardOverview,
  type RecentClient,
} from "@/lib/api"

export default async function Page() {
  let overview: DashboardOverview = {
    averageBasket: 0,
    averageBasketDelta: 0,
    premiumRatio: 0,
    segments: { fidele: 0, aRelancer: 0, perdu: 0 },
    recoveryPotential: 0,
    quickCampaignCounts: { email: 0, sms: 0, whatsapp: 0 },
  }
  let recentClients: RecentClient[] = []

  try {
    ;[overview, recentClients] = await Promise.all([
      getDashboardOverview(),
      getDashboardRecentClients(),
      getDashboardCampaignsSummary(),
    ])
  } catch {
    recentClients = []
  }

  return (
    <AppShell
      action={
        <Link href="/import">
          <Button className="gap-2 cursor-pointer" variant="secondary">
            <FileSpreadsheet className="h-4 w-4" />
            <span className="hidden sm:inline">Importer un fichier Excel</span>
            <span className="sm:hidden">Importer</span>
          </Button>
        </Link>
      }
    >
      <KpiCards
        averageBasket={overview.averageBasket}
        averageBasketDelta={overview.averageBasketDelta}
        premiumRatio={overview.premiumRatio}
        segments={overview.segments}
      />
      <RoiAndCampaigns
        recoveryPotential={overview.recoveryPotential}
        quickCampaignCounts={overview.quickCampaignCounts}
      />
      <ClientsTable clients={recentClients} />
    </AppShell>
  )
}

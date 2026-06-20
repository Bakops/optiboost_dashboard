import Link from "next/link"
import { Mail, MessageSquare, Phone, Plus } from "lucide-react"
import { AppShell } from "@/components/dashboard/app-shell"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  getCampaignAnalytics,
  getCampaigns,
  getDashboardOverview,
  launchCampaign,
  type Campaign,
  type DashboardOverview,
} from "@/lib/api"

const statusBadgeMap: Record<string, string> = {
  running: "bg-emerald-50 text-emerald-700 border-emerald-200",
  scheduled: "bg-amber-50 text-amber-700 border-amber-200",
  completed: "bg-muted text-muted-foreground border-border",
  paused: "bg-sky-50 text-sky-700 border-sky-200",
  draft: "bg-slate-50 text-slate-700 border-slate-200",
  cancelled: "bg-rose-50 text-rose-700 border-rose-200",
}

const statusLabelMap: Record<string, string> = {
  running: "En cours",
  scheduled: "Programmée",
  completed: "Terminée",
  paused: "En pause",
  draft: "Brouillon",
  cancelled: "Annulée",
}

const channelLabelMap: Record<string, string> = {
  email: "E-mail",
  sms: "SMS",
  whatsapp: "WhatsApp",
}

const channelDescriptionMap: Record<string, string> = {
  email: "Idéal pour les rappels d'examen visuel",
  sms: "Taux d'ouverture élevé, message court",
  whatsapp: "Conversation directe et personnalisée",
}

export default async function CampagnesPage() {
  let overview: DashboardOverview = {
    averageBasket: 0,
    averageBasketDelta: 0,
    premiumRatio: 0,
    segments: { fidele: 0, aRelancer: 0, perdu: 0 },
    recoveryPotential: 0,
    quickCampaignCounts: { email: 0, sms: 0, whatsapp: 0 },
  }
  let campaigns: Campaign[] = []

  try {
    ;[overview, campaigns] = await Promise.all([
      getDashboardOverview(),
      getCampaigns(),
    ])
  } catch {
    campaigns = []
  }

  const channels = [
    {
      key: "email",
      label: "E-mail",
      icon: Mail,
      count: overview.quickCampaignCounts.email,
      desc: channelDescriptionMap.email,
    },
    {
      key: "sms",
      label: "SMS",
      icon: MessageSquare,
      count: overview.quickCampaignCounts.sms,
      desc: channelDescriptionMap.sms,
    },
    {
      key: "whatsapp",
      label: "WhatsApp",
      icon: Phone,
      count: overview.quickCampaignCounts.whatsapp,
      desc: channelDescriptionMap.whatsapp,
    },
  ]

  const recentCampaigns = await Promise.all(
    campaigns.map(async (campaign) => {
      const analytics = await getCampaignAnalytics(campaign.id).catch(() => ({
        sent: 0,
        delivered: 0,
        opened: 0,
        clicked: 0,
        replied: 0,
        failed: 0,
        revenueGenerated: 0,
      }))

      return {
        ...campaign,
        sent: analytics.sent,
        opened: analytics.opened,
      }
    }),
  )

  return (
    <AppShell
      action={
        <Link href="/clients">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Nouvelle campagne</span>
            <span className="sm:hidden">Nouvelle</span>
          </Button>
        </Link>
      }
    >
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {channels.map((c) => {
          const Icon = c.icon
          return (
            <Card key={c.label} className="p-6">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-md bg-accent text-accent-foreground">
                  <Icon className="h-4 w-4" />
                </span>
                <span className="text-sm font-medium text-foreground">
                  Campagne {c.label}
                </span>
              </div>
              <div className="mt-4 text-2xl font-semibold tracking-tight text-foreground">
                {c.count}
              </div>
              <p className="text-xs text-muted-foreground">clients ciblés</p>
              <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                {c.desc}
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-4 w-full bg-card"
                formAction={async () => {
                  "use server"
                  const matchingCampaign = campaigns.find(
                    (campaign) => campaign.channel === c.key,
                  )

                  if (matchingCampaign) {
                    await launchCampaign(matchingCampaign.id)
                  }
                }}
              >
                Lancer
              </Button>
            </Card>
          )
        })}
      </section>

      <Card className="p-6">
        <h2 className="text-sm font-medium text-foreground">
          Campagnes récentes
        </h2>
        <div className="mt-5 flex flex-col gap-4">
          {recentCampaigns.map((c) => {
            const rate = c.sent > 0 ? Math.round((c.opened / c.sent) * 100) : 0
            return (
              <div
                key={c.name}
                className="flex flex-col gap-3 rounded-lg border border-border p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex min-w-0 flex-col gap-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-medium text-foreground">
                      {c.name}
                    </span>
                    <Badge
                      variant="outline"
                      className={`font-medium ${statusBadgeMap[c.status] ?? statusBadgeMap.draft}`}
                    >
                      {statusLabelMap[c.status] ?? c.status}
                    </Badge>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    Canal : {channelLabelMap[c.channel] ?? c.channel} — {c.sent} envois
                  </span>
                </div>
                <div className="flex w-full max-w-50 flex-col gap-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Taux d&apos;ouverture</span>
                    <span className="font-medium text-foreground">{rate}%</span>
                  </div>
                  <Progress value={rate} className="h-1.5" />
                </div>
              </div>
            )
          })}
        </div>
      </Card>
    </AppShell>
  )
}

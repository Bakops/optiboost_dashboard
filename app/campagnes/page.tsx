import { Mail, MessageSquare, Phone, Plus } from "lucide-react"
import { AppShell } from "@/components/dashboard/app-shell"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

const channels = [
  { label: "E-mail", icon: Mail, count: 318, desc: "Idéal pour les rappels d'examen visuel" },
  { label: "SMS", icon: MessageSquare, count: 142, desc: "Taux d'ouverture élevé, message court" },
  { label: "WhatsApp", icon: Phone, count: 96, desc: "Conversation directe et personnalisée" },
]

const campaigns = [
  { name: "Rappel examen visuel — Printemps", channel: "E-mail", status: "En cours", sent: 318, opened: 64, badge: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  { name: "Promo seconde paire", channel: "SMS", status: "Programmée", sent: 142, opened: 0, badge: "bg-amber-50 text-amber-700 border-amber-200" },
  { name: "Relance clients perdus 2024", channel: "WhatsApp", status: "Terminée", sent: 210, opened: 38, badge: "bg-muted text-muted-foreground border-border" },
]

export default function CampagnesPage() {
  return (
    <AppShell
      action={
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Nouvelle campagne</span>
          <span className="sm:hidden">Nouvelle</span>
        </Button>
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
              <Button variant="outline" size="sm" className="mt-4 w-full bg-card">
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
          {campaigns.map((c) => {
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
                    <Badge variant="outline" className={`font-medium ${c.badge}`}>
                      {c.status}
                    </Badge>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    Canal : {c.channel} — {c.sent} envois
                  </span>
                </div>
                <div className="flex w-full max-w-[200px] flex-col gap-1.5">
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

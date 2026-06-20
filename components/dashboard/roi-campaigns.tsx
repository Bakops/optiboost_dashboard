import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mail, MessageSquare, Phone, Sparkles } from "lucide-react"

type RoiAndCampaignsProps = {
  recoveryPotential: number
  quickCampaignCounts: {
    email: number
    sms: number
    whatsapp: number
  }
}

export function RoiAndCampaigns({
  recoveryPotential,
  quickCampaignCounts,
}: RoiAndCampaignsProps) {
  const channels = [
    { label: "Campagne E-mail", icon: Mail, count: quickCampaignCounts.email },
    { label: "Campagne SMS", icon: MessageSquare, count: quickCampaignCounts.sms },
    {
      label: "Campagne WhatsApp",
      icon: Phone,
      count: quickCampaignCounts.whatsapp,
    },
  ]

  return (
    <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <Card className="flex flex-col justify-between border-accent-foreground/15 bg-accent/40 p-6 lg:col-span-1">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-accent-foreground" />
            <span className="text-sm font-medium text-accent-foreground">
              Potentiel de Relance
            </span>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            En moyenne, une campagne récupère 5% des clients inactifs.
          </p>
          <div className="mt-4 text-4xl font-semibold tracking-tight text-foreground">
            + {recoveryPotential.toLocaleString("fr-FR")} €
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Gain théorique estimé
          </p>
        </div>
        <Button variant="outline" className="mt-6 w-fit bg-card">
          Lancer une simulation
        </Button>
      </Card>

      <Card className="p-6 lg:col-span-2">
        <div className="flex flex-col">
          <span className="text-sm font-medium text-foreground">
            Actions de Relance Rapide
          </span>
          <p className="text-xs text-muted-foreground">
            Choisissez un canal pour contacter vos clients
          </p>
        </div>
        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {channels.map((c) => {
            const Icon = c.icon
            return (
              <button
                key={c.label}
                className="group flex flex-col items-start gap-3 rounded-lg border border-border bg-card p-4 text-left transition-colors hover:border-accent-foreground/30 hover:bg-accent/30"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-md bg-muted text-foreground transition-colors group-hover:bg-accent group-hover:text-accent-foreground">
                  <Icon className="h-4 w-4" />
                </span>
                <span className="text-sm font-medium text-foreground">
                  {c.label}
                </span>
                <span className="text-xs text-muted-foreground">
                  {c.count} clients à relancer
                </span>
              </button>
            )
          })}
        </div>
      </Card>
    </section>
  )
}

import { Card } from "@/components/ui/card"
import { TrendingUp, Crown } from "lucide-react"

type KpiCardsProps = {
  averageBasket: number
  averageBasketDelta: number
  premiumRatio: number
  segments: {
    fidele: number
    aRelancer: number
    perdu: number
  }
}

export function KpiCards({
  averageBasket,
  averageBasketDelta,
  premiumRatio,
  segments,
}: KpiCardsProps) {
  const distribution = [
    { label: "Fidèles", value: segments.fidele, color: "bg-emerald-500" },
    {
      label: "À relancer",
      value: segments.aRelancer,
      color: "bg-amber-500",
    },
    { label: "Perdus", value: segments.perdu, color: "bg-rose-500" },
  ]

  return (
    <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground">
            Panier Moyen
          </span>
          <TrendingUp className="h-4 w-4 text-emerald-500" />
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-3xl font-semibold tracking-tight text-foreground">
            {averageBasket.toLocaleString("fr-FR")} €
          </span>
          <span className="text-xs font-medium text-emerald-600">
            +{averageBasketDelta.toLocaleString("fr-FR")}%
          </span>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          Sur les 30 derniers jours
        </p>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground">
            Ratio Clients Premium
          </span>
          <Crown className="h-4 w-4 text-amber-500" />
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-3xl font-semibold tracking-tight text-foreground">
            {premiumRatio}%
          </span>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          Verres &amp; montures haut de gamme
        </p>
      </Card>

      <Card className="p-6">
        <span className="text-sm font-medium text-muted-foreground">
          Répartition Clients
        </span>
        <div className="mt-4 flex h-2.5 w-full overflow-hidden rounded-full">
          {distribution.map((s) => (
            <div
              key={s.label}
              className={s.color}
              style={{ width: `${s.value}%` }}
            />
          ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
          {distribution.map((s) => (
            <div key={s.label} className="flex items-center gap-1.5">
              <span className={`h-2 w-2 rounded-full ${s.color}`} />
              <span className="text-xs text-muted-foreground">
                {s.label}{" "}
                <span className="font-medium text-foreground">{s.value}%</span>
              </span>
            </div>
          ))}
        </div>
      </Card>
    </section>
  )
}

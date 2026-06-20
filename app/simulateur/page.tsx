"use client"

import { useEffect, useState } from "react"
import { Sparkles, TrendingUp } from "lucide-react"
import { AppShell } from "@/components/dashboard/app-shell"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { estimateSimulator, getSimulatorDefaults } from "@/lib/api"

export default function SimulateurPage() {
  const [inactifs, setInactifs] = useState(0)
  const [panier, setPanier] = useState(0)
  const [conversion, setConversion] = useState(5)
  const [clientsRecuperes, setClientsRecuperes] = useState(0)
  const [gain, setGain] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getSimulatorDefaults()
      .then((defaults) => {
        setInactifs(defaults.inactiveClients)
        setPanier(defaults.averageBasket)
        setConversion(defaults.conversionRate)
      })
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    estimateSimulator({
      inactiveClients: inactifs,
      averageBasket: panier,
      conversionRate: conversion,
    })
      .then((estimate) => {
        setClientsRecuperes(estimate.recoveredClients)
        setGain(estimate.estimatedRevenue)
      })
      .catch(() => {
        setClientsRecuperes(0)
        setGain(0)
      })
  }, [conversion, inactifs, panier])

  const fields = [
    {
      id: "inactifs",
      label: "Clients inactifs",
      hint: "Nombre de clients à relancer",
      value: inactifs,
      set: setInactifs,
      suffix: "clients",
    },
    {
      id: "panier",
      label: "Panier moyen",
      hint: "Montant moyen par achat",
      value: panier,
      set: setPanier,
      suffix: "€",
    },
    {
      id: "conversion",
      label: "Taux de conversion estimé",
      hint: "Part des clients qui reviennent",
      value: conversion,
      set: setConversion,
      suffix: "%",
    },
  ]

  return (
    <AppShell>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <Card className="p-6 lg:col-span-3">
          <h2 className="text-sm font-medium text-foreground">
            Paramètres de simulation
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Ajustez les valeurs pour estimer le gain potentiel d&apos;une campagne
          </p>
          {loading && (
            <p className="mt-3 text-xs text-muted-foreground">
              Chargement des valeurs par défaut...
            </p>
          )}
          <div className="mt-6 flex flex-col gap-5">
            {fields.map((f) => (
              <div key={f.id} className="flex flex-col gap-1.5">
                <Label htmlFor={f.id}>{f.label}</Label>
                <div className="relative">
                  <Input
                    id={f.id}
                    type="number"
                    min={0}
                    value={f.value}
                    onChange={(e) => f.set(Number(e.target.value) || 0)}
                    className="pr-16"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                    {f.suffix}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">{f.hint}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="flex flex-col justify-between border-accent-foreground/15 bg-accent/40 p-6 lg:col-span-2">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-accent-foreground" />
              <span className="text-sm font-medium text-accent-foreground">
                Gain potentiel estimé
              </span>
            </div>
            <div className="mt-6 text-4xl font-semibold tracking-tight text-foreground">
              + {gain.toLocaleString("fr-FR")} €
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              sur une campagne de relance
            </p>
          </div>

          <div className="mt-6 flex flex-col gap-3 border-t border-accent-foreground/15 pt-5">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Clients récupérés</span>
              <span className="font-medium text-foreground">
                {clientsRecuperes}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Panier moyen</span>
              <span className="font-medium text-foreground">{panier} €</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-700">
              <TrendingUp className="h-3.5 w-3.5" />
              Basé sur {conversion}% de conversion
            </div>
          </div>
        </Card>
      </div>
    </AppShell>
  )
}

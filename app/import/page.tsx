"use client"

import { useState } from "react"
import { UploadCloud, FileSpreadsheet, CheckCircle2 } from "lucide-react"
import { AppShell } from "@/components/dashboard/app-shell"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const steps = [
  { title: "Préparez votre fichier", text: "Exportez vos clients au format .xlsx ou .csv depuis votre logiciel de caisse." },
  { title: "Déposez le fichier", text: "Glissez-déposez votre fichier dans la zone ci-dessous ou parcourez vos dossiers." },
  { title: "Vérifiez les colonnes", text: "Nous détectons automatiquement nom, e-mail, date d'achat et montant." },
]

const columns = ["Nom", "E-mail", "Téléphone", "Date du dernier achat", "Montant", "Type de verres"]

export default function ImportPage() {
  const [fileName, setFileName] = useState<string | null>(null)

  return (
    <AppShell>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="flex flex-col items-center justify-center gap-4 border-2 border-dashed border-border bg-muted/30 p-8 text-center lg:col-span-2">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent text-accent-foreground">
            <UploadCloud className="h-7 w-7" />
          </div>
          {fileName ? (
            <div className="flex items-center gap-2 text-sm font-medium text-emerald-700">
              <CheckCircle2 className="h-4 w-4" />
              {fileName} importé
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium text-foreground">
                Glissez-déposez votre fichier ici
              </p>
              <p className="text-xs text-muted-foreground">
                Formats acceptés : .xlsx, .csv — 10 Mo maximum
              </p>
            </div>
          )}
          <Button
            className="gap-2"
            onClick={() => setFileName("clients_optique.xlsx")}
          >
            <FileSpreadsheet className="h-4 w-4" />
            Parcourir les fichiers
          </Button>
        </Card>

        <Card className="p-6">
          <h2 className="text-sm font-medium text-foreground">
            Colonnes attendues
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Votre fichier doit contenir ces informations
          </p>
          <ul className="mt-4 flex flex-col gap-2">
            {columns.map((col) => (
              <li
                key={col}
                className="flex items-center gap-2 text-sm text-foreground"
              >
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                {col}
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="text-sm font-medium text-foreground">
          Comment ça marche
        </h2>
        <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
          {steps.map((step, i) => (
            <div key={step.title} className="flex flex-col gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                {i + 1}
              </span>
              <span className="text-sm font-medium text-foreground">
                {step.title}
              </span>
              <span className="text-xs leading-relaxed text-muted-foreground">
                {step.text}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </AppShell>
  )
}

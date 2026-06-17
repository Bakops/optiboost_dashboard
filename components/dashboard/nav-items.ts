import {
  LayoutDashboard,
  FileSpreadsheet,
  Users,
  Send,
  Calculator,
  type LucideIcon,
} from "lucide-react"

export type NavItem = {
  label: string
  href: string
  icon: LucideIcon
  description: string
}

export const navItems: NavItem[] = [
  {
    label: "Vue d'ensemble",
    href: "/",
    icon: LayoutDashboard,
    description: "Pilotez la fidélisation de votre clientèle",
  },
  {
    label: "Import Excel",
    href: "/import",
    icon: FileSpreadsheet,
    description: "Importez vos données clients depuis un fichier",
  },
  {
    label: "Segmentation Clients",
    href: "/clients",
    icon: Users,
    description: "Analysez et filtrez votre base clients",
  },
  {
    label: "Campagnes de Relance",
    href: "/campagnes",
    icon: Send,
    description: "Créez et suivez vos campagnes multicanal",
  },
  {
    label: "Simulateur de Gains",
    href: "/simulateur",
    icon: Calculator,
    description: "Estimez le potentiel de vos relances",
  },
]

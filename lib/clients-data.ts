export type Status = "Fidèle" | "À relancer" | "Perdu"

export type Client = {
  name: string
  email: string
  status: Status
  lastPurchase: string
  total: number
  category: "Premium" | "Standard"
}

export const statusStyles: Record<Status, string> = {
  Fidèle: "bg-emerald-50 text-emerald-700 border-emerald-200",
  "À relancer": "bg-amber-50 text-amber-700 border-amber-200",
  Perdu: "bg-rose-50 text-rose-700 border-rose-200",
}

export const clients: Client[] = [
  { name: "Sophie Lefèvre", email: "s.lefevre@email.fr", status: "Fidèle", lastPurchase: "12 mai 2026", total: 1240, category: "Premium" },
  { name: "Marc Dubois", email: "m.dubois@email.fr", status: "À relancer", lastPurchase: "3 janv. 2026", total: 320, category: "Standard" },
  { name: "Émilie Rousseau", email: "e.rousseau@email.fr", status: "Fidèle", lastPurchase: "28 avr. 2026", total: 890, category: "Premium" },
  { name: "Julien Bernard", email: "j.bernard@email.fr", status: "Perdu", lastPurchase: "9 août 2024", total: 210, category: "Standard" },
  { name: "Camille Petit", email: "c.petit@email.fr", status: "À relancer", lastPurchase: "17 déc. 2025", total: 540, category: "Standard" },
  { name: "Thomas Moreau", email: "t.moreau@email.fr", status: "Fidèle", lastPurchase: "2 mai 2026", total: 1580, category: "Premium" },
  { name: "Laura Girard", email: "l.girard@email.fr", status: "À relancer", lastPurchase: "21 nov. 2025", total: 410, category: "Standard" },
  { name: "Antoine Faure", email: "a.faure@email.fr", status: "Perdu", lastPurchase: "14 févr. 2024", total: 180, category: "Standard" },
  { name: "Nathalie Roche", email: "n.roche@email.fr", status: "Fidèle", lastPurchase: "30 avr. 2026", total: 760, category: "Premium" },
  { name: "Pierre Lambert", email: "p.lambert@email.fr", status: "À relancer", lastPurchase: "8 oct. 2025", total: 295, category: "Standard" },
]

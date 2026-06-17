"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LogOut } from "lucide-react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { navItems } from "@/components/dashboard/nav-items"

function NavContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()

  return (
    <>
      <div className="flex h-16 items-center gap-2 border-b justify-center border-border px-6">
        <img src="./optiboost_logo_1.png" alt="Optiboost Logo" className="h-10 w-auto object-contain" />
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-4 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-sidebar-foreground",
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-border p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-accent text-accent-foreground text-xs">
              CM
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-sidebar-foreground">
              Claire Martin
            </span>
            <span className="text-xs text-muted-foreground">
              Optique Martin
            </span>
          </div>
        </div>
        <Link
          href="/connexion"
          onClick={onNavigate}
          className="mt-4 flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-destructive"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          Se déconnecter
        </Link>
      </div>
    </>
  )
}

export function Sidebar() {
  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-sidebar md:flex fixed top-0 left-0 h-screen z-40">
      <NavContent />
    </aside>
  )
}

export { NavContent }

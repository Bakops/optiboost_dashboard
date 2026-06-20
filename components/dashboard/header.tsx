"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Menu } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { NavContent } from "@/components/dashboard/sidebar"
import { navItems } from "@/components/dashboard/nav-items"
import { getCurrentSession, logoutCurrentSession } from "@/lib/api"
import { readStoredSession } from "@/lib/auth-session"
import { cn } from "@/lib/utils"

type HeaderProps = {
  action?: React.ReactNode
}

export function Header({ action }: HeaderProps) {
  const [open, setOpen] = useState(false)
  const [userName, setUserName] = useState<string | null>(null)
  const pathname = usePathname()
  const router = useRouter()
  const current =
    navItems.find((item) => item.href === pathname) ?? navItems[0]

  useEffect(() => {
    if (!readStoredSession()) {
      setUserName(null)
      return
    }

    getCurrentSession()
      .then((session) => {
        setUserName(`${session.user.firstName} ${session.user.lastName}`)
      })
      .catch(() => {
        setUserName(null)
      })
  }, [pathname])

  async function handleLogout() {
    await logoutCurrentSession()
    setUserName(null)
    router.push('/connexion')
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between gap-3 border-b border-border bg-background/80 px-4 backdrop-blur md:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            className={cn(
              buttonVariants({ variant: "outline", size: "icon" }),
              "shrink-0 md:hidden",
            )}
            aria-label="Ouvrir le menu"
          >
            <Menu className="h-4 w-4" />
          </SheetTrigger>
          <SheetContent side="left" className="w-64 bg-sidebar p-0">
            <SheetTitle className="sr-only">Navigation</SheetTitle>
            <div className="flex h-full flex-col">
              <NavContent onNavigate={() => setOpen(false)} />
            </div>
          </SheetContent>
        </Sheet>

        <div className="flex min-w-0 flex-col">
          <h1 className="truncate text-base font-semibold tracking-tight text-foreground">
            {current.label}
          </h1>
          <p className="hidden truncate text-xs text-muted-foreground sm:block">
            {current.description}
          </p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-3">
        {userName ? (
          <>
            <span className="hidden text-sm text-muted-foreground sm:inline">
              {userName}
            </span>
            <button
              type="button"
              onClick={handleLogout}
              className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
            >
              Se déconnecter
            </button>
          </>
        ) : (
          <Link
            href="/connexion"
            className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
          >
            Se connecter
          </Link>
        )}
        {action ? <div>{action}</div> : null}
      </div>
    </header>
  )
}

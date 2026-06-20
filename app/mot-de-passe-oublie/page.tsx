"use client"

import { useState } from "react"
import Link from "next/link"
import { AuthLayout } from "@/components/auth/auth-layout"
import { forgotPassword } from "@/lib/api"

export default function MotDePasseOubliePage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      const response = await forgotPassword({ email })
      setMessage(response.message)
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Réinitialisation impossible",
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout imageSrc="/images/image_lunette_aesthtetic_solo_2.jpg" imageAlt="Paysage agricole moderne vu du ciel">
      <header className="flex items-center justify-between">
        <Link href="/" className="flex items-center gap-1 text-xl font-bold tracking-tight text-foreground">
          <img src="./optiboost_logo_1.png" alt="Optiboost Logo" className="h-10 w-auto object-contain" />
        </Link>
        <p className="text-sm text-muted-foreground">
          Pas encore de compte ?{" "}
          <Link href="/inscription" className="font-bold text-primary hover:underline">
            Inscrivez-vous
          </Link>
          .
        </p>
      </header>

      <div className="flex flex-1 flex-col justify-center py-10">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold tracking-tight text-foreground text-balance">
              Mot de passe oublié ?
            </h1>
            <p className="mt-2 text-pretty text-muted-foreground">
              Saisissez votre adresse e-mail et nous vous enverrons un lien pour réinitialiser votre mot de passe.
            </p>
          </div>

          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-sm font-medium text-foreground">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="vous@exemple.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 w-full rounded-lg border border-input bg-card px-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/30"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex h-12 w-full items-center justify-center rounded-lg bg-[#FF6B35] text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Envoi..." : "Envoyer le lien de réinitialisation"}
            </button>
          </form>

          {message && (
            <p className="mt-4 text-center text-sm text-muted-foreground">{message}</p>
          )}

          <p className="mt-6 text-center text-sm text-muted-foreground">
            <Link href="/connexion" className="font-medium text-primary hover:underline">
              Retour à la connexion
            </Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  )
}

"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { AuthLayout } from "@/components/auth/auth-layout"
import { GoogleButton } from "@/components/auth/google-button"
import { PasswordField } from "@/components/auth/password-field"
import { loginWithGoogle, persistAuthSession, register } from "@/lib/api"

export default function SignupPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (password !== confirmPassword) {
      setMessage("Les mots de passe ne correspondent pas.")
      return
    }

    setLoading(true)
    setMessage(null)

    try {
      const response = await register({
        email,
        password,
        organizationName: "Optiboost Demo",
      })
      persistAuthSession(response)
      setMessage(response.message)
      router.push("/")
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Inscription impossible")
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogleSignup() {
    setLoading(true)
    setMessage(null)

    try {
      const response = await loginWithGoogle({ email: email || undefined })
      persistAuthSession(response)
      setMessage(response.message)
      router.push("/")
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Inscription Google impossible")
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout imageSrc="/images/image_lunette_aesthtetic_solo.jpg" imageAlt="Paysage agricole futuriste au coucher du soleil">
      <header className="flex items-center justify-between">
        <Link href="/" className="flex items-center gap-1 text-xl font-bold tracking-tight text-foreground">
          <img src="./optiboost_logo_1.png" alt="Optiboost Logo" className="h-10 w-auto object-contain" />
        </Link>
        <p className="text-sm text-muted-foreground">
          Déjà un compte ?{" "}
          <Link href="/connexion" className="font-bold text-primary hover:underline">
            Connectez-vous
          </Link>
          .
        </p>
      </header>

      <div className="flex flex-1 flex-col justify-center py-10">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold tracking-tight text-foreground text-balance">
              Bienvenue sur Optiboost
            </h1>
            <p className="mt-2 text-muted-foreground">la solution de gestion d'entreprise tout-en-un</p>
          </div>

          <GoogleButton label="S'inscrire avec Google" onClick={handleGoogleSignup} />

          <div className="my-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-border" />
            <span className="text-sm text-muted-foreground">OU</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-sm font-medium text-foreground">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="ugaka1204@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 w-full rounded-lg border border-input bg-card px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="password" className="text-sm font-medium text-foreground">
                Mot de passe
              </label>
              <PasswordField id="password" value={password} onChange={setPassword} />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="confirm" className="text-sm font-medium text-foreground">
                Confirmer le mot de passe
              </label>
              <PasswordField id="confirm" value={confirmPassword} onChange={setConfirmPassword} />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex h-12 w-full items-center justify-center rounded-lg bg-[#FF6B35] text-sm font-semibold text-white transition-opacity hover:opacity-90 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Inscription..." : "S'inscrire"}
            </button>
          </form>

          {message && (
            <p className="mt-4 text-center text-sm text-muted-foreground">{message}</p>
          )}

          <p className="mt-4 text-center text-xs leading-relaxed text-muted-foreground">
            En cliquant sur «&nbsp;S&apos;inscrire&nbsp;», vous acceptez les Conditions d&apos;utilisation
            et la Politique de confidentialité d'Optiboost.
          </p>
        </div>
      </div>
    </AuthLayout>
  )
}

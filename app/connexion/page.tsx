import Link from "next/link"
import { AuthLayout } from "@/components/auth/auth-layout"
import { GoogleButton } from "@/components/auth/google-button"
import { PasswordField } from "@/components/auth/password-field"

export default function ConnexionPage() {
  return (
    <AuthLayout imageSrc="/images/image_lunette_aesthtetic.jpg" imageAlt="Paysage agricole moderne vu du ciel">
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
              Bienvenue sur Optiboost
            </h1>
            <p className="mt-2 text-muted-foreground">la solution de gestion d'entreprise tout-en-un</p>
          </div>

          <GoogleButton label="Se connecter avec Google" />

          <div className="my-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-border" />
            <span className="text-sm text-muted-foreground">OU</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <form className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-sm font-medium text-foreground">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="ugaka1204@gmail.com"
                className="h-12 w-full rounded-lg border border-input bg-card px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-medium text-foreground">
                  Mot de passe
                </label>
                <Link href="/mot-de-passe-oublie" className="text-xs font-medium text-primary hover:underline">
                  Mot de passe oublié ?
                </Link>
              </div>
              <PasswordField id="password" />
            </div>

            <Link
              href="/"
              className="mt-2 flex h-12 w-full items-center justify-center rounded-lg bg-[#FF6B35] text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              Se connecter
            </Link>
          </form>

          <p className="mt-4 text-center text-xs leading-relaxed text-muted-foreground">
            En vous connectant, vous acceptez les Conditions d&apos;utilisation
            et la Politique de confidentialité d'Optiboost.
          </p>
        </div>
      </div>
    </AuthLayout>
  )
}

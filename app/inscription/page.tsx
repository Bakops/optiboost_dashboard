import Link from "next/link"
import { AuthLayout } from "@/components/auth/auth-layout"
import { GoogleButton } from "@/components/auth/google-button"
import { PasswordField } from "@/components/auth/password-field"

export default function SignupPage() {
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

          <GoogleButton label="Sign up with Google" />

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
              <label htmlFor="password" className="text-sm font-medium text-foreground">
                Mot de passe
              </label>
              <PasswordField id="password" />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="confirm" className="text-sm font-medium text-foreground">
                Confirmer le mot de passe
              </label>
              <PasswordField id="confirm" />
            </div>

            <Link
              href="/"
              className="mt-2 flex h-12 w-full items-center justify-center rounded-lg bg-[#FF6B35] text-sm font-semibold text-white transition-opacity hover:opacity-90 cursor-pointer"
            >
              S&apos;inscrire
            </Link>
          </form>

          <p className="mt-4 text-center text-xs leading-relaxed text-muted-foreground">
            En cliquant sur «&nbsp;S&apos;inscrire&nbsp;», vous acceptez les Conditions d&apos;utilisation
            et la Politique de confidentialité d'Optiboost.
          </p>
        </div>
      </div>
    </AuthLayout>
  )
}

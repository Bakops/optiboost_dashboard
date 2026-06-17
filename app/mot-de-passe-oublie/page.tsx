import Link from "next/link"
import { AuthLayout } from "@/components/auth/auth-layout"

export default function MotDePasseOubliePage() {
  return (
    <AuthLayout imageSrc="/images/auth-login.png" imageAlt="Paysage agricole moderne vu du ciel">
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

          <form className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-sm font-medium text-foreground">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="vous@exemple.com"
                className="h-12 w-full rounded-lg border border-input bg-card px-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/30"
              />
            </div>

            <Link
              href="/connexion"
              className="mt-2 flex h-12 w-full items-center justify-center rounded-lg bg-[#FF6B35] text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              Envoyer le lien de réinitialisation
            </Link>
          </form>

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

import type React from "react"
import Image from "next/image"

export function AuthLayout({
  children,
  imageSrc,
  imageAlt,
}: {
  children: React.ReactNode
  imageSrc: string
  imageAlt: string
}) {
  return (
    <div className="flex min-h-screen bg-background">
      <div className="flex w-full flex-col px-6 py-10 sm:px-10 md:w-1/2 lg:px-16">
        {children}
      </div>
      <div className="relative hidden md:block md:w-1/2">
        <Image
          src={imageSrc || "/placeholder.svg"}
          alt={imageAlt}
          fill
          priority
          sizes="50vw"
          className="object-cover"
        />
      </div>
    </div>
  )
}

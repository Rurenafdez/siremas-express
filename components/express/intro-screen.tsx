"use client"

import { ScanBarcode, ShieldCheck, Wallet, ArrowLeft } from "lucide-react"
import { StatusBar } from "./status-bar"

const STEPS = [
  {
    icon: ScanBarcode,
    title: "Escanea tus productos",
    body: "Usa la cámara mientras recorres la tienda.",
  },
  {
    icon: ShieldCheck,
    title: "Verifica tu compra",
    body: "Nuestra IA confirma que todo coincide.",
  },
  {
    icon: Wallet,
    title: "Paga desde tu celular",
    body: "Sal por la estación exprés, sin filas.",
  },
]

export function IntroScreen({
  onStart,
  onBack,
}: {
  onStart: () => void
  onBack: () => void
}) {
  return (
    <div className="flex h-full flex-col bg-primary text-primary-foreground">
      <StatusBar dark />
      <div className="px-5 pt-1">
        <button
          type="button"
          onClick={onBack}
          aria-label="Volver"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-foreground/10"
        >
          <ArrowLeft className="h-5 w-5" aria-hidden />
        </button>
      </div>

      <div className="flex flex-1 flex-col px-6 pb-8 pt-6">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary text-secondary-foreground">
          <ScanBarcode className="h-8 w-8" aria-hidden />
        </div>
        <h1 className="mt-5 text-3xl font-extrabold leading-tight text-balance">
          Compra Exprés
        </h1>
        <p className="mt-2 max-w-[18rem] text-sm text-primary-foreground/75 text-pretty">
          Escanea tus productos mientras compras y evita las filas.
        </p>

        <ol className="mt-8 space-y-5">
          {STEPS.map((step, i) => (
            <li
              key={step.title}
              className="flex items-start gap-4 animate-slide-up"
              style={{ animationDelay: `${i * 90}ms` }}
            >
              <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary-foreground/10">
                <step.icon className="h-6 w-6 text-secondary" aria-hidden />
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-secondary text-[11px] font-extrabold text-secondary-foreground">
                  {i + 1}
                </span>
              </div>
              <div className="pt-0.5">
                <p className="text-base font-bold">{step.title}</p>
                <p className="text-sm text-primary-foreground/70">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-auto pt-8">
          <button
            type="button"
            onClick={onStart}
            className="w-full rounded-2xl bg-secondary py-4 text-base font-extrabold text-secondary-foreground shadow-lg transition active:scale-[0.99]"
          >
            Comenzar compra
          </button>
        </div>
      </div>
    </div>
  )
}

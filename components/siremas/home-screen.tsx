"use client"

import {
  ShoppingCart,
  Sparkles,
  ScanBarcode,
  Leaf,
  QrCode,
  ChevronRight,
} from "lucide-react"

export function HomeScreen({ onStart }: { onStart: () => void }) {
  return (
    <div className="flex min-h-full flex-col">
      {/* Brand bar */}
      <header className="flex items-center justify-between bg-sirena-yellow px-5 pb-4 pt-6">
        <div className="flex items-center gap-2">
          <div className="grid size-9 place-items-center rounded-xl bg-sirena-navy">
            <span className="text-lg font-black text-sirena-yellow">S</span>
          </div>
          <div className="leading-tight">
            <p className="text-sm font-black tracking-tight text-sirena-navy-deep">
              Siremás Express
            </p>
            <p className="text-[11px] font-medium text-sirena-navy/70">
              La Sirena · Scan &amp; Go
            </p>
          </div>
        </div>
        <span className="rounded-full bg-sirena-navy px-3 py-1 text-[11px] font-bold text-sirena-yellow">
          Beta
        </span>
      </header>

      {/* Seasonal campaign banner */}
      <div className="px-5 pt-5">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-sirena-yellow to-sirena-yellow-soft p-5 shadow-lg">
          <div className="absolute -right-6 -top-8 size-28 rounded-full bg-white/30 blur-xl" />
          <div className="relative">
            <span className="inline-flex items-center gap-1 rounded-full bg-sirena-navy px-2.5 py-1 text-[11px] font-bold text-sirena-yellow">
              <Sparkles className="size-3" /> Campaña activa
            </span>
            <h2 className="mt-3 text-2xl font-black leading-tight text-sirena-navy-deep">
              Mes Amarillo
            </h2>
            <p className="mt-1 max-w-[16rem] text-sm font-medium text-sirena-navy/80">
              Descuentos dinámicos en toda la tienda. Escanea y ahorra al
              instante.
            </p>
          </div>
        </div>
      </div>

      {/* Hero start button */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-8 text-center">
        <div className="relative mb-6">
          <div className="grid size-24 place-items-center rounded-[2rem] bg-sirena-navy shadow-xl shadow-sirena-navy/25">
            <ScanBarcode className="size-11 text-sirena-yellow" />
          </div>
          <span className="animate-target-pulse absolute -right-1 -top-1 grid size-8 place-items-center rounded-full bg-sirena-green text-white">
            <Sparkles className="size-4" />
          </span>
        </div>
        <h1 className="text-balance text-xl font-extrabold text-foreground">
          Compra sin filas, paga desde tu teléfono
        </h1>
        <p className="mt-2 max-w-xs text-pretty text-sm leading-relaxed text-muted-foreground">
          Escanea cada producto mientras compras y muestra tu QR de salida al
          Auditor Express.
        </p>

        <button
          onClick={onStart}
          className="mt-7 flex w-full max-w-xs items-center justify-center gap-2 rounded-2xl bg-sirena-navy py-4 text-base font-bold text-primary-foreground shadow-lg shadow-sirena-navy/30 transition active:scale-[0.98]"
        >
          <ShoppingCart className="size-5 text-sirena-yellow" />
          Iniciar Compra Express
        </button>
      </div>

      {/* Perks */}
      <div className="grid grid-cols-2 gap-3 px-5 pb-7">
        <Perk
          icon={<Leaf className="size-5 text-sirena-green" />}
          title="Salva-Alimentos"
          desc="Descuentos por reducir desperdicio"
        />
        <Perk
          icon={<QrCode className="size-5 text-sirena-navy" />}
          title="Salida QR"
          desc="Muestra y sal en segundos"
        />
      </div>
    </div>
  )
}

function Perk({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode
  title: string
  desc: string
}) {
  return (
    <div className="flex flex-col gap-1.5 rounded-2xl border border-border bg-card p-3.5 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="grid size-9 place-items-center rounded-xl bg-muted">
          {icon}
        </div>
        <ChevronRight className="size-4 text-muted-foreground" />
      </div>
      <p className="text-sm font-bold text-foreground">{title}</p>
      <p className="text-[11px] leading-tight text-muted-foreground">{desc}</p>
    </div>
  )
}

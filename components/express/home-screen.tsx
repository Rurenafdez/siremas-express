"use client"

import {
  ScanBarcode,
  ShoppingCart,
  ChevronRight,
  Tag,
  Zap,
  CircleUser,
  Bell,
} from "lucide-react"
import {
  type CartLine,
  cartCount,
  cartTotals,
  formatDOP,
} from "@/lib/express-data"

export function HomeScreen({
  userName = "Camila Ramírez",
  cart = [],
  onStart,
  onViewCart,
}: {
  userName?: string
  cart?: CartLine[]
  onStart: () => void
  onViewCart?: () => void
}) {
  const first = userName.split(" ")[0]
  const count = cartCount(cart)
  const savings = 1240 + cartTotals(cart).discounts

  return (
    <div className="flex h-full flex-col bg-background">
      <div className="bg-primary text-primary-foreground">
        <header className="flex items-center justify-between px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
              <CircleUser className="h-6 w-6" aria-hidden />
            </div>
            <div className="leading-tight">
              <p className="text-xs text-primary-foreground/70">Hola,</p>
              <p className="text-sm font-bold">{first}</p>
            </div>
          </div>
          <button
            type="button"
            aria-label="Notificaciones"
            className="relative flex h-10 w-10 items-center justify-center rounded-full bg-primary-foreground/10"
          >
            <Bell className="h-5 w-5" aria-hidden />
            <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-secondary" />
          </button>
        </header>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar px-5 pb-6">
        {/* Savings + cart quick stats */}
        <div className="-mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-card p-4 shadow-sm ring-1 ring-border">
            <div className="flex items-center gap-1.5 text-sirena-green">
              <Tag className="h-4 w-4" aria-hidden />
              <span className="text-xs font-semibold">Ahorro acumulado</span>
            </div>
            <p className="mt-1 text-2xl font-extrabold tabular-nums text-foreground">
              {formatDOP(savings)}
            </p>
          </div>
          <button
            type="button"
            onClick={count > 0 && onViewCart ? onViewCart : onStart}
            className="rounded-2xl bg-card p-4 text-left shadow-sm ring-1 ring-border transition active:scale-[0.98]"
          >
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <ShoppingCart className="h-4 w-4" aria-hidden />
              <span className="text-xs font-semibold">Tu carrito</span>
            </div>
            <p className="mt-1 text-2xl font-extrabold tabular-nums text-foreground">
              {count} <span className="text-sm font-medium text-muted-foreground">art.</span>
            </p>
          </button>
        </div>

        {/* Hero: Compra Exprés */}
        <button
          type="button"
          onClick={onStart}
          className="group mt-4 w-full overflow-hidden rounded-3xl bg-secondary p-5 text-left shadow-lg ring-1 ring-black/5 transition active:scale-[0.99]"
        >
          <div className="flex items-center gap-2 text-secondary-foreground">
            <span className="flex h-7 items-center gap-1 rounded-full bg-primary px-2.5 text-[11px] font-bold uppercase tracking-wide text-primary-foreground">
              <Zap className="h-3.5 w-3.5" aria-hidden /> Nuevo
            </span>
          </div>
          <h1 className="mt-3 text-2xl font-extrabold leading-tight text-secondary-foreground text-balance">
            Compra Exprés
          </h1>
          <p className="mt-1 max-w-[15rem] text-sm font-medium text-secondary-foreground/80 text-pretty">
            Escanea, compra y sal rápido. Sin filas.
          </p>
          <span className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground">
            <ScanBarcode className="h-4 w-4" aria-hidden />
            Iniciar
            <ChevronRight className="h-4 w-4 transition group-hover:translate-x-0.5" aria-hidden />
          </span>
        </button>

        {/* Promotions */}
        <div className="mt-6">
          <h2 className="mb-3 text-sm font-bold text-foreground">
            Promociones para ti
          </h2>
          <div className="space-y-3">
            <PromoRow
              title="2x1 en bebidas Wala"
              subtitle="Válido hoy en tienda"
              accent="bg-sirena-green-soft text-sirena-green"
            />
            <PromoRow
              title="Salva-Alimentos: hasta 40% menos"
              subtitle="Productos próximos a vencer"
              accent="bg-sirena-yellow-soft text-secondary-foreground"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function PromoRow({
  title,
  subtitle,
  accent,
}: {
  title: string
  subtitle: string
  accent: string
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-card p-3.5 shadow-sm ring-1 ring-border">
      <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${accent}`}>
        <Tag className="h-5 w-5" aria-hidden />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-foreground">{title}</p>
        <p className="truncate text-xs text-muted-foreground">{subtitle}</p>
      </div>
      <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
    </div>
  )
}

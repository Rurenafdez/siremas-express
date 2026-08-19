"use client"

import { useState } from "react"
import {
  ScanBarcode,
  ShoppingCart,
  ChevronRight,
  Tag,
  Zap,
  CircleUser,
  Bell,
  Sparkles,
  X,
  Info,
} from "lucide-react"
import {
  type CartLine,
  cartCount,
  cartTotals,
  formatDOP,
} from "@/lib/express-data"
import { BottomSheet } from "./bottom-sheet"

type PromoInfo = {
  id: string
  title: string
  subtitle: string
  tag: string
  discount: string
  description: string
  conditions: string
  accent: string
}

const PROMOS: PromoInfo[] = [
  {
    id: "wala-2x1",
    title: "2x1 en bebidas Wala",
    subtitle: "Válido hoy en tienda",
    tag: "Bebidas",
    discount: "2x1",
    description:
      "Compra cualquier Jugo o Refresco Wala y el segundo artículo de igual o menor precio es completamente gratis. Aplica automáticamente en Compra Exprés al escanear ambos productos en tu recorrido.",
    conditions: "Válido por hoy en todas las sucursales de La Sirena. Máximo 4 unidades por cliente.",
    accent: "bg-sirena-green-soft text-sirena-green",
  },
  {
    id: "salva-alimentos",
    title: "Salva-Alimentos: hasta 40% menos",
    subtitle: "Productos próximos a vencer",
    tag: "Sostenibilidad",
    discount: "Hasta 40%",
    description:
      "Iniciativa ecológica para reducir el desperdicio. Encuentra productos de lácteos, embutidos y panadería con etiqueta Salva-Alimentos y ahorra hasta un 40% de descuento dinámico al escanearlos.",
    conditions: "Disponible en góndolas identificadas. Descuento aplicado automáticamente en el carrito.",
    accent: "bg-sirena-yellow-soft text-secondary-foreground",
  },
  {
    id: "puntos-siremas",
    title: "Puntos Siremás Dobles",
    subtitle: "En marcas exclusivas Wala",
    tag: "Club Siremás",
    discount: "2x Puntos",
    description:
      "Acumula el doble de Puntos Siremás en todas tus compras de productos marca Wala y First Class al pagar a través de Siremás Express desde tu celular.",
    conditions: "Los puntos se acreditan inmediatamente a tu cuenta de cliente.",
    accent: "bg-primary/10 text-primary",
  },
]

export function HomeScreen({
  userName = "Camila Ramírez",
  points = 2450,
  cart = [],
  onStart,
  onViewCart,
  onViewHistory,
}: {
  userName?: string
  points?: number
  cart?: CartLine[]
  onStart: () => void
  onViewCart?: () => void
  onViewHistory?: () => void
}) {
  const first = userName.split(" ")[0]
  const count = cartCount(cart)
  const savings = 1240 + cartTotals(cart).discounts
  const [selectedPromo, setSelectedPromo] = useState<PromoInfo | null>(null)

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
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onViewHistory}
              aria-label="Historial de compras"
              className="flex items-center gap-1.5 rounded-full bg-primary-foreground/10 px-3 py-1.5 text-xs font-bold text-primary-foreground transition active:scale-95 hover:bg-primary-foreground/20"
            >
              <Sparkles className="h-3.5 w-3.5 text-secondary" />
              <span>Historial</span>
            </button>
            <button
              type="button"
              aria-label="Notificaciones"
              className="relative flex h-9 w-9 items-center justify-center rounded-full bg-primary-foreground/10"
            >
              <Bell className="h-4 w-4" aria-hidden />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-secondary" />
            </button>
          </div>
        </header>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar px-5 pb-6">
        {/* Points & Savings banner */}
        <div className="-mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-card p-3.5 shadow-sm ring-1 ring-border">
            <div className="flex items-center gap-1.5 text-sirena-green">
              <Tag className="h-4 w-4" aria-hidden />
              <span className="text-xs font-semibold">Ahorro acumulado</span>
            </div>
            <p className="mt-1 text-xl font-extrabold tabular-nums text-foreground">
              {formatDOP(savings)}
            </p>
            <p className="mt-1 text-[11px] font-bold text-amber-600 flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              {points.toLocaleString("es-DO")} pts Siremás
            </p>
          </div>
          <button
            type="button"
            onClick={count > 0 && onViewCart ? onViewCart : onStart}
            className="rounded-2xl bg-card p-3.5 text-left shadow-sm ring-1 ring-border transition active:scale-[0.98]"
          >
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <ShoppingCart className="h-4 w-4" aria-hidden />
              <span className="text-xs font-semibold">Tu carrito</span>
            </div>
            <p className="mt-1 text-xl font-extrabold tabular-nums text-foreground">
              {count} <span className="text-sm font-medium text-muted-foreground">art.</span>
            </p>
            <p className="mt-1 text-[11px] font-semibold text-primary">
              {count > 0 ? "Ver resumen →" : "Escanear ahora"}
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
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-foreground">
              Promociones para ti
            </h2>
            <span className="text-xs font-medium text-muted-foreground">
              Toca para ver detalles
            </span>
          </div>
          <div className="space-y-3">
            {PROMOS.map((p) => (
              <PromoRow
                key={p.id}
                title={p.title}
                subtitle={p.subtitle}
                accent={p.accent}
                onClick={() => setSelectedPromo(p)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Promo Detail Modal */}
      {selectedPromo && (
        <BottomSheet onClose={() => setSelectedPromo(null)} labelledBy="promo-detail-title">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <span className="flex h-7 items-center gap-1 rounded-full bg-secondary px-2.5 text-[11px] font-bold uppercase tracking-wide text-secondary-foreground">
                <Sparkles className="h-3 w-3" /> {selectedPromo.tag}
              </span>
              <span className="rounded-full bg-sirena-green-soft px-2.5 py-0.5 text-xs font-extrabold text-sirena-green">
                {selectedPromo.discount}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setSelectedPromo(null)}
              aria-label="Cerrar"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground transition active:scale-95"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="py-4 space-y-3">
            <h3 id="promo-detail-title" className="text-lg font-extrabold text-foreground leading-tight">
              {selectedPromo.title}
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground text-pretty">
              {selectedPromo.description}
            </p>

            <div className="flex items-start gap-2 rounded-xl bg-muted p-3 text-xs text-muted-foreground">
              <Info className="h-4 w-4 shrink-0 text-primary mt-0.5" />
              <p>{selectedPromo.conditions}</p>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <button
              type="button"
              onClick={() => {
                setSelectedPromo(null)
                onStart()
              }}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-3.5 text-base font-extrabold text-primary-foreground active:scale-[0.99]"
            >
              <ScanBarcode className="h-5 w-5 text-secondary" />
              Comenzar compra con esta promo
            </button>
            <button
              type="button"
              onClick={() => setSelectedPromo(null)}
              className="w-full rounded-2xl py-2.5 text-sm font-semibold text-muted-foreground"
            >
              Cerrar
            </button>
          </div>
        </BottomSheet>
      )}
    </div>
  )
}

function PromoRow({
  title,
  subtitle,
  accent,
  onClick,
}: {
  title: string
  subtitle: string
  accent: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-2xl bg-card p-3.5 text-left shadow-sm ring-1 ring-border transition active:scale-[0.98] hover:ring-primary/40"
    >
      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${accent}`}>
        <Tag className="h-5 w-5" aria-hidden />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-foreground">{title}</p>
        <p className="truncate text-xs text-muted-foreground">{subtitle}</p>
      </div>
      <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
    </button>
  )
}

"use client"

import { useState } from "react"
import {
  ScanBarcode,
  ShoppingCart,
  ChevronRight,
  Tag,
  Zap,
  CircleUser,
  Sparkles,
  X,
  Info,
  RotateCcw,
  Receipt,
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
    subtitle: "Válido en tu compra de hoy",
    tag: "Bebidas",
    discount: "2x1",
    description:
      "Compra cualquier Jugo o Refresco Wala y el segundo artículo de igual o menor precio es completamente gratis. Aplica automáticamente en Compra Exprés al escanear ambos productos en tu recorrido.",
    conditions: "Válido en todas las sucursales de La Sirena. Máximo 4 unidades por cliente.",
    accent: "bg-sirena-green-soft text-sirena-green",
  },
  {
    id: "en-rebaja",
    title: "Selección En Rebaja",
    subtitle: "Ahorros directos en pasillo",
    tag: "En rebaja",
    discount: "Hasta 20%",
    description:
      "Encuentra artículos seleccionados identificados con la etiqueta 'En rebaja' en diferentes pasillos y disfruta de precios con descuento directo al escanearlos.",
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
  onResetDemo,
}: {
  userName?: string
  points?: number
  cart?: CartLine[]
  onStart: () => void
  onViewCart?: () => void
  onViewHistory?: () => void
  onResetDemo?: () => void
}) {
  const first = userName.split(" ")[0]
  const count = cartCount(cart)
  const savings = 1240 + cartTotals(cart).discounts
  const [selectedPromo, setSelectedPromo] = useState<PromoInfo | null>(null)
  const [showResetConfirm, setShowResetConfirm] = useState(false)

  return (
    <div className="flex h-full flex-col bg-background">
      {/* Premium Header */}
      <div className="bg-primary text-primary-foreground shadow-md">
        <header className="flex items-center justify-between px-5 py-4 pb-6">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground ring-2 ring-secondary/30 shadow-sm">
              <CircleUser className="h-7 w-7" aria-hidden />
            </div>
            <div className="min-w-0 leading-tight">
              <p className="text-[11px] font-medium text-primary-foreground/75 uppercase tracking-wide">Hola,</p>
              <p className="truncate text-base font-extrabold max-w-[9rem]">{first}</p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={onViewHistory}
              aria-label="Ver historial de compras"
              className="flex items-center gap-1.5 rounded-full bg-primary-foreground/12 px-3 py-1.5 text-xs font-bold text-primary-foreground transition active:scale-95 hover:bg-primary-foreground/20"
            >
              <Receipt className="h-3.5 w-3.5 text-secondary" />
              <span>Historial</span>
            </button>
            <button
              type="button"
              onClick={() => setShowResetConfirm(true)}
              title="Reiniciar usuario demo (Onboarding)"
              aria-label="Reiniciar usuario demo"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-foreground/12 text-primary-foreground/80 transition active:scale-95 hover:bg-primary-foreground/25 hover:text-primary-foreground"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
          </div>
        </header>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar px-5 pb-6 -mt-5">
        {/* Points & Savings Metric Cards — overlap header intentionally with controlled -mt */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-card p-4 shadow-md ring-1 ring-border/80">
            <div className="flex items-center gap-1.5 text-sirena-green">
              <Tag className="h-4 w-4" aria-hidden />
              <span className="text-xs font-bold">Ahorro total</span>
            </div>
            <p className="mt-1 text-2xl font-extrabold tabular-nums text-foreground">
              {formatDOP(savings)}
            </p>
            <div className="mt-1 flex items-center gap-1 text-[11px] font-extrabold text-amber-600">
              <Sparkles className="h-3 w-3" />
              <span className="truncate">{points.toLocaleString("es-DO")} pts Siremás</span>
            </div>
          </div>

          <button
            type="button"
            onClick={count > 0 && onViewCart ? onViewCart : onStart}
            className="rounded-2xl bg-card p-4 text-left shadow-md ring-1 ring-border/80 transition active:scale-[0.98] hover:ring-primary/40"
          >
            <div className="flex items-center gap-1.5">
              <ShoppingCart className="h-4 w-4 text-primary" aria-hidden />
              <span className="text-xs font-bold text-foreground">Tu carrito</span>
            </div>
            <p className="mt-1 text-2xl font-extrabold tabular-nums text-foreground">
              {count} <span className="text-xs font-medium text-muted-foreground">art.</span>
            </p>
            <p className="mt-1 text-[11px] font-bold text-primary">
              {count > 0 ? "Ver resumen →" : "Escanear ahora →"}
            </p>
          </button>
        </div>

        {/* Hero: Compra Exprés */}
        <button
          type="button"
          onClick={onStart}
          className="group mt-4 w-full overflow-hidden rounded-3xl bg-secondary p-5 text-left shadow-lg ring-1 ring-black/5 transition active:scale-[0.99] hover:shadow-xl"
        >
          <div className="flex items-center gap-2 text-secondary-foreground">
            <span className="flex h-7 items-center gap-1 rounded-full bg-primary px-3 text-[11px] font-extrabold uppercase tracking-wide text-primary-foreground shadow-sm">
              <Zap className="h-3.5 w-3.5" aria-hidden /> Sin Filas
            </span>
          </div>
          <h1 className="mt-3 text-2xl font-extrabold leading-tight text-secondary-foreground text-balance">
            Compra Exprés
          </h1>
          <p className="mt-1 max-w-[16rem] text-sm font-semibold text-secondary-foreground/85 text-pretty">
            Escanea tus productos con la cámara, verifica con IA y sal rápido.
          </p>
          <span className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-extrabold text-primary-foreground shadow-md transition group-hover:bg-primary/90">
            <ScanBarcode className="h-4 w-4" aria-hidden />
            Iniciar compra
            <ChevronRight className="h-4 w-4 transition group-hover:translate-x-0.5" aria-hidden />
          </span>
        </button>

        {/* Promotions */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-extrabold text-foreground">
              Promociones para ti
            </h2>
            <span className="text-xs font-semibold text-muted-foreground">
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
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-3.5 text-base font-extrabold text-primary-foreground active:scale-[0.99] transition shadow-md"
            >
              <ScanBarcode className="h-5 w-5 text-secondary" />
              Comenzar compra con esta promo
            </button>
            <button
              type="button"
              onClick={() => setSelectedPromo(null)}
              className="w-full rounded-2xl py-2.5 text-sm font-semibold text-muted-foreground hover:text-foreground"
            >
              Cerrar
            </button>
          </div>
        </BottomSheet>
      )}

      {/* Reset Demo User Confirmation Modal */}
      {showResetConfirm && (
        <BottomSheet onClose={() => setShowResetConfirm(false)} labelledBy="reset-title">
          <div className="flex items-center gap-2 text-primary pb-2 border-b border-border">
            <RotateCcw className="h-5 w-5 text-secondary" />
            <h3 id="reset-title" className="text-base font-extrabold text-foreground">
              Reiniciar usuario demo
            </h3>
          </div>
          <p className="py-3 text-xs leading-relaxed text-muted-foreground">
            Esta opción limpiará los datos guardados en este dispositivo y reiniciará la experiencia de Onboarding (Términos + Verificación de Cédula) para que otra persona pueda probar la demo desde cero.
          </p>
          <div className="space-y-2 pt-2">
            <button
              type="button"
              onClick={() => {
                setShowResetConfirm(false)
                onResetDemo?.()
              }}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-destructive py-3 text-sm font-bold text-destructive-foreground active:scale-[0.99] transition"
            >
              Reiniciar y volver al Onboarding
            </button>
            <button
              type="button"
              onClick={() => setShowResetConfirm(false)}
              className="w-full rounded-2xl py-2 text-xs font-semibold text-muted-foreground"
            >
              Cancelar
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
      className="flex w-full items-center gap-3 rounded-2xl bg-card p-3.5 text-left shadow-sm ring-1 ring-border/80 transition active:scale-[0.98] hover:ring-primary/40"
    >
      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${accent}`}>
        <Tag className="h-5 w-5" aria-hidden />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-bold text-foreground">{title}</p>
        <p className="truncate text-xs text-muted-foreground">{subtitle}</p>
      </div>
      <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
    </button>
  )
}

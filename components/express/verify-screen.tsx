"use client"

import { useEffect, useRef, useState } from "react"
import {
  ArrowLeft,
  Camera,
  Check,
  CreditCard,
  Sparkles,
  ChevronRight,
  AlertTriangle,
  RefreshCw,
  Plus,
  SlidersHorizontal,
} from "lucide-react"
import {
  type CartLine,
  type Product,
  type AiScenarioId,
  AI_VERIFY_SCENARIOS,
  CATALOG,
  formatDOP,
} from "@/lib/express-data"

type Phase = "idle" | "scanning" | "done" | "discrepancy_not_visible" | "discrepancy_extra_item"

const EXTRA_PRODUCT: Product = CATALOG[1] || {
  id: "galletas-wala",
  name: "Galletas Wala",
  detail: "Paquete 200 g",
  image: "/products/galletas.png",
  price: 85,
  aisle: "Pasillo 2 — Galletas y Snacks",
  isStoreBrand: true,
  brand: "Wala",
}

export function VerifyScreen({
  cart,
  onAddToCart,
  onVerified,
  onBack,
}: {
  cart: CartLine[]
  onAddToCart?: (product: Product) => void
  onVerified: () => void
  onBack: () => void
}) {
  const [phase, setPhase] = useState<Phase>("idle")
  const [scenario, setScenario] = useState<AiScenarioId>("happy")
  const [showScenarioMenu, setShowScenarioMenu] = useState(false)
  const [recognized, setRecognized] = useState<number[]>([])
  const [extraAdded, setExtraAdded] = useState(false)
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])

  const items = cart

  useEffect(() => {
    return () => timers.current.forEach(clearTimeout)
  }, [])

  function startScan() {
    setPhase("scanning")
    setRecognized([])
    timers.current.forEach(clearTimeout)
    timers.current = []

    if (scenario === "happy") {
      // All items recognized sequentially
      items.forEach((_, i) => {
        const t = setTimeout(() => {
          setRecognized((prev) => [...prev, i])
          if (i === items.length - 1) {
            const done = setTimeout(() => setPhase("done"), 500)
            timers.current.push(done)
          }
        }, 450 * (i + 1))
        timers.current.push(t)
      })
    } else if (scenario === "not_visible") {
      // 1 item is missing / obscured
      items.forEach((_, i) => {
        if (i === 1) return // Skip second item to simulate missing visibility
        const t = setTimeout(() => {
          setRecognized((prev) => [...prev, i])
          if (i === items.length - 1 || (items.length <= 2 && i === 0)) {
            const done = setTimeout(() => setPhase("discrepancy_not_visible"), 600)
            timers.current.push(done)
          }
        }, 450 * (i + 1))
        timers.current.push(t)
      })
    } else if (scenario === "extra_item") {
      // All cart items recognized + extra item detected
      items.forEach((_, i) => {
        const t = setTimeout(() => {
          setRecognized((prev) => [...prev, i])
          if (i === items.length - 1) {
            const done = setTimeout(() => setPhase("discrepancy_extra_item"), 500)
            timers.current.push(done)
          }
        }, 450 * (i + 1))
        timers.current.push(t)
      })
    }
  }

  function handleAddExtra() {
    onAddToCart?.(EXTRA_PRODUCT)
    setExtraAdded(true)
    setPhase("done")
  }

  function handleIgnoreExtra() {
    setPhase("done")
  }

  function handleRetry() {
    setPhase("idle")
    setRecognized([])
  }

  return (
    <div className="flex h-full flex-col bg-sirena-navy-deep text-primary-foreground">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-primary-foreground/10">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            aria-label="Volver"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-foreground/10 transition active:scale-95"
          >
            <ArrowLeft className="h-5 w-5" aria-hidden />
          </button>
          <h1 className="text-base font-extrabold">Verificación con IA</h1>
        </div>

        {/* Demo Scenario Selector Toggle */}
        <button
          type="button"
          onClick={() => setShowScenarioMenu(!showScenarioMenu)}
          aria-label="Cambiar escenario de prueba"
          className="flex items-center gap-1.5 rounded-full bg-primary-foreground/10 px-3 py-1 text-xs font-semibold text-secondary transition hover:bg-primary-foreground/20"
        >
          <SlidersHorizontal className="h-3.5 w-3.5" />
          <span className="text-[11px]">Demo IA</span>
        </button>
      </div>

      {/* Scenario Selection Menu */}
      {showScenarioMenu && (
        <div className="border-b border-primary-foreground/10 bg-primary/60 px-5 py-3 animate-slide-up">
          <p className="text-xs font-bold text-secondary mb-2">Selecciona un escenario de prueba:</p>
          <div className="space-y-1.5">
            {AI_VERIFY_SCENARIOS.map((sc) => (
              <button
                key={sc.id}
                type="button"
                onClick={() => {
                  setScenario(sc.id)
                  setShowScenarioMenu(false)
                  handleRetry()
                }}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs font-semibold transition ${
                  scenario === sc.id
                    ? "bg-secondary text-secondary-foreground font-bold"
                    : "bg-primary-foreground/5 text-primary-foreground/80 hover:bg-primary-foreground/10"
                }`}
              >
                <span>{sc.name}</span>
                {scenario === sc.id && <Check className="h-3.5 w-3.5" />}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Camera Viewfinder */}
      <div className="px-5 pt-3">
        <div className="relative flex aspect-square w-full max-h-[220px] items-center justify-center overflow-hidden rounded-3xl bg-primary/40 ring-1 ring-primary-foreground/10">
          <span className="absolute left-4 top-4 h-8 w-8 rounded-tl-xl border-l-4 border-t-4 border-secondary" />
          <span className="absolute right-4 top-4 h-8 w-8 rounded-tr-xl border-r-4 border-t-4 border-secondary" />
          <span className="absolute bottom-4 left-4 h-8 w-8 rounded-bl-xl border-b-4 border-l-4 border-secondary" />
          <span className="absolute bottom-4 right-4 h-8 w-8 rounded-br-xl border-b-4 border-r-4 border-secondary" />

          {phase === "scanning" && (
            <span className="animate-scanline absolute inset-x-8 h-0.5 rounded-full bg-secondary shadow-[0_0_12px_2px_var(--sirena-yellow)]" />
          )}

          {phase === "done" && (
            <div className="animate-pop-in flex flex-col items-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-sirena-green">
                <Check className="h-8 w-8 text-primary-foreground" aria-hidden />
              </div>
              <p className="mt-2 text-sm font-extrabold">Compra verificada</p>
            </div>
          )}

          {phase === "discrepancy_not_visible" && (
            <div className="animate-pop-in flex flex-col items-center px-4 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sirena-yellow text-sirena-navy-deep">
                <AlertTriangle className="h-7 w-7" aria-hidden />
              </div>
              <p className="mt-1 text-xs font-bold text-secondary">
                Atención: 1 producto no visible
              </p>
            </div>
          )}

          {phase === "discrepancy_extra_item" && (
            <div className="animate-pop-in flex flex-col items-center px-4 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sirena-yellow text-sirena-navy-deep">
                <Plus className="h-7 w-7" aria-hidden />
              </div>
              <p className="mt-1 text-xs font-bold text-secondary">
                Detectamos un producto adicional
              </p>
            </div>
          )}

          {phase === "idle" && (
            <div className="flex flex-col items-center px-8 text-center">
              <Camera className="h-10 w-10 text-primary-foreground/40" aria-hidden />
              <p className="mt-2 text-xs font-semibold text-pretty">
                Coloca todos tus productos frente a la cámara
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Discrepancy Alerts & Item Checklist */}
      <div className="no-scrollbar mt-2.5 flex-1 overflow-y-auto px-5">
        {phase === "idle" && (
          <div className="flex items-start gap-2 rounded-2xl bg-primary-foreground/5 p-3 text-xs text-primary-foreground/75">
            <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-secondary" aria-hidden />
            <p className="text-pretty">
              Nuestra IA confirmará que los productos físicos en tu bolsa coincidan exactamente con tu compra.
            </p>
          </div>
        )}

        {phase === "discrepancy_not_visible" && (
          <div className="rounded-2xl bg-sirena-yellow/15 p-3.5 ring-1 ring-sirena-yellow/40 animate-slide-up">
            <div className="flex items-start gap-2 text-secondary">
              <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-extrabold text-foreground text-primary-foreground">
                  Algunos productos no pueden identificarse
                </p>
                <p className="mt-1 text-[11px] text-primary-foreground/80">
                  Por favor organiza tus productos o retira cualquier objeto que los tape para completar la verificación.
                </p>
              </div>
            </div>
          </div>
        )}

        {phase === "discrepancy_extra_item" && (
          <div className="rounded-2xl bg-secondary/20 p-3.5 ring-1 ring-secondary/50 animate-slide-up">
            <div className="flex items-start gap-2 text-secondary">
              <Sparkles className="h-4 w-4 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-extrabold text-primary-foreground">
                  Producto no registrado detectado en cámara
                </p>
                <p className="mt-1 text-[11px] text-primary-foreground/90 font-medium">
                  Detectamos <span className="font-bold text-secondary">{EXTRA_PRODUCT.name} ({formatDOP(EXTRA_PRODUCT.price)})</span> en tus manos. ¿Deseas sumarlo a tu compra?
                </p>
              </div>
            </div>
          </div>
        )}

        {(phase === "scanning" || phase === "done" || phase === "discrepancy_not_visible" || phase === "discrepancy_extra_item") && (
          <ul className="space-y-1.5 mt-2">
            {items.map((item, i) => {
              const ok = recognized.includes(i)
              const missing = phase === "discrepancy_not_visible" && !ok
              return (
                <li
                  key={item.id}
                  className={`flex items-center gap-2.5 rounded-xl p-2 ring-1 transition text-xs ${
                    ok
                      ? "bg-sirena-green/15 ring-sirena-green/40"
                      : missing
                      ? "bg-destructive/20 ring-destructive/40"
                      : "bg-primary-foreground/5 ring-primary-foreground/10"
                  }`}
                >
                  <span
                    className={`flex h-4 w-4 items-center justify-center rounded-full text-[10px] ${
                      ok
                        ? "bg-sirena-green text-primary-foreground"
                        : missing
                        ? "bg-destructive text-primary-foreground font-bold"
                        : "bg-primary-foreground/10 text-transparent"
                    }`}
                  >
                    {ok ? <Check className="h-3 w-3" /> : missing ? "!" : ""}
                  </span>
                  <span className="font-semibold truncate">
                    {item.name} {item.qty > 1 ? `(x${item.qty})` : ""}
                  </span>
                  <span className="ml-auto text-[10px] font-medium text-primary-foreground/60">
                    {ok ? "Reconocido" : missing ? "No visible" : "Analizando…"}
                  </span>
                </li>
              )
            })}
            {extraAdded && (
              <li className="flex items-center gap-2.5 rounded-xl p-2 bg-sirena-green/20 ring-1 ring-sirena-green text-xs animate-pop-in">
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-sirena-green text-primary-foreground">
                  <Check className="h-3 w-3" />
                </span>
                <span className="font-semibold truncate text-secondary">
                  {EXTRA_PRODUCT.name} (Agregado)
                </span>
                <span className="ml-auto text-[10px] font-bold text-sirena-green">
                  +{formatDOP(EXTRA_PRODUCT.price)}
                </span>
              </li>
            )}
          </ul>
        )}
      </div>

      {/* Actions */}
      <div className="px-5 pb-6 pt-2">
        {phase === "idle" && (
          <button
            type="button"
            onClick={startScan}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-secondary py-3.5 text-base font-extrabold text-secondary-foreground active:scale-[0.99]"
          >
            <Camera className="h-5 w-5" aria-hidden />
            Tomar foto
          </button>
        )}

        {phase === "scanning" && (
          <button
            type="button"
            disabled
            className="w-full rounded-2xl bg-primary-foreground/10 py-3.5 text-base font-bold text-primary-foreground/60"
          >
            Verificando… {recognized.length}/{items.length}
          </button>
        )}

        {phase === "discrepancy_not_visible" && (
          <div className="space-y-2">
            <button
              type="button"
              onClick={handleRetry}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-secondary py-3 text-sm font-extrabold text-secondary-foreground active:scale-[0.99]"
            >
              <RefreshCw className="h-4 w-4" />
              Volver a tomar foto
            </button>
            <button
              type="button"
              onClick={onVerified}
              className="w-full rounded-2xl py-2 text-xs font-semibold text-primary-foreground/75 hover:text-primary-foreground"
            >
              Continuar aceptando discrepancia
            </button>
          </div>
        )}

        {phase === "discrepancy_extra_item" && (
          <div className="space-y-2">
            <button
              type="button"
              onClick={handleAddExtra}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-sirena-green py-3 text-sm font-extrabold text-primary-foreground active:scale-[0.99]"
            >
              <Plus className="h-4 w-4" />
              Agregar al carrito (+{formatDOP(EXTRA_PRODUCT.price)})
            </button>
            <button
              type="button"
              onClick={handleIgnoreExtra}
              className="w-full rounded-2xl py-2 text-xs font-semibold text-primary-foreground/75 hover:text-primary-foreground"
            >
              Retirar producto / No agregar
            </button>
          </div>
        )}

        {phase === "done" && (
          <button
            type="button"
            onClick={onVerified}
            className="animate-slide-up flex w-full items-center justify-center gap-2 rounded-2xl bg-sirena-green py-3.5 text-base font-extrabold text-primary-foreground active:scale-[0.99]"
          >
            <CreditCard className="h-5 w-5" aria-hidden />
            Continuar al pago
            <ChevronRight className="h-5 w-5" aria-hidden />
          </button>
        )}
      </div>
    </div>
  )
}

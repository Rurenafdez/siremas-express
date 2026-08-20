"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
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
  X,
  ShieldCheck,
  Trash2,
} from "lucide-react"
import {
  type CartLine,
  type Product,
  type AiScenarioId,
  AI_VERIFY_SCENARIOS,
  CATALOG,
  formatDOP,
} from "@/lib/express-data"

type Phase = "idle" | "scanning" | "done" | "discrepancy_not_visible"

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
  onRemoveFromCart,
  onVerified,
  onBack,
}: {
  cart: CartLine[]
  onAddToCart?: (product: Product) => void
  onRemoveFromCart?: (productId: string) => void
  onVerified: (photos: string[]) => void
  onBack: () => void
}) {
  const [phase, setPhase] = useState<Phase>("idle")
  const [scenario, setScenario] = useState<AiScenarioId>("happy")
  const [showScenarioMenu, setShowScenarioMenu] = useState(false)
  const [recognized, setRecognized] = useState<number[]>([])
  const [extraAdded, setExtraAdded] = useState(false)
  const [photos, setPhotos] = useState<string[]>([])
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const items = cart

  useEffect(() => {
    return () => timers.current.forEach(clearTimeout)
  }, [])

  function addSnapshot() {
    const samplePhotos = [
      "/products/jugo-wala.png",
      "/products/galletas.png",
      "/products/papitas-wala.png",
      "/products/jamon.png",
    ]
    const nextPhoto = samplePhotos[photos.length % samplePhotos.length]
    setPhotos((prev) => [...prev, nextPhoto])
  }

  function handleNativeCapture(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setPhotos((prev) => [...prev, url])
      if (phase === "idle") {
        startScan()
      }
    }
  }

  function handleRemovePhoto(index: number) {
    setPhotos((prev) => prev.filter((_, i) => i !== index))
  }

  function startScan() {
    if (photos.length === 0) {
      addSnapshot()
    }
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
      // All cart items recognized + automatically add extra item to cart immediately
      items.forEach((_, i) => {
        const t = setTimeout(() => {
          setRecognized((prev) => [...prev, i])
          if (i === items.length - 1) {
            const done = setTimeout(() => {
              // Automatically add to cart without blocking decision modal (Point 1 update)
              onAddToCart?.(EXTRA_PRODUCT)
              setExtraAdded(true)
              setPhase("done")
            }, 500)
            timers.current.push(done)
          }
        }, 450 * (i + 1))
        timers.current.push(t)
      })
    }
  }

  function handleRemoveExtra() {
    onRemoveFromCart?.(EXTRA_PRODUCT.id)
    setExtraAdded(false)
  }

  function handleRetry() {
    setPhase("idle")
    setRecognized([])
    setPhotos([])
    setExtraAdded(false)
  }

  function handleProceedToPayment() {
    const finalPhotos = photos.length > 0 ? photos : ["/products/jugo-wala.png"]
    onVerified(finalPhotos)
  }

  return (
    <div className="flex h-full flex-col bg-sirena-navy-deep text-primary-foreground">
      {/* Hidden native live camera input (capture="environment" restricts to live camera, no gallery) */}
      <input
        type="file"
        accept="image/*"
        capture="environment"
        ref={fileInputRef}
        onChange={handleNativeCapture}
        className="hidden"
      />

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
        <div className="relative flex aspect-square w-full max-h-[185px] items-center justify-center overflow-hidden rounded-3xl bg-primary/40 ring-1 ring-primary-foreground/10 shadow-inner">
          <span className="absolute left-4 top-4 h-7 w-7 rounded-tl-xl border-l-4 border-t-4 border-secondary" />
          <span className="absolute right-4 top-4 h-7 w-7 rounded-tr-xl border-r-4 border-t-4 border-secondary" />
          <span className="absolute bottom-4 left-4 h-7 w-7 rounded-bl-xl border-b-4 border-l-4 border-secondary" />
          <span className="absolute bottom-4 right-4 h-7 w-7 rounded-br-xl border-b-4 border-r-4 border-secondary" />

          {phase === "scanning" && (
            <span className="animate-scanline absolute inset-x-8 h-0.5 rounded-full bg-secondary shadow-[0_0_12px_2px_var(--sirena-yellow)]" />
          )}

          {phase === "done" && (
            <div className="animate-pop-in flex flex-col items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sirena-green shadow-md">
                <Check className="h-7 w-7 text-primary-foreground" aria-hidden />
              </div>
              <p className="mt-1.5 text-sm font-extrabold text-primary-foreground">Compra verificada</p>
              <span className="text-[10px] text-primary-foreground/80">
                Evidencia guardada ({photos.length || 1} {photos.length === 1 ? "foto" : "fotos"})
              </span>
            </div>
          )}

          {phase === "discrepancy_not_visible" && (
            <div className="animate-pop-in flex flex-col items-center px-4 text-center">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-sirena-yellow text-sirena-navy-deep">
                <AlertTriangle className="h-6 w-6" aria-hidden />
              </div>
              <p className="mt-1 text-xs font-bold text-secondary">
                1 producto no visible en fotos
              </p>
            </div>
          )}

          {phase === "idle" && (
            <div className="flex flex-col items-center px-8 text-center">
              <Camera className="h-9 w-9 text-primary-foreground/40" aria-hidden />
              <p className="mt-1.5 text-xs font-semibold text-pretty">
                Coloca todos tus productos frente a la cámara
              </p>
              <span className="mt-1 inline-flex items-center gap-1 text-[10px] text-secondary font-medium">
                <ShieldCheck className="h-3 w-3" /> Solo cámara en vivo · Sin galería
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Multi-Photo Thumbnails Strip */}
      {photos.length > 0 && (
        <div className="px-5 pt-2.5">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold text-primary-foreground/80">
              Fotos de auditoría ({photos.length}):
            </span>
            {photos.length < 4 && phase !== "scanning" && (
              <button
                type="button"
                onClick={addSnapshot}
                className="flex items-center gap-1 text-[11px] font-bold text-secondary hover:underline"
              >
                <Plus className="h-3 w-3" />
                Agregar otra foto
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
            {photos.map((src, idx) => (
              <div
                key={idx}
                className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-card ring-1 ring-primary-foreground/20"
              >
                <Image
                  src={src || "/placeholder.svg"}
                  alt={`Foto ${idx + 1}`}
                  fill
                  className="object-contain p-1"
                />
                {phase !== "scanning" && (
                  <button
                    type="button"
                    onClick={() => handleRemovePhoto(idx)}
                    aria-label={`Eliminar foto ${idx + 1}`}
                    className="absolute right-0.5 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-primary-foreground shadow"
                  >
                    <X className="h-2.5 w-2.5" />
                  </button>
                )}
                <span className="absolute bottom-0.5 left-0.5 rounded bg-black/60 px-1 text-[8px] font-bold text-white">
                  #{idx + 1}
                </span>
              </div>
            ))}

            {photos.length < 4 && phase !== "scanning" && (
              <button
                type="button"
                onClick={addSnapshot}
                aria-label="Tomar otra foto"
                className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl border border-dashed border-primary-foreground/30 bg-primary-foreground/5 text-primary-foreground/60 transition hover:bg-primary-foreground/10"
              >
                <Plus className="h-4 w-4 text-secondary" />
                <span className="text-[9px] font-semibold mt-0.5">Otra foto</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Discrepancy Alerts & Item Checklist */}
      <div className="no-scrollbar mt-2 flex-1 overflow-y-auto px-5 space-y-2">
        {phase === "idle" && (
          <div className="flex items-start gap-2 rounded-2xl bg-primary-foreground/5 p-3 text-xs text-primary-foreground/75">
            <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-secondary" aria-hidden />
            <p className="text-pretty">
              Puedes tomar varias fotos si llevas muchos artículos. La IA analizará todas las tomas tomadas en vivo.
            </p>
          </div>
        )}

        {phase === "discrepancy_not_visible" && (
          <div className="rounded-2xl bg-sirena-yellow/15 p-3 ring-1 ring-sirena-yellow/40 animate-slide-up">
            <div className="flex items-start gap-2 text-secondary">
              <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-extrabold text-primary-foreground">
                  Algunos productos no pueden identificarse
                </p>
                <p className="mt-1 text-[11px] text-primary-foreground/80">
                  Organiza tus productos o toma una foto adicional para que podamos verificarlos.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Auto-added Item Notification Banner (Point 1 update) */}
        {extraAdded && (
          <div className="rounded-2xl bg-secondary/20 p-3 ring-1 ring-secondary/50 animate-slide-up">
            <div className="flex items-start gap-2 text-secondary">
              <Sparkles className="h-4 w-4 shrink-0 mt-0.5 text-secondary" />
              <div className="flex-1">
                <p className="text-xs font-extrabold text-primary-foreground">
                  Agregamos {EXTRA_PRODUCT.name} a tu compra
                </p>
                <p className="mt-0.5 text-[11px] text-primary-foreground/90 font-medium">
                  La detectamos en la foto y la sumamos automáticamente (+{formatDOP(EXTRA_PRODUCT.price)}).
                </p>
              </div>
            </div>
          </div>
        )}

        {(phase === "scanning" || phase === "done" || phase === "discrepancy_not_visible") && (
          <ul className="space-y-1.5">
            {items.map((item, i) => {
              const ok = recognized.includes(i) || item.id === EXTRA_PRODUCT.id
              const missing = phase === "discrepancy_not_visible" && !ok
              const isAutoAdded = item.id === EXTRA_PRODUCT.id && extraAdded

              return (
                <li
                  key={item.id}
                  className={`flex items-center gap-2.5 rounded-xl p-2.5 ring-1 transition text-xs ${
                    isAutoAdded
                      ? "bg-sirena-yellow/15 ring-sirena-yellow/50"
                      : ok
                      ? "bg-sirena-green/15 ring-sirena-green/40"
                      : missing
                      ? "bg-destructive/20 ring-destructive/40"
                      : "bg-primary-foreground/5 ring-primary-foreground/10"
                  }`}
                >
                  <span
                    className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[10px] ${
                      ok
                        ? "bg-sirena-green text-primary-foreground"
                        : missing
                        ? "bg-destructive text-primary-foreground font-bold"
                        : "bg-primary-foreground/10 text-transparent"
                    }`}
                  >
                    {ok ? <Check className="h-3 w-3" /> : missing ? "!" : ""}
                  </span>

                  <div className="min-w-0 flex-1">
                    <p className="font-semibold truncate">
                      {item.name} {item.qty > 1 ? `(x${item.qty})` : ""}
                    </p>
                    {isAutoAdded && (
                      <p className="text-[10px] font-bold text-secondary">
                        Detectado por IA en foto (+{formatDOP(item.price)})
                      </p>
                    )}
                  </div>

                  {isAutoAdded ? (
                    <button
                      type="button"
                      onClick={handleRemoveExtra}
                      className="rounded-lg bg-destructive/30 px-2 py-1 text-[10px] font-bold text-primary-foreground transition hover:bg-destructive/60 active:scale-95"
                    >
                      Quitar
                    </button>
                  ) : (
                    <span className="text-[10px] font-medium text-primary-foreground/60 shrink-0">
                      {ok ? "Reconocido" : missing ? "No visible" : "Analizando…"}
                    </span>
                  )}
                </li>
              )
            })}
          </ul>
        )}
      </div>

      {/* Actions */}
      <div className="px-5 pb-6 pt-2">
        {phase === "idle" && (
          <button
            type="button"
            onClick={startScan}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-secondary py-3.5 text-base font-extrabold text-secondary-foreground active:scale-[0.99] shadow-md transition"
          >
            <Camera className="h-5 w-5" aria-hidden />
            Tomar foto y verificar
          </button>
        )}

        {phase === "scanning" && (
          <button
            type="button"
            disabled
            className="w-full rounded-2xl bg-primary-foreground/10 py-3.5 text-base font-bold text-primary-foreground/60"
          >
            Analizando evidencias… {recognized.length}/{items.length}
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
              Tomar fotos de nuevo
            </button>
            <button
              type="button"
              onClick={handleProceedToPayment}
              className="w-full rounded-2xl py-2 text-xs font-semibold text-primary-foreground/75 hover:text-primary-foreground"
            >
              Continuar aceptando discrepancia
            </button>
          </div>
        )}

        {phase === "done" && (
          <button
            type="button"
            onClick={handleProceedToPayment}
            className="animate-slide-up flex w-full items-center justify-center gap-2 rounded-2xl bg-sirena-green py-3.5 text-base font-extrabold text-primary-foreground active:scale-[0.99] shadow-md"
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

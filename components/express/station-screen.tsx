"use client"

import { useEffect, useRef, useState } from "react"
import { QrCode as QrIcon, Check, ChevronRight, Store, ArrowLeft } from "lucide-react"
import { type CartLine, cartTotals, formatDOP } from "@/lib/express-data"

type Phase = "idle" | "scanning" | "confirmed"

const CHECKS = [
  "Compra identificada",
  "Productos verificados",
  "Total confirmado",
]

export function StationScreen({
  cart,
  onPay,
  onBack,
}: {
  cart: CartLine[]
  onPay: () => void
  onBack?: () => void
}) {
  const { total } = cartTotals(cart)
  const [phase, setPhase] = useState<Phase>("idle")
  const [step, setStep] = useState(0)
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])

  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  function startScan() {
    setPhase("scanning")
    setStep(0)
    CHECKS.forEach((_, i) => {
      const t = setTimeout(() => {
        setStep(i + 1)
        if (i === CHECKS.length - 1) {
          const d = setTimeout(() => setPhase("confirmed"), 500)
          timers.current.push(d)
        }
      }, 500 * (i + 1))
      timers.current.push(t)
    })
  }

  return (
    <div className="flex h-full flex-col bg-primary text-primary-foreground">
      {/* Kiosk chrome */}
      <div className="relative flex items-center justify-center gap-2 border-b border-primary-foreground/10 px-5 py-4">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            aria-label="Volver"
            className="absolute left-4 flex h-8 w-8 items-center justify-center rounded-full bg-primary-foreground/10"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
          </button>
        )}
        <Store className="h-5 w-5 text-secondary" aria-hidden />
        <p className="text-sm font-bold uppercase tracking-widest">
          Estación de Salida
        </p>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center px-6 py-6 text-center">
        <h1 className="text-2xl font-extrabold text-balance">Compra Exprés</h1>

        {phase !== "confirmed" && (
          <p className="mt-2 max-w-[16rem] text-sm text-primary-foreground/70 text-pretty">
            Escanea el código QR de tu teléfono en el lector.
          </p>
        )}

        {/* QR reader */}
        <div className="relative mt-6 flex h-52 w-52 items-center justify-center rounded-3xl bg-primary-foreground/5 ring-1 ring-primary-foreground/15">
          <span className="absolute left-4 top-4 h-9 w-9 rounded-tl-2xl border-l-4 border-t-4 border-secondary" />
          <span className="absolute right-4 top-4 h-9 w-9 rounded-tr-2xl border-r-4 border-t-4 border-secondary" />
          <span className="absolute bottom-4 left-4 h-9 w-9 rounded-bl-2xl border-b-4 border-l-4 border-secondary" />
          <span className="absolute bottom-4 right-4 h-9 w-9 rounded-br-2xl border-b-4 border-r-4 border-secondary" />

          {phase === "scanning" && (
            <span className="animate-scanline absolute inset-x-6 h-0.5 rounded-full bg-secondary shadow-[0_0_12px_2px_var(--sirena-yellow)]" />
          )}

          {phase === "confirmed" ? (
            <div className="animate-pop-in flex h-20 w-20 items-center justify-center rounded-full bg-sirena-green">
              <Check className="h-11 w-11 text-primary-foreground" aria-hidden />
            </div>
          ) : (
            <QrIcon className="h-16 w-16 text-primary-foreground/40" aria-hidden />
          )}
        </div>

        {/* Confirmations */}
        {phase !== "idle" && (
          <ul className="mt-6 w-full max-w-[17rem] space-y-2 text-left">
            {CHECKS.map((c, i) => {
              const ok = i < step
              return (
                <li
                  key={c}
                  className={`flex items-center gap-2.5 text-sm font-semibold transition ${
                    ok ? "text-primary-foreground" : "text-primary-foreground/40"
                  }`}
                >
                  <span
                    className={`flex h-5 w-5 items-center justify-center rounded-full ${
                      ok ? "bg-sirena-green" : "bg-primary-foreground/10"
                    }`}
                  >
                    <Check className="h-3.5 w-3.5" aria-hidden />
                  </span>
                  {c}
                </li>
              )
            })}
          </ul>
        )}

        {phase === "confirmed" && (
          <div className="animate-slide-up mt-6 flex w-full max-w-[17rem] items-baseline justify-between rounded-2xl bg-primary-foreground/10 px-4 py-3">
            <span className="text-sm text-primary-foreground/70">Total</span>
            <span className="text-2xl font-extrabold tabular-nums">
              {formatDOP(total)}
            </span>
          </div>
        )}
      </div>

      <div className="px-6 pb-7">
        {phase === "idle" && (
          <button
            type="button"
            onClick={startScan}
            className="w-full rounded-2xl bg-secondary py-4 text-base font-extrabold text-secondary-foreground active:scale-[0.99]"
          >
            Escanear QR
          </button>
        )}
        {phase === "scanning" && (
          <button
            type="button"
            disabled
            className="w-full rounded-2xl bg-primary-foreground/10 py-4 text-base font-bold text-primary-foreground/60"
          >
            Leyendo código…
          </button>
        )}
        {phase === "confirmed" && (
          <button
            type="button"
            onClick={onPay}
            className="animate-slide-up flex w-full items-center justify-center gap-2 rounded-2xl bg-secondary py-4 text-base font-extrabold text-secondary-foreground active:scale-[0.99]"
          >
            Continuar al pago
            <ChevronRight className="h-5 w-5" aria-hidden />
          </button>
        )}
      </div>
    </div>
  )
}

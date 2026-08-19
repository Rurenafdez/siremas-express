"use client"

import { useState } from "react"
import {
  ArrowLeft,
  CreditCard,
  Wallet,
  Ticket,
  Plus,
  Check,
  Sparkles,
} from "lucide-react"
import { type CartLine, cartTotals, formatDOP } from "@/lib/express-data"

const METHODS = [
  {
    id: "siremas_points",
    icon: Sparkles,
    title: "Puntos Siremás",
    subtitle: "2,450 pts disponibles · Canjear",
    badge: "Recomendado",
  },
  {
    id: "saved",
    icon: CreditCard,
    title: "Visa •••• 4821",
    subtitle: "Tarjeta de crédito guardada",
  },
  { id: "new", icon: Plus, title: "Nueva tarjeta", subtitle: "Débito o crédito" },
  { id: "other", icon: Wallet, title: "Otros métodos", subtitle: "tPago, PayPal" },
]

export function PaymentScreen({
  cart,
  onPaid,
  onBack,
}: {
  cart: CartLine[]
  onPaid: () => void
  onBack: () => void
}) {
  const { total } = cartTotals(cart)
  const [selected, setSelected] = useState("siremas_points")
  const [processing, setProcessing] = useState(false)

  function pay() {
    setProcessing(true)
    setTimeout(onPaid, 1200)
  }

  return (
    <div className="flex h-full flex-col bg-background">
      <div className="bg-card">
        <header className="flex items-center gap-3 px-5 py-4 border-b border-border">
          <button
            type="button"
            onClick={onBack}
            aria-label="Volver"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-muted transition active:scale-95"
          >
            <ArrowLeft className="h-5 w-5" aria-hidden />
          </button>
          <h1 className="text-lg font-extrabold text-foreground">Método de Pago</h1>
        </header>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar px-5 py-5">
        <div className="rounded-3xl bg-primary p-5 text-primary-foreground">
          <p className="text-sm text-primary-foreground/70">Total a pagar</p>
          <p className="mt-1 text-4xl font-extrabold tabular-nums">
            {formatDOP(total)}
          </p>
        </div>

        <h2 className="mb-3 mt-6 text-sm font-bold text-foreground">
          Método de pago
        </h2>
        <div className="space-y-2.5">
          {METHODS.map((m) => {
            const active = selected === m.id
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => setSelected(m.id)}
                className={`flex w-full items-center gap-3 rounded-2xl bg-card p-3.5 text-left ring-1 transition ${
                  active ? "ring-2 ring-primary" : "ring-border"
                }`}
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-muted text-foreground">
                  <m.icon className="h-5 w-5" aria-hidden />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-foreground">
                      {m.title}
                    </p>
                    {m.badge && (
                      <span className="rounded-full bg-sirena-yellow px-2 py-0.5 text-[10px] font-bold text-sirena-navy-deep">
                        {m.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{m.subtitle}</p>
                </div>
                <span
                  className={`flex h-5 w-5 items-center justify-center rounded-full ${
                    active
                      ? "bg-primary text-primary-foreground"
                      : "ring-1 ring-border"
                  }`}
                >
                  {active && <Check className="h-3.5 w-3.5" aria-hidden />}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="border-t border-border bg-card px-5 pb-7 pt-3">
        <button
          type="button"
          onClick={pay}
          disabled={processing}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-4 text-base font-extrabold text-primary-foreground active:scale-[0.99] disabled:opacity-70"
        >
          {processing ? "Procesando…" : `Pagar ${formatDOP(total)}`}
        </button>
      </div>
    </div>
  )
}

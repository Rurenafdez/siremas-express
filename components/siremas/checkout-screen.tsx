"use client"

import { ArrowLeft, Check, ShieldCheck, Store } from "lucide-react"
import { QrCode } from "./qr-code"
import {
  cartTotals,
  formatDOP,
  lineBase,
  type CartLine,
} from "@/lib/siremas-data"

export function CheckoutScreen({
  userName,
  cart,
  orderId,
  onBack,
  onNewOrder,
}: {
  userName: string
  cart: CartLine[]
  orderId: string
  onBack: () => void
  onNewOrder: () => void
}) {
  const totals = cartTotals(cart)
  const itemCount = cart.reduce((n, l) => n + l.qty, 0)
  const savings = cart.reduce(
    (sum, l) => sum + l.base * (l.discount ?? 0) * l.qty,
    0,
  )

  return (
    <div className="flex min-h-full flex-col bg-background">
      {/* Header */}
      <header className="flex items-center gap-3 bg-sirena-navy px-4 py-3">
        <button
          onClick={onBack}
          aria-label="Volver"
          className="grid size-9 place-items-center rounded-full bg-white/10 text-white transition active:scale-90"
        >
          <ArrowLeft className="size-5" />
        </button>
        <div className="leading-tight">
          <p className="text-sm font-bold text-white">Pago confirmado</p>
          <p className="text-[11px] text-white/60">Orden {orderId}</p>
        </div>
        <span className="ml-auto flex items-center gap-1 rounded-full bg-sirena-green px-2.5 py-1 text-[11px] font-bold text-white">
          <Check className="size-3" /> Pagado
        </span>
      </header>

      <div className="flex-1 space-y-4 overflow-y-auto px-5 pb-8 pt-5">
        {/* QR exit card */}
        <div className="animate-pop-in overflow-hidden rounded-3xl bg-sirena-yellow p-1 shadow-xl">
          <div className="rounded-[1.4rem] bg-card p-5 text-center">
            <span className="inline-flex items-center gap-1 rounded-full bg-sirena-navy px-3 py-1 text-[11px] font-bold text-sirena-yellow">
              <Store className="size-3" /> Pase de salida
            </span>
            <div className="mx-auto mt-4 w-44 rounded-2xl border-4 border-sirena-navy-deep bg-white p-3">
              <QrCode value={orderId} />
            </div>
            <p className="mx-auto mt-4 max-w-[15rem] text-pretty text-sm font-medium leading-relaxed text-muted-foreground">
              Muestra este código al{" "}
              <span className="font-bold text-foreground">Auditor Express</span>{" "}
              en la puerta para salir sin filas.
            </p>
            <div className="mt-3 flex items-center justify-center gap-1.5 text-xs font-semibold text-sirena-green">
              <ShieldCheck className="size-4" />
              Compra verificada · {userName}
            </div>
          </div>
        </div>

        {/* Digital receipt */}
        <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
          <div className="border-b border-dashed border-border px-5 py-4">
            <h3 className="text-sm font-extrabold text-foreground">
              Recibo digital
            </h3>
            <p className="text-[11px] text-muted-foreground">
              {itemCount} artículos · La Sirena Dominicana
            </p>
          </div>

          <ul className="divide-y divide-border px-5">
            {cart.map((l) => (
              <li
                key={l.id}
                className="flex items-center justify-between gap-3 py-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-foreground">
                    {l.name}
                    <span className="ml-1 text-xs font-normal text-muted-foreground">
                      x{l.qty}
                    </span>
                  </p>
                  {(l.discount ?? 0) > 0 && (
                    <p className="text-[11px] font-medium text-sirena-green">
                      Ahorro {Math.round((l.discount ?? 0) * 100)}% ·{" "}
                      {l.discountLabel ?? "Descuento"}
                    </p>
                  )}
                </div>
                <span className="shrink-0 text-sm font-bold text-foreground">
                  {formatDOP(lineBase(l))}
                </span>
              </li>
            ))}
          </ul>

          <div className="space-y-1 border-t border-dashed border-border px-5 py-4">
            <Row label="Subtotal" value={formatDOP(totals.subtotal)} />
            <Row label="ITBIS (18%)" value={formatDOP(totals.itbis)} />
            {savings > 0 && (
              <Row
                label="Ahorro total"
                value={"- " + formatDOP(savings)}
                accent
              />
            )}
            <div className="flex items-center justify-between pt-2">
              <span className="text-base font-extrabold text-foreground">
                Total pagado
              </span>
              <span className="text-xl font-black text-sirena-navy">
                {formatDOP(totals.total)}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={onNewOrder}
          className="w-full rounded-2xl bg-sirena-navy py-3.5 text-base font-bold text-primary-foreground shadow-lg shadow-sirena-navy/30 transition active:scale-[0.98]"
        >
          Nueva Compra Express
        </button>
      </div>
    </div>
  )
}

function Row({
  label,
  value,
  accent,
}: {
  label: string
  value: string
  accent?: boolean
}) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span
        className={`font-semibold ${accent ? "text-sirena-green" : "text-foreground"}`}
      >
        {value}
      </span>
    </div>
  )
}

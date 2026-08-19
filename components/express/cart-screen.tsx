"use client"

import { ArrowLeft, ShieldCheck, Tag } from "lucide-react"
import {
  type CartLine,
  cartTotals,
  formatDOP,
} from "@/lib/express-data"
import { StatusBar } from "./status-bar"
import { CartRow } from "./cart-row"

export function CartScreen({
  cart,
  onInc,
  onDec,
  onRemove,
  onVerify,
  onBack,
}: {
  cart: CartLine[]
  onInc: (id: string) => void
  onDec: (id: string) => void
  onRemove: (id: string) => void
  onVerify: () => void
  onBack: () => void
}) {
  const { subtotal, discounts, total } = cartTotals(cart)

  return (
    <div className="flex h-full flex-col bg-background">
      <div className="bg-card">
        <StatusBar />
        <header className="flex items-center gap-3 px-5 pb-3 pt-1">
          <button
            type="button"
            onClick={onBack}
            aria-label="Volver"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-muted"
          >
            <ArrowLeft className="h-5 w-5" aria-hidden />
          </button>
          <h1 className="text-lg font-extrabold text-foreground">
            Resumen de tu compra
          </h1>
        </header>
      </div>

      <div className="no-scrollbar flex-1 space-y-2.5 overflow-y-auto px-5 py-4">
        {cart.map((line) => (
          <CartRow
            key={line.id}
            line={line}
            onInc={onInc}
            onDec={onDec}
            onRemove={onRemove}
          />
        ))}
      </div>

      {/* Totals */}
      <div className="border-t border-border bg-card px-5 pb-6 pt-4">
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Subtotal</dt>
            <dd className="font-semibold tabular-nums text-foreground">
              {formatDOP(subtotal)}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Descuentos</dt>
            <dd className="font-semibold tabular-nums text-sirena-green">
              -{formatDOP(discounts)}
            </dd>
          </div>
          {discounts > 0 && (
            <div className="flex items-center justify-between rounded-xl bg-sirena-green-soft px-3 py-2">
              <dt className="flex items-center gap-1.5 text-sm font-semibold text-sirena-green">
                <Tag className="h-4 w-4" aria-hidden />
                Tu ahorro
              </dt>
              <dd className="font-extrabold tabular-nums text-sirena-green">
                {formatDOP(discounts)}
              </dd>
            </div>
          )}
          <div className="flex items-baseline justify-between border-t border-border pt-3">
            <dt className="text-base font-bold text-foreground">Total</dt>
            <dd className="text-2xl font-extrabold tabular-nums text-foreground">
              {formatDOP(total)}
            </dd>
          </div>
        </dl>

        <button
          type="button"
          onClick={onVerify}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-3.5 text-base font-extrabold text-primary-foreground active:scale-[0.99]"
        >
          <ShieldCheck className="h-5 w-5" aria-hidden />
          Verificar compra
        </button>
      </div>
    </div>
  )
}

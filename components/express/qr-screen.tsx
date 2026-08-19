"use client"

import { Check, Store, ChevronRight, ArrowLeft } from "lucide-react"
import { type CartLine, cartTotals, cartCount, formatDOP } from "@/lib/express-data"
import { StatusBar } from "./status-bar"
import { QrCode } from "./qr-code"

export function QrScreen({
  cart,
  orderId,
  onArrive,
  onBack,
}: {
  cart: CartLine[]
  orderId: string
  onArrive: () => void
  onBack?: () => void
}) {
  const { total } = cartTotals(cart)
  const count = cartCount(cart)

  return (
    <div className="flex h-full flex-col bg-background">
      <StatusBar />
      {onBack && (
        <div className="px-5 pt-1">
          <button
            type="button"
            onClick={onBack}
            aria-label="Volver"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-muted"
          >
            <ArrowLeft className="h-5 w-5" aria-hidden />
          </button>
        </div>
      )}
      <div className="flex flex-1 flex-col items-center px-6 pb-7 pt-2">
        <div className="flex items-center gap-2 rounded-full bg-sirena-green-soft px-3 py-1.5 text-sm font-bold text-sirena-green">
          <Check className="h-4 w-4" aria-hidden />
          Compra verificada
        </div>
        <p className="mt-3 text-center text-sm text-muted-foreground text-pretty">
          Tu compra está lista para pagar.
        </p>

        {/* QR card */}
        <div className="mt-5 w-full rounded-3xl bg-card p-5 shadow-lg ring-1 ring-border">
          <div className="mx-auto max-w-[15rem] rounded-2xl bg-background p-4 ring-1 ring-border">
            <QrCode value={orderId} />
          </div>
          <div className="mt-4 flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Orden</span>
            <span className="font-bold tabular-nums text-foreground">
              {orderId}
            </span>
          </div>
          <div className="mt-1 flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {count} productos · Total
            </span>
            <span className="font-extrabold tabular-nums text-foreground">
              {formatDOP(total)}
            </span>
          </div>
        </div>

        <p className="mt-5 text-center text-base font-bold text-foreground text-balance">
          Escanea este código en la estación de salida
        </p>

        {/* Kiosk hint */}
        <div className="mt-4 flex w-full items-center gap-3 rounded-2xl bg-muted p-3.5">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Store className="h-5 w-5" aria-hidden />
          </div>
          <p className="text-sm text-muted-foreground text-pretty">
            Acércate a cualquier <span className="font-semibold text-foreground">Estación Exprés</span> a la salida.
          </p>
        </div>

        <button
          type="button"
          onClick={onArrive}
          className="mt-auto flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-3.5 text-base font-extrabold text-primary-foreground active:scale-[0.99]"
        >
          Estoy en la estación
          <ChevronRight className="h-5 w-5" aria-hidden />
        </button>
      </div>
    </div>
  )
}

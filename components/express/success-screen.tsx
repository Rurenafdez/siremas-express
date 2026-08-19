"use client"

import { Check, Tag, Timer, Receipt } from "lucide-react"
import { type CartLine, cartTotals, formatDOP } from "@/lib/express-data"
import { StatusBar } from "./status-bar"

const TIME_SAVED_MIN = 12

export function SuccessScreen({
  cart,
  onReceipt,
  onFinish,
}: {
  cart: CartLine[]
  onReceipt: () => void
  onFinish: () => void
}) {
  const { total, discounts } = cartTotals(cart)

  return (
    <div className="flex h-full flex-col bg-sirena-green text-primary-foreground">
      <StatusBar dark />
      <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
        <div className="animate-pop-in flex h-24 w-24 items-center justify-center rounded-full bg-primary-foreground/15">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-foreground">
            <Check className="h-9 w-9 text-sirena-green" aria-hidden />
          </div>
        </div>

        <h1 className="mt-6 text-2xl font-extrabold text-balance">
          ¡Compra completada!
        </h1>
        <p className="mt-2 max-w-[16rem] text-sm text-primary-foreground/85 text-pretty">
          Gracias por comprar con Compra Exprés. ¡Llegas a tiempo a tu próximo
          destino!
        </p>

        {/* Stat cards */}
        <div className="mt-7 w-full space-y-3">
          <div className="flex items-center justify-between rounded-2xl bg-primary-foreground/12 px-4 py-3.5">
            <span className="text-sm font-medium text-primary-foreground/85">
              Total pagado
            </span>
            <span className="text-xl font-extrabold tabular-nums">
              {formatDOP(total)}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-primary-foreground/12 px-4 py-3.5 text-left">
              <div className="flex items-center gap-1.5 text-primary-foreground/85">
                <Tag className="h-4 w-4" aria-hidden />
                <span className="text-xs font-semibold">Ahorro</span>
              </div>
              <p className="mt-1 text-lg font-extrabold tabular-nums">
                {formatDOP(discounts)}
              </p>
            </div>
            <div className="rounded-2xl bg-primary-foreground/12 px-4 py-3.5 text-left">
              <div className="flex items-center gap-1.5 text-primary-foreground/85">
                <Timer className="h-4 w-4" aria-hidden />
                <span className="text-xs font-semibold">Tiempo</span>
              </div>
              <p className="mt-1 text-lg font-extrabold tabular-nums">
                {TIME_SAVED_MIN} min
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-2.5 px-6 pb-7">
        <button
          type="button"
          onClick={onReceipt}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary-foreground py-4 text-base font-extrabold text-sirena-green active:scale-[0.99]"
        >
          <Receipt className="h-5 w-5" aria-hidden />
          Ver recibo digital
        </button>
        <button
          type="button"
          onClick={onFinish}
          className="w-full rounded-2xl py-3 text-sm font-bold text-primary-foreground/90"
        >
          Finalizar
        </button>
      </div>
    </div>
  )
}

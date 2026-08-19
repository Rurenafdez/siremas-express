"use client"

import { Check, Tag, Timer, Receipt, Sparkles, Clock } from "lucide-react"
import { type CartLine, cartTotals, formatDOP } from "@/lib/express-data"
import { type PaymentDetails } from "@/lib/db/schema"

const TIME_SAVED_MIN = 12

export function SuccessScreen({
  cart,
  paymentDetails,
  onReceipt,
  onFinish,
}: {
  cart: CartLine[]
  paymentDetails?: PaymentDetails
  onReceipt: () => void
  onFinish: () => void
}) {
  const { total, discounts, savingsEnRebaja } = cartTotals(cart)
  const paymentDesc = paymentDetails?.description || "Visa •••• 4821"

  return (
    <div className="flex h-full flex-col bg-sirena-green text-primary-foreground">
      <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
        <div className="animate-pop-in flex h-20 w-20 items-center justify-center rounded-full bg-primary-foreground/15">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-foreground">
            <Check className="h-8 w-8 text-sirena-green" aria-hidden />
          </div>
        </div>

        <h1 className="mt-4 text-2xl font-extrabold text-balance">
          ¡Compra completada!
        </h1>
        <p className="mt-1 max-w-[17rem] text-xs text-primary-foreground/85 text-pretty">
          Gracias por comprar con Compra Exprés. ¡Llegas a tiempo a tu próximo destino!
        </p>

        {/* Stat cards */}
        <div className="mt-5 w-full space-y-2.5 text-left">
          {/* Payment Method Banner */}
          <div className="rounded-2xl bg-primary-foreground/15 px-4 py-2.5 text-xs text-primary-foreground/95">
            <span className="text-[10px] uppercase font-bold text-primary-foreground/70 block">
              Método de pago
            </span>
            <span className="font-bold text-sm truncate block mt-0.5">
              {paymentDesc}
            </span>
          </div>

          <div className="flex items-center justify-between rounded-2xl bg-primary-foreground/12 px-4 py-3">
            <span className="text-xs font-medium text-primary-foreground/85">
              Total pagado
            </span>
            <span className="text-xl font-extrabold tabular-nums">
              {formatDOP(total)}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div className="rounded-2xl bg-primary-foreground/12 px-4 py-3 text-left">
              <div className="flex items-center gap-1.5 text-primary-foreground/85">
                <Tag className="h-3.5 w-3.5" aria-hidden />
                <span className="text-[11px] font-semibold">Ahorro total</span>
              </div>
              <p className="mt-0.5 text-base font-extrabold tabular-nums">
                {formatDOP(discounts)}
              </p>
              {savingsEnRebaja > 0 && (
                <span className="text-[10px] text-yellow-200 block font-medium">
                  Incluye {formatDOP(savingsEnRebaja)} En rebaja
                </span>
              )}
            </div>

            <div className="rounded-2xl bg-primary-foreground/12 px-4 py-3 text-left">
              <div className="flex items-center gap-1.5 text-primary-foreground/85">
                <Timer className="h-3.5 w-3.5" aria-hidden />
                <span className="text-[11px] font-semibold">Tiempo ahorrado</span>
              </div>
              <p className="mt-0.5 text-base font-extrabold tabular-nums">
                {TIME_SAVED_MIN} min
              </p>
              <span className="text-[10px] text-primary-foreground/75 block font-medium">
                Sin filas en caja
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-2 px-6 pb-6">
        <button
          type="button"
          onClick={onReceipt}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary-foreground py-3.5 text-sm font-extrabold text-sirena-green active:scale-[0.99] shadow-md transition"
        >
          <Receipt className="h-4 w-4" aria-hidden />
          Ver recibo digital
        </button>
        <button
          type="button"
          onClick={onFinish}
          className="w-full rounded-2xl py-2.5 text-xs font-bold text-primary-foreground/90 transition active:scale-95"
        >
          Finalizar
        </button>
      </div>
    </div>
  )
}

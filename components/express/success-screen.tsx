"use client"

import { Check, Tag, Timer, Receipt, Sparkles, CreditCard, Wallet, Home, Store, Zap } from "lucide-react"
import { type CartLine, cartTotals, formatDOP } from "@/lib/express-data"
import { type PaymentDetails } from "@/lib/db/schema"

const TIME_SAVED_MIN = 12

function PaymentMethodIcon({ type }: { type?: string }) {
  if (type === "points") return <Sparkles className="h-4 w-4 text-secondary" />
  if (type === "tpago") return <Wallet className="h-4 w-4 text-blue-300" />
  if (type === "paypal") return <Wallet className="h-4 w-4 text-indigo-300" />
  return <CreditCard className="h-4 w-4 text-primary-foreground/60" />
}

export function SuccessScreen({
  cart,
  paymentDetails,
  fulfillment,
  deliveryAddress,
  pointsEarned = 0,
  onReceipt,
  onFinish,
}: {
  cart: CartLine[]
  paymentDetails?: PaymentDetails
  fulfillment?: "pickup" | "delivery"
  deliveryAddress?: string
  pointsEarned?: number
  onReceipt: () => void
  onFinish: () => void
}) {
  const { total, discounts, savingsEnRebaja } = cartTotals(cart)
  const paymentDesc = paymentDetails?.description || "Visa •••• 4821"

  return (
    <div className="flex h-full flex-col bg-sirena-green text-primary-foreground">
      <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
        {/* Success badge */}
        <div className="animate-pop-in flex h-20 w-20 items-center justify-center rounded-full bg-primary-foreground/15">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-foreground shadow-md">
            <Check className="h-8 w-8 text-sirena-green" aria-hidden />
          </div>
        </div>

        <h1 className="mt-4 text-2xl font-extrabold text-balance">
          ¡Compra completada!
        </h1>
        <p className="mt-1.5 max-w-[17rem] text-xs text-primary-foreground/80 text-pretty leading-relaxed">
          Gracias por comprar con Compra Exprés. ¡Llegas a tiempo a tu próximo destino!
        </p>

        {/* Stat cards */}
        <div className="mt-4 w-full space-y-2 text-left">
          {/* Points Earned Banner (Point 24) */}
          {pointsEarned > 0 && (
            <div className="rounded-2xl bg-secondary px-3.5 py-2.5 text-secondary-foreground shadow-sm flex items-center justify-between animate-pop-in">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-secondary shadow-sm">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div className="leading-tight">
                  <p className="text-xs font-extrabold">¡Ganaste Puntos Siremás!</p>
                  <p className="text-[10px] text-secondary-foreground/80 font-medium">1 pt/RD$100 (2x en marca Wala)</p>
                </div>
              </div>
              <span className="text-sm font-extrabold bg-primary px-2.5 py-1 rounded-full text-secondary">
                +{pointsEarned} pts
              </span>
            </div>
          )}

          {/* Payment Method Banner */}
          <div className="rounded-2xl bg-primary-foreground/15 px-4 py-2.5 flex items-center gap-2.5">
            <PaymentMethodIcon type={paymentDetails?.type} />
            <div className="min-w-0 flex-1">
              <span className="text-[10px] uppercase font-bold text-primary-foreground/65 block">
                Método de pago
              </span>
              <span className="font-bold text-xs truncate block mt-0.5">
                {paymentDesc}
              </span>
            </div>
          </div>

          {/* Fulfillment banner — shows if SirenaGo route was used */}
          {fulfillment && (
            <div className="rounded-2xl bg-primary-foreground/15 px-4 py-2.5 flex items-center gap-2.5">
              {fulfillment === "pickup" ? (
                <Store className="h-4 w-4 text-primary-foreground/60" />
              ) : (
                <Home className="h-4 w-4 text-primary-foreground/60" />
              )}
              <div className="min-w-0 flex-1">
                <span className="text-[10px] uppercase font-bold text-primary-foreground/65 block">
                  <Zap className="inline h-3 w-3 mr-0.5" />SirenaGo
                </span>
                <span className="font-bold text-xs block mt-0.5">
                  {fulfillment === "pickup"
                    ? "Retiro en tienda"
                    : deliveryAddress
                    ? `Entrega a: ${deliveryAddress}`
                    : "Entrega a domicilio"}
                </span>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between rounded-2xl bg-primary-foreground/12 px-4 py-2.5">
            <span className="text-xs font-medium text-primary-foreground/85">
              Total pagado
            </span>
            <span className="text-lg font-extrabold tabular-nums">
              {formatDOP(total)}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-2xl bg-primary-foreground/12 px-3.5 py-2 text-left">
              <div className="flex items-center gap-1.5 text-primary-foreground/85">
                <Tag className="h-3.5 w-3.5" aria-hidden />
                <span className="text-[11px] font-semibold">Ahorro total</span>
              </div>
              <p className="mt-0.5 text-sm font-extrabold tabular-nums">
                {formatDOP(discounts)}
              </p>
              {savingsEnRebaja > 0 && (
                <span className="text-[9px] text-yellow-200 block font-medium">
                  Incluye {formatDOP(savingsEnRebaja)} En rebaja
                </span>
              )}
            </div>

            <div className="rounded-2xl bg-primary-foreground/12 px-3.5 py-2 text-left">
              <div className="flex items-center gap-1.5 text-primary-foreground/85">
                <Timer className="h-3.5 w-3.5" aria-hidden />
                <span className="text-[11px] font-semibold">Tiempo ahorrado</span>
              </div>
              <p className="mt-0.5 text-sm font-extrabold tabular-nums">
                {TIME_SAVED_MIN} min
              </p>
              <span className="text-[9px] text-primary-foreground/70 block font-medium">
                Sin filas en caja
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-2 px-6 pb-6 pt-2">
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
          className="w-full rounded-2xl py-2 text-xs font-bold text-primary-foreground/85 transition active:scale-95"
        >
          Finalizar y volver al inicio
        </button>
      </div>
    </div>
  )
}

"use client"

import { Receipt, Check, Tag, ShieldCheck, Clock, Sparkles } from "lucide-react"
import {
  type CartLine,
  cartTotals,
  cartCount,
  formatDOP,
  linePaid,
  lineSaving,
} from "@/lib/express-data"
import { type PaymentDetails } from "@/lib/db/schema"
import { BottomSheet } from "./bottom-sheet"

export function ReceiptSheet({
  cart,
  orderId,
  paymentDetails,
  userName = "Camila Ramírez",
  onClose,
}: {
  cart: CartLine[]
  orderId: string
  paymentDetails?: PaymentDetails
  userName?: string
  onClose: () => void
}) {
  const { subtotal, discounts, savingsEnRebaja, total } = cartTotals(cart)
  const regularDiscounts = discounts - savingsEnRebaja
  const count = cartCount(cart)

  const paymentDesc = paymentDetails?.description || "Visa •••• 4821"

  return (
    <BottomSheet onClose={onClose} labelledBy="receipt-title">
      <div className="flex items-center justify-between pb-2 border-b border-dashed border-border">
        <div className="flex items-center gap-2 text-foreground">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Receipt className="h-5 w-5" aria-hidden />
          </div>
          <div>
            <h2 id="receipt-title" className="text-base font-extrabold leading-tight">
              Recibo Digital
            </h2>
            <p className="text-xs text-muted-foreground">La Sirena · Compra Exprés</p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-sirena-green-soft px-2.5 py-1 text-[11px] font-bold text-sirena-green">
          <Check className="h-3 w-3" /> Pagado
        </span>
      </div>

      {/* Header Info */}
      <div className="mt-3 space-y-1 text-xs text-muted-foreground">
        <div className="flex justify-between">
          <span>Orden:</span>
          <span className="font-bold text-foreground">{orderId}</span>
        </div>
        <div className="flex justify-between">
          <span>Cliente:</span>
          <span className="font-semibold text-foreground">{userName}</span>
        </div>
        <div className="flex justify-between items-start gap-2">
          <span>Método:</span>
          <span className="font-semibold text-right text-foreground">
            {paymentDesc}
          </span>
        </div>
      </div>

      {/* Cart Items Breakdown */}
      <div className="no-scrollbar my-3 max-h-48 space-y-2 overflow-y-auto border-y border-dashed border-border py-3">
        {cart.map((l) => {
          const saving = lineSaving(l)
          const isEnRebaja = l.promoType === "rebaja" || l.savingReason?.toLowerCase().includes("rebaja")
          return (
            <div key={l.id} className="flex items-center justify-between text-xs">
              <div className="min-w-0 flex-1 pr-2">
                <p className="truncate font-semibold text-foreground">
                  {l.name}
                  <span className="ml-1 font-normal text-muted-foreground">
                    x{l.qty}
                  </span>
                </p>
                {saving > 0 && (
                  <p className={`text-[10px] font-medium flex items-center gap-1 ${
                    isEnRebaja ? "text-amber-600 font-bold" : "text-sirena-green"
                  }`}>
                    {isEnRebaja && <Clock className="h-2.5 w-2.5" />}
                    {l.savingReason ?? "Ahorro"} -{formatDOP(saving)}
                  </p>
                )}
              </div>
              <span className="font-bold tabular-nums text-foreground">
                {formatDOP(linePaid(l))}
              </span>
            </div>
          )
        })}
      </div>

      {/* Financials Breakdown */}
      <div className="space-y-1.5 text-xs">
        <div className="flex justify-between text-muted-foreground">
          <span>Subtotal ({count} {count === 1 ? "artículo" : "artículos"})</span>
          <span className="font-semibold text-foreground">{formatDOP(subtotal)}</span>
        </div>

        {regularDiscounts > 0 && (
          <div className="flex justify-between text-sirena-green font-semibold">
            <span className="inline-flex items-center gap-1">
              <Tag className="h-3 w-3" /> Descuentos promocionales
            </span>
            <span>-{formatDOP(regularDiscounts)}</span>
          </div>
        )}

        {savingsEnRebaja > 0 && (
          <div className="flex justify-between text-amber-700 font-bold bg-amber-500/10 px-2 py-1 rounded-lg">
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3 w-3" /> Ahorro &ldquo;En rebaja&rdquo; (próximo a vencer)
            </span>
            <span>-{formatDOP(savingsEnRebaja)}</span>
          </div>
        )}

        <div className="flex items-baseline justify-between border-t border-border pt-2 text-sm">
          <span className="font-bold text-foreground">Total pagado</span>
          <span className="text-xl font-extrabold text-foreground">{formatDOP(total)}</span>
        </div>

        {/* Dynamic Payment Method Explanations */}
        {paymentDetails?.type === "split" && (
          <div className="mt-1 rounded-xl bg-muted p-2 text-[11px] text-muted-foreground space-y-0.5">
            <div className="flex justify-between">
              <span>• Puntos Siremás:</span>
              <span className="font-bold text-sirena-green">-{paymentDetails.pointsUsed} pts ({formatDOP(paymentDetails.pointsAmount || 0)})</span>
            </div>
            <div className="flex justify-between">
              <span>• {paymentDetails.cardUsed?.brand} •••• {paymentDetails.cardUsed?.last4}:</span>
              <span className="font-bold text-foreground">{formatDOP(paymentDetails.cardUsed?.amount || 0)}</span>
            </div>
          </div>
        )}
      </div>

      <div className="mt-3 flex items-center justify-center gap-1.5 rounded-xl bg-muted py-2 text-[11px] font-semibold text-muted-foreground">
        <ShieldCheck className="h-3.5 w-3.5 text-sirena-green" />
        Transacción autorizada · Salida express verificada
      </div>

      <button
        type="button"
        onClick={onClose}
        className="mt-4 w-full rounded-2xl bg-primary py-3 text-sm font-bold text-primary-foreground active:scale-[0.99]"
      >
        Cerrar recibo
      </button>
    </BottomSheet>
  )
}

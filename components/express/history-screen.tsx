"use client"

import { useState } from "react"
import { ArrowLeft, Receipt, Tag, RotateCcw, Clock, Sparkles } from "lucide-react"
import { type CartLine, cartCount, formatDOP } from "@/lib/express-data"
import { type Order } from "@/lib/db/schema"
import { ReceiptSheet } from "./receipt-sheet"

export function HistoryScreen({
  orders = [],
  onRepeatOrder,
  onBack,
}: {
  orders: Order[]
  onRepeatOrder?: (items: CartLine[]) => void
  onBack: () => void
}) {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  return (
    <div className="flex h-full flex-col bg-background">
      <div className="bg-card">
        <header className="flex items-center gap-3 px-5 py-4 border-b border-border">
          <button
            type="button"
            onClick={onBack}
            aria-label="Volver al inicio"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-muted transition active:scale-95"
          >
            <ArrowLeft className="h-5 w-5" aria-hidden />
          </button>
          <div className="leading-tight">
            <h1 className="text-base font-extrabold text-foreground">Historial de Compras</h1>
            <p className="text-xs text-muted-foreground">Tus compras con Compra Exprés</p>
          </div>
        </header>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar px-5 py-4 space-y-3">
        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground">
            <Clock className="h-12 w-12 text-muted-foreground/40 mb-3" />
            <p className="font-extrabold text-base text-foreground">Sin compras registradas</p>
            <p className="text-xs mt-1 max-w-[15rem]">
              Tus compras realizadas mediante Compra Exprés aparecerán aquí automáticamente.
            </p>
          </div>
        ) : (
          orders.map((order) => {
            const itemsCount = cartCount(order.items)
            return (
              <div
                key={order.id}
                className="flex w-full flex-col gap-2.5 rounded-2xl bg-card p-4 text-left shadow-sm ring-1 ring-border transition hover:ring-primary/40"
              >
                <div
                  onClick={() => setSelectedOrder(order)}
                  className="cursor-pointer space-y-2"
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="font-extrabold text-sm text-foreground flex items-center gap-1.5">
                      <Receipt className="h-4 w-4 text-primary" />
                      Orden {order.id}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {order.date.split("·")[0]}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-muted-foreground w-full">
                    <span>{itemsCount} {itemsCount === 1 ? "artículo" : "artículos"}</span>
                    <span className="text-base font-extrabold tabular-nums text-foreground">
                      {formatDOP(order.total)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between w-full text-[11px] flex-wrap gap-1">
                    <span className="text-muted-foreground truncate max-w-[12rem]">
                      {order.paymentDetails?.description || "Tarjeta Visa"}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {order.pointsEarned !== undefined && order.pointsEarned > 0 && (
                        <span className="inline-flex items-center gap-0.5 rounded-full bg-secondary px-2 py-0.5 text-[10px] font-extrabold text-secondary-foreground">
                          <Sparkles className="h-2.5 w-2.5" />
                          +{order.pointsEarned} pts
                        </span>
                      )}
                      {order.discounts > 0 && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-sirena-green-soft px-2 py-0.5 font-bold text-sirena-green">
                          <Tag className="h-3 w-3" />
                          Ahorro {formatDOP(order.discounts)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions: View Receipt & Repeat Purchase */}
                <div className="flex items-center gap-2 border-t border-border/60 pt-2.5">
                  <button
                    type="button"
                    onClick={() => setSelectedOrder(order)}
                    className="flex-1 rounded-xl bg-muted py-2 text-center text-xs font-bold text-foreground transition active:scale-95 hover:bg-muted/80"
                  >
                    Ver recibo
                  </button>
                  {onRepeatOrder && (
                    <button
                      type="button"
                      onClick={() => onRepeatOrder(order.items)}
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-primary py-2 text-center text-xs font-bold text-primary-foreground transition active:scale-95 hover:bg-primary/90 shadow-sm"
                    >
                      <RotateCcw className="h-3 w-3 text-secondary" />
                      Repetir compra
                    </button>
                  )}
                </div>
              </div>
            )
          })
        )}
      </div>

      {selectedOrder && (
        <ReceiptSheet
          cart={selectedOrder.items}
          orderId={selectedOrder.id}
          paymentDetails={selectedOrder.paymentDetails}
          verificationPhotos={selectedOrder.verificationPhotos}
          userName={selectedOrder.userName}
          fulfillment={selectedOrder.fulfillment}
          deliveryAddress={selectedOrder.deliveryAddress}
          pointsEarned={selectedOrder.pointsEarned}
          onRepeatOrder={
            onRepeatOrder
              ? () => {
                  const items = selectedOrder.items
                  setSelectedOrder(null)
                  onRepeatOrder(items)
                }
              : undefined
          }
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  )
}

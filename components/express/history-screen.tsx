"use client"

import { useState } from "react"
import { ArrowLeft, Receipt, ChevronRight, Tag, Clock, Sparkles } from "lucide-react"
import { type Order } from "@/lib/db/schema"
import { formatDOP } from "@/lib/express-data"
import { ReceiptSheet } from "./receipt-sheet"

export function HistoryScreen({
  orders,
  onBack,
}: {
  orders: Order[]
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
          <h1 className="text-lg font-extrabold text-foreground">
            Historial de Compras
          </h1>
        </header>
      </div>

      <div className="no-scrollbar flex-1 space-y-3 overflow-y-auto px-5 py-4">
        {orders.length === 0 ? (
          <div className="py-16 text-center text-sm text-muted-foreground">
            <Receipt className="mx-auto h-12 w-12 text-muted-foreground/40 mb-2" />
            <p className="font-semibold">No tienes compras registradas aún.</p>
            <p className="text-xs text-muted-foreground/80 mt-1">
              Tus compras en Compra Exprés aparecerán aquí con su recibo digital.
            </p>
          </div>
        ) : (
          orders.map((order) => {
            const itemsCount = order.items.reduce((s, i) => s + i.qty, 0)
            return (
              <button
                key={order.id}
                type="button"
                onClick={() => setSelectedOrder(order)}
                className="flex w-full flex-col gap-2 rounded-2xl bg-card p-4 text-left shadow-sm ring-1 ring-border transition active:scale-[0.98] hover:ring-primary/40"
              >
                <div className="flex items-center justify-between w-full">
                  <span className="font-extrabold text-sm text-foreground">
                    Orden {order.id}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {order.date.split("·")[0]}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground w-full">
                  <span>{itemsCount} {itemsCount === 1 ? "artículo" : "artículos"}</span>
                  <span className="text-sm font-extrabold tabular-nums text-foreground">
                    {formatDOP(order.total)}
                  </span>
                </div>

                <div className="flex items-center justify-between border-t border-border/50 pt-2 w-full text-[11px]">
                  <span className="text-muted-foreground truncate max-w-[13rem]">
                    {order.paymentDetails?.description || "Tarjeta Visa"}
                  </span>
                  {order.discounts > 0 && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-sirena-green-soft px-2 py-0.5 font-bold text-sirena-green">
                      <Tag className="h-3 w-3" />
                      Ahorro {formatDOP(order.discounts)}
                    </span>
                  )}
                </div>
              </button>
            )
          })
        )}
      </div>

      {selectedOrder && (
        <ReceiptSheet
          cart={selectedOrder.items}
          orderId={selectedOrder.id}
          paymentDetails={selectedOrder.paymentDetails}
          userName={selectedOrder.userName}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  )
}

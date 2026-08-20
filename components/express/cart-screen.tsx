"use client"

import { useState } from "react"
import { ArrowLeft, QrCode, Tag, Search, Zap, Smartphone } from "lucide-react"
import {
  type CartLine,
  type Product,
  cartTotals,
  formatDOP,
} from "@/lib/express-data"
import { CartRow } from "./cart-row"
import { ProductSearchModal } from "./product-search-modal"

export function CartScreen({
  cart,
  onAddToCart,
  onInc,
  onDec,
  onRemove,
  onVerify,
  onSirenaGo,
  onBack,
}: {
  cart: CartLine[]
  onAddToCart?: (product: Product) => void
  onInc: (id: string) => void
  onDec: (id: string) => void
  onRemove: (id: string) => void
  onVerify: () => void
  onSirenaGo?: () => void
  onBack: () => void
}) {
  const { subtotal, discounts, total } = cartTotals(cart)
  const [searchOpen, setSearchOpen] = useState(false)

  return (
    <div className="flex h-full flex-col bg-background">
      <div className="bg-card">
        <header className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBack}
              aria-label="Volver"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-muted transition active:scale-95"
            >
              <ArrowLeft className="h-5 w-5" aria-hidden />
            </button>
            <h1 className="text-lg font-extrabold text-foreground">
              Resumen de tu compra
            </h1>
          </div>
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            aria-label="Buscar producto para agregar"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-foreground transition active:scale-95 hover:bg-primary hover:text-primary-foreground"
          >
            <Search className="h-4 w-4" />
          </button>
        </header>
      </div>

      <div className="no-scrollbar flex-1 space-y-2.5 overflow-y-auto px-5 py-4">
        {cart.length === 0 ? (
          <div className="py-12 text-center text-sm text-muted-foreground">
            No tienes productos en el carrito.
          </div>
        ) : (
          cart.map((line) => (
            <CartRow
              key={line.id}
              line={line}
              onInc={onInc}
              onDec={onDec}
              onRemove={onRemove}
            />
          ))
        )}
      </div>

      {/* Totals & Dual Checkout Routes (Point 17) */}
      <div className="border-t border-border bg-card px-5 pb-6 pt-4">
        <dl className="space-y-1.5 text-sm">
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
            <div className="flex items-center justify-between rounded-xl bg-sirena-green-soft px-3 py-1.5">
              <dt className="flex items-center gap-1.5 text-xs font-bold text-sirena-green">
                <Tag className="h-3.5 w-3.5" aria-hidden />
                Tu ahorro
              </dt>
              <dd className="font-extrabold tabular-nums text-xs text-sirena-green">
                {formatDOP(discounts)}
              </dd>
            </div>
          )}
          <div className="flex items-baseline justify-between border-t border-border pt-2.5">
            <dt className="text-base font-bold text-foreground">Total</dt>
            <dd className="text-2xl font-extrabold tabular-nums text-foreground">
              {formatDOP(total)}
            </dd>
          </div>
        </dl>

        <div className="mt-4 space-y-2">
          {/* Route 1: QR Pass & Kiosk Verification */}
          <button
            type="button"
            onClick={onVerify}
            disabled={cart.length === 0}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-3.5 text-sm font-extrabold text-primary-foreground transition active:scale-[0.99] disabled:opacity-40 shadow-md"
          >
            <QrCode className="h-4 w-4 text-secondary" aria-hidden />
            Seguir con QR (Verificación Kiosco)
          </button>

          {/* Route 2: SirenaGo Mobile Direct Checkout */}
          {onSirenaGo && (
            <button
              type="button"
              onClick={onSirenaGo}
              disabled={cart.length === 0}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-secondary py-3 text-sm font-extrabold text-secondary-foreground transition active:scale-[0.99] disabled:opacity-40"
            >
              <Zap className="h-4 w-4" aria-hidden />
              Completar con SirenaGo (Pago 100% móvil)
            </button>
          )}
        </div>
      </div>

      {searchOpen && (
        <ProductSearchModal
          onAddProduct={(p) => onAddToCart?.(p)}
          onClose={() => setSearchOpen(false)}
        />
      )}
    </div>
  )
}

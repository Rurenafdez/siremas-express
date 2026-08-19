"use client"

import { useEffect, useState } from "react"
import {
  ScanBarcode,
  ArrowLeft,
  Check,
  ShoppingCart,
  ChevronRight,
  Search,
} from "lucide-react"
import {
  type CartLine,
  type Product,
  cartCount,
  cartTotals,
  formatDOP,
} from "@/lib/express-data"
import { CartRow } from "./cart-row"
import { ProductSearchModal } from "./product-search-modal"

export function ScannerScreen({
  cart,
  lastScanned,
  scanHint,
  scanDone,
  onScan,
  onAddToCart,
  onInc,
  onDec,
  onRemove,
  onViewCart,
  onBack,
}: {
  cart: CartLine[]
  lastScanned: { name: string; key: number } | null
  scanHint: string
  scanDone: boolean
  onScan: () => void
  onAddToCart?: (product: Product) => void
  onInc: (id: string) => void
  onDec: (id: string) => void
  onRemove: (id: string) => void
  onViewCart: () => void
  onBack: () => void
}) {
  const { total } = cartTotals(cart)
  const count = cartCount(cart)
  const [toast, setToast] = useState<string | null>(null)
  const [searchOpen, setSearchOpen] = useState(false)

  useEffect(() => {
    if (!lastScanned) return
    setToast(lastScanned.name)
    const t = setTimeout(() => setToast(null), 1600)
    return () => clearTimeout(t)
  }, [lastScanned])

  return (
    <div className="flex h-full flex-col bg-background">
      {/* Camera viewfinder */}
      <div className="relative bg-sirena-navy-deep text-primary-foreground">
        <div className="flex items-center justify-between px-5 py-4">
          <button
            type="button"
            onClick={onBack}
            aria-label="Volver"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-foreground/10 transition active:scale-95"
          >
            <ArrowLeft className="h-5 w-5" aria-hidden />
          </button>
          <p className="text-base font-extrabold">Compra Exprés</p>
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            aria-label="Buscar producto por nombre o pasillo"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-foreground/10 text-primary-foreground transition active:scale-95 hover:bg-primary-foreground/20"
          >
            <Search className="h-4 w-4" />
          </button>
        </div>

        <button
          type="button"
          onClick={onScan}
          disabled={scanDone}
          className="relative block w-full px-6 pb-6 pt-2 text-left disabled:opacity-90"
          aria-label={scanDone ? "Escaneo completo" : "Simular escaneo de producto"}
        >
          <div className="relative mx-auto flex h-44 w-full max-w-[16rem] items-center justify-center">
            {/* corner brackets */}
            <span className="absolute left-0 top-0 h-8 w-8 rounded-tl-xl border-l-4 border-t-4 border-secondary" />
            <span className="absolute right-0 top-0 h-8 w-8 rounded-tr-xl border-r-4 border-t-4 border-secondary" />
            <span className="absolute bottom-0 left-0 h-8 w-8 rounded-bl-xl border-b-4 border-l-4 border-secondary" />
            <span className="absolute bottom-0 right-0 h-8 w-8 rounded-br-xl border-b-4 border-r-4 border-secondary" />

            {!scanDone && (
              <span className="animate-scanline absolute inset-x-6 h-0.5 rounded-full bg-secondary shadow-[0_0_12px_2px_var(--sirena-yellow)]" />
            )}

            <ScanBarcode
              className="h-14 w-14 text-primary-foreground/40"
              aria-hidden
            />

            {/* Scan confirmation toast */}
            {toast && (
              <div className="animate-pop-in absolute -bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full bg-sirena-green px-4 py-2 text-sm font-bold text-primary-foreground shadow-lg">
                <Check className="h-4 w-4" aria-hidden />
                {toast}
              </div>
            )}
          </div>

          <p className="mt-6 text-center text-sm font-semibold">
            {scanDone
              ? "Todo escaneado. Revisa tu compra."
              : "Escanea el código de barras del producto"}
          </p>
          {!scanDone && (
            <p className="mt-1 text-center text-xs text-primary-foreground/60">
              Toca aquí para simular · {scanHint}
            </p>
          )}
        </button>
      </div>

      {/* Real-time cart */}
      <div className="flex items-center justify-between px-5 pb-2 pt-4">
        <h2 className="flex items-center gap-2 text-sm font-bold text-foreground">
          <ShoppingCart className="h-4 w-4" aria-hidden />
          Mi compra
        </h2>
        <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-bold text-muted-foreground">
          {count} {count === 1 ? "producto" : "productos"}
        </span>
      </div>

      <div className="no-scrollbar flex-1 space-y-2.5 overflow-y-auto px-5 pb-4">
        {cart.length === 0 ? (
          <div className="mt-10 text-center text-sm text-muted-foreground">
            Aún no has escaneado productos.
          </div>
        ) : (
          cart.map((line) => (
            <div key={line.id} className="animate-slide-up">
              <CartRow
                line={line}
                onInc={onInc}
                onDec={onDec}
                onRemove={onRemove}
              />
            </div>
          ))
        )}
      </div>

      {/* Sticky subtotal + view cart */}
      <div className="border-t border-border bg-card px-5 pb-6 pt-3">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Subtotal</span>
          <span className="text-lg font-extrabold tabular-nums text-foreground">
            {formatDOP(total)}
          </span>
        </div>
        <button
          type="button"
          onClick={onViewCart}
          disabled={cart.length === 0}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-3.5 text-base font-extrabold text-primary-foreground transition active:scale-[0.99] disabled:opacity-40"
        >
          Ver carrito
          <ChevronRight className="h-5 w-5" aria-hidden />
        </button>
      </div>

      {searchOpen && (
        <ProductSearchModal
          onAddProduct={(p) => {
            onAddToCart?.(p)
          }}
          onClose={() => setSearchOpen(false)}
        />
      )}
    </div>
  )
}

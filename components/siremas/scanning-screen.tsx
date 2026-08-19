"use client"

import {
  CircleUser,
  Leaf,
  ScanBarcode,
  Sparkles,
  Repeat2,
  ShoppingCart,
} from "lucide-react"
import { CartItem } from "./cart-item"
import {
  cartTotals,
  formatDOP,
  type CartLine,
} from "@/lib/siremas-data"

export function ScanningScreen({
  userName,
  cart,
  canScanMore,
  onScan,
  onInc,
  onDec,
  onRemove,
  onTriggerDiscount,
  onTriggerSubstitute,
  onCheckout,
}: {
  userName: string
  cart: CartLine[]
  canScanMore: boolean
  onScan: () => void
  onInc: (id: string) => void
  onDec: (id: string) => void
  onRemove: (id: string) => void
  onTriggerDiscount: () => void
  onTriggerSubstitute: () => void
  onCheckout: () => void
}) {
  const totals = cartTotals(cart)
  const itemCount = cart.reduce((n, l) => n + l.qty, 0)

  return (
    <div className="flex min-h-full flex-col">
      {/* Status bar */}
      <header className="flex items-center justify-between bg-sirena-navy px-4 py-3">
        <div className="flex items-center gap-2.5">
          <div className="grid size-9 place-items-center rounded-full bg-white/10 ring-1 ring-white/20">
            <CircleUser className="size-5 text-sirena-yellow" />
          </div>
          <div className="leading-tight">
            <p className="text-[11px] font-medium text-white/60">Comprando</p>
            <p className="text-sm font-bold text-white">{userName}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <Badge className="bg-sirena-green/20 text-sirena-green">
            <Leaf className="size-3" /> Eco x3
          </Badge>
          <Badge className="bg-sirena-yellow/20 text-sirena-yellow">
            <Sparkles className="size-3" /> Oro
          </Badge>
        </div>
      </header>

      {/* Camera viewfinder */}
      <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden bg-sirena-navy-deep">
        {/* simulated blurred shelf background */}
        <div
          className="absolute inset-0 opacity-70"
          style={{
            background:
              "radial-gradient(120% 80% at 50% 20%, #3a4a7a 0%, #1b2547 55%, #0f1631 100%)",
          }}
        />
        <div className="absolute inset-0 [background-image:linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:22px_22px]" />

        {/* Target guide */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-target-pulse relative h-40 w-60 rounded-2xl">
            <Corner className="left-0 top-0 border-l-4 border-t-4" />
            <Corner className="right-0 top-0 border-r-4 border-t-4" />
            <Corner className="bottom-0 left-0 border-b-4 border-l-4" />
            <Corner className="bottom-0 right-0 border-b-4 border-r-4" />
            {/* moving scan line */}
            <div className="absolute inset-x-4 top-1/2 h-0.5 -translate-y-1/2">
              <div className="animate-scanline h-0.5 w-full rounded-full bg-sirena-green shadow-[0_0_12px_2px_rgba(52,211,153,0.8)]" />
            </div>
            {/* faux barcode */}
            <div className="absolute inset-x-8 top-1/2 flex h-12 -translate-y-1/2 items-stretch justify-center gap-[3px] opacity-80">
              {BAR_PATTERN.map((w, i) => (
                <span
                  key={i}
                  className="block rounded-full bg-white/70"
                  style={{ width: w }}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="absolute left-1/2 top-4 -translate-x-1/2 rounded-full bg-black/40 px-3 py-1 text-[11px] font-medium text-white/80 backdrop-blur-sm">
          Apunta al código de barras
        </div>

        {/* Scan trigger */}
        <button
          onClick={onScan}
          disabled={!canScanMore}
          className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-sirena-green px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-black/30 transition active:scale-95 disabled:opacity-50"
        >
          <ScanBarcode className="size-4" />
          {canScanMore ? "Simular escaneo" : "Todo escaneado"}
        </button>
      </div>

      {/* Demo innovation triggers */}
      <div className="flex gap-2 px-4 pb-1 pt-3">
        <DemoButton
          onClick={onTriggerDiscount}
          className="border-sirena-green/40 bg-sirena-green-soft text-sirena-green"
          icon={<Leaf className="size-4" />}
          label="Salva-Alimentos"
        />
        <DemoButton
          onClick={onTriggerSubstitute}
          className="border-sirena-navy/20 bg-sirena-navy/5 text-sirena-navy"
          icon={<Repeat2 className="size-4" />}
          label="Sustituto"
        />
      </div>

      {/* Cart list */}
      <div className="flex items-center justify-between px-4 pb-2 pt-3">
        <h3 className="text-sm font-bold text-foreground">
          Tu carrito
          <span className="ml-1 text-muted-foreground">({itemCount})</span>
        </h3>
        <span className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
          <ShoppingCart className="size-3.5" /> Siremás Express
        </span>
      </div>

      <div className="no-scrollbar flex-1 space-y-2.5 overflow-y-auto px-4 pb-40">
        {cart.length === 0 ? (
          <div className="mt-10 flex flex-col items-center gap-2 text-center text-muted-foreground">
            <ScanBarcode className="size-8" />
            <p className="text-sm font-medium">
              Escanea tu primer producto para comenzar
            </p>
          </div>
        ) : (
          cart.map((line) => (
            <CartItem
              key={line.id}
              line={line}
              onInc={() => onInc(line.id)}
              onDec={() => onDec(line.id)}
              onRemove={() => onRemove(line.id)}
            />
          ))
        )}
      </div>

      {/* Sticky summary */}
      <div className="absolute inset-x-0 bottom-0 rounded-t-3xl border-t border-border bg-card/95 px-5 pb-5 pt-4 shadow-[0_-8px_24px_rgba(0,0,0,0.08)] backdrop-blur">
        <div className="space-y-1">
          <Row label="Subtotal" value={formatDOP(totals.subtotal)} />
          <Row label="ITBIS (18%)" value={formatDOP(totals.itbis)} />
          <div className="flex items-center justify-between pt-1">
            <span className="text-base font-extrabold text-foreground">
              Total
            </span>
            <span className="text-xl font-black text-sirena-navy">
              {formatDOP(totals.total)}
            </span>
          </div>
        </div>
        <button
          onClick={onCheckout}
          disabled={cart.length === 0}
          className="mt-3 w-full rounded-2xl bg-sirena-yellow py-3.5 text-base font-extrabold text-sirena-navy-deep shadow-lg shadow-sirena-yellow/40 transition active:scale-[0.98] disabled:opacity-50"
        >
          Finalizar y Pagar
        </button>
      </div>
    </div>
  )
}

const BAR_PATTERN = [3, 2, 5, 2, 3, 6, 2, 4, 2, 3, 5, 2, 4, 3, 2, 6, 3, 2, 4, 2]

function Corner({ className }: { className: string }) {
  return (
    <span
      className={`absolute size-6 rounded-[3px] border-sirena-green ${className}`}
    />
  )
}

function Badge({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-bold ${className}`}
    >
      {children}
    </span>
  )
}

function DemoButton({
  onClick,
  icon,
  label,
  className,
}: {
  onClick: () => void
  icon: React.ReactNode
  label: string
  className?: string
}) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl border py-2 text-xs font-bold transition active:scale-[0.97] ${className}`}
    >
      {icon}
      {label}
    </button>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-semibold text-foreground">{value}</span>
    </div>
  )
}

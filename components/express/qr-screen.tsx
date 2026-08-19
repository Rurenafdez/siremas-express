import { QrCode as QrIcon, ShieldCheck, ChevronRight, ArrowLeft, Store } from "lucide-react"
import { type CartLine, cartTotals, cartCount, formatDOP } from "@/lib/express-data"
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
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            aria-label="Volver"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-muted transition active:scale-95"
          >
            <ArrowLeft className="h-5 w-5" aria-hidden />
          </button>
        ) : (
          <span className="w-9" />
        )}
        <h1 className="text-base font-extrabold text-foreground">Pase de Salida QR</h1>
        <span className="w-9" />
      </div>

      <div className="flex flex-1 flex-col items-center px-6 pb-6 pt-3 overflow-y-auto no-scrollbar">
        <div className="flex items-center gap-2 rounded-full bg-sirena-yellow-soft px-3 py-1.5 text-xs font-bold text-secondary-foreground">
          <QrIcon className="h-4 w-4" aria-hidden />
          Pase de salida generado
        </div>
        <p className="mt-2 text-center text-xs text-muted-foreground text-pretty">
          Orden generada para verificar con IA y validar en estación.
        </p>

        {/* QR card */}
        <div className="mt-4 w-full rounded-3xl bg-card p-5 shadow-lg ring-1 ring-border">
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
              {count} {count === 1 ? "artículo" : "artículos"} · Total
            </span>
            <span className="font-extrabold tabular-nums text-foreground">
              {formatDOP(total)}
            </span>
          </div>
        </div>

        {/* Kiosk hint */}
        <div className="mt-4 flex w-full items-center gap-3 rounded-2xl bg-muted p-3.5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Store className="h-5 w-5" aria-hidden />
          </div>
          <p className="text-xs text-muted-foreground text-pretty">
            Siguiente paso: Confirma tus productos con la cámara de IA antes de la estación.
          </p>
        </div>

        <button
          type="button"
          onClick={onArrive}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-3.5 text-base font-extrabold text-primary-foreground transition active:scale-[0.99]"
        >
          <ShieldCheck className="h-5 w-5 text-secondary" aria-hidden />
          Verificar compra con IA
          <ChevronRight className="h-5 w-5" aria-hidden />
        </button>
      </div>
    </div>
  )
}

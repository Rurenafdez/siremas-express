"use client"

import { Leaf, Sparkles, X } from "lucide-react"
import { formatDOP } from "@/lib/siremas-data"

export function DiscountModal({
  productName,
  oldPrice,
  newPrice,
  percent,
  onClose,
}: {
  productName: string
  oldPrice: number
  newPrice: number
  percent: number
  onClose: () => void
}) {
  return (
    <Overlay onClose={onClose}>
      <div className="animate-pop-in relative w-full max-w-sm overflow-hidden rounded-[2rem] bg-card shadow-2xl">
        {/* Yellow → green header */}
        <div className="relative bg-gradient-to-br from-sirena-yellow to-sirena-green px-6 pb-14 pt-7 text-center">
          <button
            onClick={onClose}
            aria-label="Cerrar"
            className="absolute right-4 top-4 grid size-8 place-items-center rounded-full bg-black/10 text-sirena-navy-deep transition active:scale-90"
          >
            <X className="size-4" />
          </button>
          <div className="mx-auto grid size-16 place-items-center rounded-2xl bg-card/90 shadow-lg">
            <Leaf className="size-8 text-sirena-green" />
          </div>
          <h2 className="mt-4 text-balance text-xl font-extrabold text-sirena-navy-deep">
            Descuento Salva-Alimentos
          </h2>
        </div>

        {/* Floating discount badge */}
        <div className="relative -mt-8 flex justify-center">
          <span className="inline-flex items-center gap-1 rounded-full bg-sirena-navy px-4 py-2 text-sm font-bold text-primary-foreground shadow-lg">
            <Sparkles className="size-4 text-sirena-yellow" />
            {percent}% OFF dinámico
          </span>
        </div>

        <div className="px-6 pb-7 pt-5 text-center">
          <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
            ¡Gracias por salvar{" "}
            <span className="font-semibold text-foreground">
              {productName}
            </span>{" "}
            del desperdicio! Se aplicó un{" "}
            <span className="font-semibold text-sirena-green">
              {percent}% de descuento
            </span>{" "}
            automáticamente.
          </p>

          <div className="mt-5 flex items-center justify-center gap-3">
            <span className="text-base font-medium text-muted-foreground line-through">
              {formatDOP(oldPrice)}
            </span>
            <span className="rounded-xl bg-sirena-green-soft px-3 py-1.5 text-lg font-extrabold text-sirena-green">
              {formatDOP(newPrice)}
            </span>
          </div>

          <button
            onClick={onClose}
            className="mt-6 w-full rounded-2xl bg-sirena-green py-3.5 text-base font-bold text-white shadow-lg shadow-sirena-green/30 transition active:scale-[0.98]"
          >
            ¡Genial, seguir comprando!
          </button>
        </div>
      </div>
    </Overlay>
  )
}

function Overlay({
  children,
  onClose,
}: {
  children: React.ReactNode
  onClose: () => void
}) {
  return (
    <div
      className="absolute inset-0 z-40 flex items-center justify-center bg-sirena-navy-deep/50 px-5 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div onClick={(e) => e.stopPropagation()} className="w-full">
        {children}
      </div>
    </div>
  )
}

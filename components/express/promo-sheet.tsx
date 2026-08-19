"use client"

import Image from "next/image"
import { Sparkles, Plus, Clock } from "lucide-react"
import { type Product, formatDOP, lineSaving } from "@/lib/express-data"
import { BottomSheet } from "./bottom-sheet"

export function PromoSheet({
  promo,
  onAdd,
  onClose,
}: {
  promo: Product
  onAdd: () => void
  onClose: () => void
}) {
  const saving = lineSaving({ ...promo, qty: 1 })

  return (
    <BottomSheet onClose={onClose} labelledBy="promo-title">
      <div className="flex items-center gap-2 text-secondary-foreground">
        <span className="flex h-7 items-center gap-1 rounded-full bg-sirena-yellow px-2.5 text-[11px] font-bold uppercase tracking-wide text-sirena-navy-deep">
          <Clock className="h-3.5 w-3.5" aria-hidden /> En rebaja
        </span>
      </div>
      <h2 id="promo-title" className="mt-3 text-lg font-extrabold text-foreground">
        Producto próximo a vencer · Ahorro directo
      </h2>

      <div className="mt-4 flex items-center gap-4 rounded-2xl bg-muted p-3">
        <div className="relative h-20 w-20 shrink-0">
          <Image
            src={promo.image || "/placeholder.svg"}
            alt={promo.name}
            fill
            className="object-contain"
          />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-bold text-foreground">{promo.name}</p>
          <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-sirena-yellow-soft px-2 py-0.5 text-[11px] font-semibold text-secondary-foreground">
            <Clock className="h-3 w-3" aria-hidden />
            Próximo a vencer
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-xs text-muted-foreground line-through">
              {formatDOP(promo.originalPrice ?? promo.price)}
            </span>
            <span className="text-xl font-extrabold tabular-nums text-foreground">
              {formatDOP(promo.price)}
            </span>
          </div>
        </div>
      </div>

      <p className="mt-3 rounded-xl bg-sirena-green-soft px-3 py-2 text-center text-sm font-bold text-sirena-green">
        Ahorra {formatDOP(saving)}
      </p>

      <div className="mt-4 space-y-2">
        <button
          type="button"
          onClick={onAdd}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-3.5 text-base font-extrabold text-primary-foreground active:scale-[0.99]"
        >
          <Plus className="h-5 w-5" aria-hidden />
          Agregar oferta
        </button>
        <button
          type="button"
          onClick={onClose}
          className="w-full rounded-2xl py-2.5 text-sm font-semibold text-muted-foreground"
        >
          Ahora no
        </button>
      </div>
    </BottomSheet>
  )
}

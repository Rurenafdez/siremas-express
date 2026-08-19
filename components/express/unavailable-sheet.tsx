"use client"

import Image from "next/image"
import { ArrowRight, Tag, Plus, Sparkles } from "lucide-react"
import {
  type Product,
  formatDOP,
  lineSaving,
} from "@/lib/express-data"
import { BottomSheet } from "./bottom-sheet"

export function UnavailableSheet({
  unavailable,
  substitute,
  onAdd,
  onClose,
}: {
  unavailable: Product
  substitute: Product
  onAdd: () => void
  onClose: () => void
}) {
  const saving = lineSaving({ ...substitute, qty: 1 })

  return (
    <BottomSheet onClose={onClose} labelledBy="similar-product-title">
      <div className="flex items-center gap-2 text-primary">
        <Sparkles className="h-5 w-5 text-secondary" aria-hidden />
        <h2 id="similar-product-title" className="text-lg font-extrabold text-foreground">
          Producto similar
        </h2>
      </div>
      <p className="mt-1 text-sm text-muted-foreground text-pretty">
        Encontramos una alternativa de <span className="font-semibold text-foreground">marca propia La Sirena (Wala)</span> con la misma calidad a un mejor precio.
      </p>

      {/* Swap visual: original → similar substitute */}
      <div className="mt-4 flex items-center gap-3">
        <div className="flex flex-1 flex-col items-center rounded-2xl bg-muted p-3 opacity-75">
          <div className="relative h-16 w-16">
            <Image
              src={unavailable.image || "/placeholder.svg"}
              alt={unavailable.name}
              fill
              className="object-contain"
            />
          </div>
          <p className="mt-1 text-center text-xs font-semibold text-foreground line-clamp-1">
            {unavailable.name}
          </p>
          <span className="mt-0.5 rounded-full bg-muted-foreground/15 px-2 py-0.5 text-[10px] font-bold text-muted-foreground">
            Original
          </span>
        </div>

        <ArrowRight className="h-5 w-5 shrink-0 text-muted-foreground" aria-hidden />

        <div className="flex flex-1 flex-col items-center rounded-2xl bg-sirena-green-soft p-3 ring-1 ring-sirena-green/30">
          <div className="relative h-16 w-16">
            <Image
              src={substitute.image || "/placeholder.svg"}
              alt={substitute.name}
              fill
              className="object-contain"
            />
          </div>
          <p className="mt-1 text-center text-xs font-semibold text-foreground line-clamp-1">
            {substitute.name}
          </p>
          <div className="mt-1 flex flex-col items-center gap-1">
            <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2 py-0.5 text-[10px] font-bold text-secondary-foreground">
              <Sparkles className="h-2.5 w-2.5" /> Marca propia La Sirena
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-sirena-green px-2 py-0.5 text-[10px] font-bold text-primary-foreground">
              <Tag className="h-3 w-3" aria-hidden />
              Ahorra {formatDOP(saving)}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-baseline justify-center gap-2">
        <span className="text-sm text-muted-foreground line-through">
          {formatDOP(substitute.originalPrice ?? substitute.price)}
        </span>
        <span className="text-2xl font-extrabold tabular-nums text-foreground">
          {formatDOP(substitute.price)}
        </span>
      </div>

      <div className="mt-4 space-y-2">
        <button
          type="button"
          onClick={onAdd}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-3.5 text-base font-extrabold text-primary-foreground active:scale-[0.99] transition"
        >
          <Plus className="h-5 w-5" aria-hidden />
          Agregar producto similar (Ahorra {formatDOP(saving)})
        </button>
        <button
          type="button"
          onClick={onClose}
          className="w-full rounded-2xl py-2.5 text-sm font-semibold text-muted-foreground hover:text-foreground"
        >
          No, gracias
        </button>
      </div>
    </BottomSheet>
  )
}

"use client"

import Image from "next/image"
import { Minus, Plus, Trash2 } from "lucide-react"
import {
  formatDOP,
  lineBase,
  lineItbis,
  type CartLine,
} from "@/lib/siremas-data"

export function CartItem({
  line,
  onInc,
  onDec,
  onRemove,
}: {
  line: CartLine
  onInc: () => void
  onDec: () => void
  onRemove: () => void
}) {
  const discounted = (line.discount ?? 0) > 0
  const unitFull = line.base
  const unitNow = line.base * (1 - (line.discount ?? 0))

  return (
    <div className="animate-slide-up flex gap-3 rounded-2xl border border-border bg-card p-3 shadow-sm">
      <div className="relative grid size-[68px] shrink-0 place-items-center overflow-hidden rounded-xl bg-white">
        <Image
          src={line.image || "/placeholder.svg"}
          alt={line.name}
          width={68}
          height={68}
          className="h-full w-full object-contain"
        />
        {discounted && (
          <span className="absolute left-1 top-1 rounded-md bg-sirena-green px-1.5 py-0.5 text-[10px] font-bold leading-none text-white">
            -{Math.round((line.discount ?? 0) * 100)}%
          </span>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-foreground">
              {line.name}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {line.discountLabel ?? line.detail}
            </p>
          </div>
          <button
            onClick={onRemove}
            aria-label={`Eliminar ${line.name}`}
            className="grid size-7 shrink-0 place-items-center rounded-lg text-muted-foreground transition active:scale-90 hover:text-destructive"
          >
            <Trash2 className="size-4" />
          </button>
        </div>

        <div className="mt-1 flex items-center gap-2">
          {discounted && (
            <span className="text-xs text-muted-foreground line-through">
              {formatDOP(unitFull)}
            </span>
          )}
          <span className="text-sm font-extrabold text-foreground">
            {formatDOP(unitNow)}
          </span>
          <span className="text-[11px] text-muted-foreground">
            ITBIS {formatDOP(lineItbis(line))}
          </span>
        </div>

        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center gap-1 rounded-full bg-muted p-1">
            <button
              onClick={onDec}
              aria-label="Restar"
              className="grid size-7 place-items-center rounded-full bg-card text-sirena-navy shadow-sm transition active:scale-90"
            >
              <Minus className="size-3.5" />
            </button>
            <span className="w-6 text-center text-sm font-bold tabular-nums text-foreground">
              {line.qty}
            </span>
            <button
              onClick={onInc}
              aria-label="Sumar"
              className="grid size-7 place-items-center rounded-full bg-sirena-navy text-primary-foreground shadow-sm transition active:scale-90"
            >
              <Plus className="size-3.5" />
            </button>
          </div>
          <span className="text-sm font-extrabold text-sirena-navy">
            {formatDOP(lineBase(line))}
          </span>
        </div>
      </div>
    </div>
  )
}

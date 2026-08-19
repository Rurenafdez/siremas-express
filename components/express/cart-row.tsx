"use client"

import Image from "next/image"
import { Minus, Plus, Trash2, Tag } from "lucide-react"
import {
  type CartLine,
  formatDOP,
  lineSaving,
  linePaid,
} from "@/lib/express-data"

export function CartRow({
  line,
  onInc,
  onDec,
  onRemove,
  compact = false,
}: {
  line: CartLine
  onInc?: (id: string) => void
  onDec?: (id: string) => void
  onRemove?: (id: string) => void
  compact?: boolean
}) {
  const saving = lineSaving(line)
  const editable = Boolean(onInc && onDec)

  return (
    <div className="flex items-center gap-3 rounded-2xl bg-card p-3 shadow-sm ring-1 ring-border">
      <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-muted">
        <Image
          src={line.image || "/placeholder.svg"}
          alt={line.name}
          width={56}
          height={56}
          className="h-full w-full object-contain"
        />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-foreground">
          {line.name}
        </p>
        <div className="mt-0.5 flex flex-wrap items-center gap-1.5">
          {saving > 0 && (
            <span className="inline-flex items-center gap-1 rounded-full bg-sirena-green-soft px-1.5 py-0.5 text-[10px] font-semibold text-sirena-green">
              <Tag className="h-2.5 w-2.5" aria-hidden />
              {line.savingReason ?? "Ahorro"} -{formatDOP(saving)}
            </span>
          )}
          {line.isStoreBrand && (
            <span className="rounded-full bg-sirena-yellow-soft px-1.5 py-0.5 text-[10px] font-bold text-secondary-foreground">
              Marca propia
            </span>
          )}
        </div>
        <p className="mt-0.5 truncate text-[11px] text-muted-foreground">{line.aisle}</p>
      </div>

      <div className="flex flex-col items-end gap-1.5">
        <div className="text-right leading-tight">
          {saving > 0 && (
            <p className="text-[11px] text-muted-foreground line-through">
              {formatDOP((line.originalPrice ?? line.price) * line.qty)}
            </p>
          )}
          <p className="text-sm font-bold tabular-nums text-foreground">
            {formatDOP(linePaid(line))}
          </p>
        </div>

        {editable && !compact && (
          <div className="flex items-center gap-1">
            {line.qty === 1 ? (
              <button
                type="button"
                onClick={() => onRemove?.(line.id)}
                aria-label={`Eliminar ${line.name}`}
                className="flex h-7 w-7 items-center justify-center rounded-full bg-muted text-muted-foreground active:scale-95"
              >
                <Trash2 className="h-3.5 w-3.5" aria-hidden />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onDec?.(line.id)}
                aria-label={`Quitar una unidad de ${line.name}`}
                className="flex h-7 w-7 items-center justify-center rounded-full bg-muted text-foreground active:scale-95"
              >
                <Minus className="h-3.5 w-3.5" aria-hidden />
              </button>
            )}
            <span className="w-5 text-center text-sm font-bold tabular-nums">
              {line.qty}
            </span>
            <button
              type="button"
              onClick={() => onInc?.(line.id)}
              aria-label={`Agregar una unidad de ${line.name}`}
              className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground active:scale-95"
            >
              <Plus className="h-3.5 w-3.5" aria-hidden />
            </button>
          </div>
        )}

        {compact && (
          <span className="text-xs font-medium text-muted-foreground">
            x{line.qty}
          </span>
        )}
      </div>
    </div>
  )
}

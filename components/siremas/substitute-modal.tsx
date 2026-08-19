"use client"

import Image from "next/image"
import { Repeat2, X, Tag } from "lucide-react"
import { formatDOP, type Product } from "@/lib/siremas-data"

export function SubstituteModal({
  outOfStockName,
  substitute,
  percent,
  onAdd,
  onClose,
}: {
  outOfStockName: string
  substitute: Product
  percent: number
  onAdd: () => void
  onClose: () => void
}) {
  const newPrice = substitute.base * (1 - percent / 100)

  return (
    <div
      className="absolute inset-0 z-40 flex items-center justify-center bg-sirena-navy-deep/50 px-5 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="animate-pop-in relative w-full max-w-sm overflow-hidden rounded-[2rem] bg-card shadow-2xl"
      >
        <div className="relative bg-gradient-to-br from-sirena-navy to-sirena-navy-deep px-6 pb-6 pt-7 text-center">
          <button
            onClick={onClose}
            aria-label="Cerrar"
            className="absolute right-4 top-4 grid size-8 place-items-center rounded-full bg-white/15 text-white transition active:scale-90"
          >
            <X className="size-4" />
          </button>
          <div className="mx-auto grid size-16 place-items-center rounded-2xl bg-white/10 ring-1 ring-white/20">
            <Repeat2 className="size-8 text-sirena-yellow" />
          </div>
          <h2 className="mt-4 text-xl font-extrabold text-white">
            Sustituto Inteligente
          </h2>
          <p className="mt-1 text-sm text-white/70">Ramos · Estante vacío</p>
        </div>

        <div className="px-6 pb-7 pt-5">
          <p className="text-pretty text-center text-sm leading-relaxed text-muted-foreground">
            <span className="font-semibold text-destructive">
              {outOfStockName}
            </span>{" "}
            está agotado. ¿Deseas sustituirlo por{" "}
            <span className="font-semibold text-foreground">
              {substitute.name}
            </span>{" "}
            con un{" "}
            <span className="font-semibold text-sirena-navy">
              {percent}% de descuento express
            </span>
            ?
          </p>

          <div className="mt-5 flex items-center gap-3 rounded-2xl border border-border bg-muted/50 p-3">
            <div className="grid size-16 shrink-0 place-items-center overflow-hidden rounded-xl bg-white">
              <Image
                src={substitute.image || "/placeholder.svg"}
                alt={substitute.name}
                width={64}
                height={64}
                className="h-full w-full object-contain"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-bold text-foreground">
                {substitute.name}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {substitute.detail}
              </p>
              <div className="mt-1 flex items-center gap-2">
                <span className="text-xs text-muted-foreground line-through">
                  {formatDOP(substitute.base)}
                </span>
                <span className="text-sm font-extrabold text-sirena-navy">
                  {formatDOP(newPrice)}
                </span>
              </div>
            </div>
            <span className="flex items-center gap-1 rounded-full bg-sirena-yellow px-2.5 py-1 text-xs font-bold text-sirena-navy-deep">
              <Tag className="size-3" />-{percent}%
            </span>
          </div>

          <button
            onClick={onAdd}
            className="mt-5 w-full rounded-2xl bg-sirena-navy py-3.5 text-base font-bold text-primary-foreground shadow-lg shadow-sirena-navy/30 transition active:scale-[0.98]"
          >
            Agregar Sustituto
          </button>
          <button
            onClick={onClose}
            className="mt-2 w-full rounded-2xl py-2.5 text-sm font-semibold text-muted-foreground transition active:scale-[0.98]"
          >
            No, gracias
          </button>
        </div>
      </div>
    </div>
  )
}

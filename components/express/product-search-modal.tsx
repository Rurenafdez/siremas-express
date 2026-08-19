"use client"

import { useState } from "react"
import Image from "next/image"
import { Search, X, Plus, MapPin, Tag, Sparkles } from "lucide-react"
import { type Product, formatDOP, searchProducts } from "@/lib/express-data"
import { BottomSheet } from "./bottom-sheet"

export function ProductSearchModal({
  onAddProduct,
  onClose,
}: {
  onAddProduct: (product: Product) => void
  onClose: () => void
}) {
  const [query, setQuery] = useState("")
  const [addedId, setAddedId] = useState<string | null>(null)

  const results = searchProducts(query)

  function handleAdd(p: Product) {
    onAddProduct(p)
    setAddedId(p.id)
    setTimeout(() => setAddedId(null), 1200)
  }

  return (
    <BottomSheet onClose={onClose} labelledBy="search-modal-title">
      <div className="flex items-center justify-between border-b border-border pb-3">
        <div>
          <h2 id="search-modal-title" className="text-base font-extrabold text-foreground">
            Buscar productos
          </h2>
          <p className="text-xs text-muted-foreground">Por nombre, marca o pasillo</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar búsqueda"
          className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground transition active:scale-95"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Search Input Bar */}
      <div className="mt-3 relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ej: Wala, Pasillo 4, Jamón, Arroz…"
          autoFocus
          className="w-full rounded-2xl bg-muted py-3 pl-10 pr-10 text-sm font-medium text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Results List */}
      <div className="no-scrollbar mt-3 max-h-72 space-y-2.5 overflow-y-auto pb-2">
        {results.length === 0 ? (
          <div className="py-8 text-center text-sm text-muted-foreground">
            No se encontraron productos para &ldquo;{query}&rdquo;
          </div>
        ) : (
          results.map((p) => {
            const isJustAdded = addedId === p.id
            return (
              <div
                key={p.id}
                className="flex items-center gap-3 rounded-2xl bg-card p-3 shadow-sm ring-1 ring-border"
              >
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-muted">
                  <Image
                    src={p.image || "/placeholder.svg"}
                    alt={p.name}
                    fill
                    className="object-contain"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <p className="truncate text-xs font-bold text-foreground">{p.name}</p>
                    {p.isStoreBrand && (
                      <span className="shrink-0 rounded-full bg-sirena-yellow px-1.5 py-0.2 text-[9px] font-bold text-sirena-navy-deep">
                        Wala
                      </span>
                    )}
                  </div>
                  <p className="truncate text-[11px] text-muted-foreground">{p.detail}</p>
                  <p className="flex items-center gap-1 text-[11px] font-medium text-primary">
                    <MapPin className="h-3 w-3 shrink-0" />
                    {p.aisle}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span className="text-xs font-extrabold tabular-nums text-foreground">
                    {formatDOP(p.price)}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleAdd(p)}
                    className={`flex h-8 items-center gap-1 rounded-xl px-2.5 text-xs font-bold transition active:scale-95 ${
                      isJustAdded
                        ? "bg-sirena-green text-primary-foreground"
                        : "bg-primary text-primary-foreground"
                    }`}
                  >
                    <Plus className="h-3.5 w-3.5" />
                    {isJustAdded ? "¡Agregado!" : "Agregar"}
                  </button>
                </div>
              </div>
            )
          })
        )}
      </div>
    </BottomSheet>
  )
}

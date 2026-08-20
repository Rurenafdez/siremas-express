"use client"

import { useState } from "react"
import {
  ArrowLeft,
  Store,
  Home,
  MapPin,
  ChevronRight,
  Zap,
  AlertCircle,
} from "lucide-react"
import { type FulfillmentType } from "@/lib/db/schema"

export function SirenaGoDeliveryScreen({
  onConfirm,
  onBack,
}: {
  onConfirm: (choice: FulfillmentType, address?: string) => void
  onBack: () => void
}) {
  const [selected, setSelected] = useState<FulfillmentType | null>(null)
  const [street, setStreet] = useState("")
  const [sector, setSector] = useState("")
  const [reference, setReference] = useState("")
  const [error, setError] = useState<string | null>(null)

  function handleConfirm() {
    if (!selected) {
      setError("Elige cómo quieres recibir tu compra.")
      return
    }
    if (selected === "delivery") {
      if (!street.trim() || !sector.trim()) {
        setError("Ingresa la calle/avenida y el sector para continuar.")
        return
      }
      const address = `${street.trim()}, ${sector.trim()}${reference.trim() ? ` — Ref: ${reference.trim()}` : ""}`
      onConfirm("delivery", address)
    } else {
      onConfirm("pickup")
    }
  }

  return (
    <div className="flex h-full flex-col bg-background">
      <div className="bg-card">
        <header className="flex items-center gap-3 px-5 py-4 border-b border-border">
          <button
            type="button"
            onClick={onBack}
            aria-label="Volver"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-muted transition active:scale-95"
          >
            <ArrowLeft className="h-5 w-5" aria-hidden />
          </button>
          <div>
            <h1 className="text-base font-extrabold text-foreground leading-tight flex items-center gap-2">
              <Zap className="h-4 w-4 text-secondary" aria-hidden />
              SirenaGo
            </h1>
            <p className="text-xs text-muted-foreground">¿Cómo recibirás tu compra?</p>
          </div>
        </header>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar px-5 py-5 space-y-3">
        {/* Option A — Pickup */}
        <button
          type="button"
          onClick={() => { setSelected("pickup"); setError(null) }}
          className={`flex w-full items-start gap-4 rounded-2xl p-4 text-left ring-1 transition ${
            selected === "pickup"
              ? "ring-2 ring-primary bg-primary/5"
              : "ring-border bg-card"
          }`}
        >
          <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
            selected === "pickup" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
          }`}>
            <Store className="h-6 w-6" aria-hidden />
          </div>
          <div className="flex-1 pt-0.5">
            <p className="font-extrabold text-sm text-foreground">Retirar más tarde</p>
            <p className="text-xs text-muted-foreground mt-0.5 leading-snug">
              Pasa a recoger tu compra cuando quieras. Tendremos todo listo en la tienda.
            </p>
          </div>
          <span
            className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
              selected === "pickup" ? "bg-primary text-primary-foreground" : "ring-1 ring-border"
            }`}
          >
            {selected === "pickup" && <span className="h-2.5 w-2.5 rounded-full bg-primary-foreground" />}
          </span>
        </button>

        {/* Option B — Delivery */}
        <div
          className={`rounded-2xl ring-1 transition ${
            selected === "delivery"
              ? "ring-2 ring-primary bg-primary/5"
              : "ring-border bg-card"
          }`}
        >
          <button
            type="button"
            onClick={() => { setSelected("delivery"); setError(null) }}
            className="flex w-full items-start gap-4 p-4 text-left"
          >
            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
              selected === "delivery" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
            }`}>
              <Home className="h-6 w-6" aria-hidden />
            </div>
            <div className="flex-1 pt-0.5">
              <p className="font-extrabold text-sm text-foreground">Llevar a mi casa</p>
              <p className="text-xs text-muted-foreground mt-0.5 leading-snug">
                Indica tu dirección y recibe tu compra en la puerta de tu hogar.
              </p>
            </div>
            <span
              className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                selected === "delivery" ? "bg-primary text-primary-foreground" : "ring-1 ring-border"
              }`}
            >
              {selected === "delivery" && <span className="h-2.5 w-2.5 rounded-full bg-primary-foreground" />}
            </span>
          </button>

          {/* Address Form — shown when delivery selected */}
          {selected === "delivery" && (
            <div className="border-t border-border/60 px-4 pb-4 space-y-3 pt-3">
              <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                <MapPin className="h-4 w-4 text-primary" />
                Dirección de entrega
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Calle / Avenida *
                </label>
                <input
                  type="text"
                  value={street}
                  onChange={(e) => { setStreet(e.target.value); setError(null) }}
                  placeholder="Ej: Av. Abraham Lincoln 256"
                  className="w-full rounded-xl bg-muted px-3.5 py-2.5 text-sm font-semibold text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Sector / Barrio *
                </label>
                <input
                  type="text"
                  value={sector}
                  onChange={(e) => { setSector(e.target.value); setError(null) }}
                  placeholder="Ej: Piantini, Naco, Los Prados…"
                  className="w-full rounded-xl bg-muted px-3.5 py-2.5 text-sm font-semibold text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Referencia (opcional)
                </label>
                <input
                  type="text"
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  placeholder="Ej: Frente al parque, Torre azul…"
                  className="w-full rounded-xl bg-muted px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <p className="text-[10px] text-muted-foreground">
                📍 Integración con Google Maps disponible próximamente. Por ahora guardamos tu dirección como texto.
              </p>
            </div>
          )}
        </div>

        {error && (
          <div className="flex items-start gap-2 rounded-xl bg-destructive/15 p-3 text-xs font-semibold text-destructive">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* CTA */}
      <div className="border-t border-border bg-card px-5 pb-7 pt-4">
        <button
          type="button"
          onClick={handleConfirm}
          disabled={!selected}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-4 text-base font-extrabold text-primary-foreground transition active:scale-[0.99] disabled:opacity-40 shadow-md"
        >
          Continuar al pago
          <ChevronRight className="h-5 w-5" aria-hidden />
        </button>
        <p className="mt-2 text-center text-[10px] text-muted-foreground">
          Podrás modificar tu dirección antes de confirmar el envío.
        </p>
      </div>
    </div>
  )
}

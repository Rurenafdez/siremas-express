"use client"

import { useState } from "react"
import { CreditCard, X, ShieldCheck, Check } from "lucide-react"
import { type Card } from "@/lib/db/schema"
import { BottomSheet } from "./bottom-sheet"

export function AddCardModal({
  onAddCard,
  onClose,
}: {
  onAddCard: (card: Omit<Card, "id">, savePermanently: boolean) => void
  onClose: () => void
}) {
  const [cardNumber, setCardNumber] = useState("")
  const [holderName, setHolderName] = useState("")
  const [expiry, setExpiry] = useState("")
  const [cvv, setCvv] = useState("")
  const [savePermanently, setSavePermanently] = useState(true)
  const [error, setError] = useState<string | null>(null)

  function formatCardNumber(value: string) {
    const cleaned = value.replace(/\D/g, "").slice(0, 16)
    const chunks = cleaned.match(/.{1,4}/g)
    return chunks ? chunks.join(" ") : cleaned
  }

  function formatExpiry(value: string) {
    const cleaned = value.replace(/\D/g, "").slice(0, 4)
    if (cleaned.length >= 3) {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`
    }
    return cleaned
  }

  function detectBrand(numberStr: string): string {
    const cleaned = numberStr.replace(/\D/g, "")
    if (cleaned.startsWith("4")) return "Visa"
    if (cleaned.startsWith("5")) return "Mastercard"
    if (cleaned.startsWith("3")) return "Amex"
    return "Visa"
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const cleanedNum = cardNumber.replace(/\D/g, "")

    if (cleanedNum.length < 15) {
      setError("Ingresa un número de tarjeta válido (16 dígitos)")
      return
    }
    if (!holderName.trim()) {
      setError("Ingresa el nombre del titular de la tarjeta")
      return
    }
    const [month, year] = expiry.split("/")
    if (!month || !year || month.length !== 2 || year.length !== 2) {
      setError("Ingresa una fecha de expiración válida (MM/AA)")
      return
    }
    if (cvv.replace(/\D/g, "").length < 3) {
      setError("Ingresa un CVV válido (3 o 4 dígitos)")
      return
    }

    const last4 = cleanedNum.slice(-4)
    const brand = detectBrand(cleanedNum)

    onAddCard(
      {
        last4,
        brand,
        holderName: holderName.trim(),
        expMonth: month,
        expYear: year,
      },
      savePermanently,
    )
    onClose()
  }

  return (
    <BottomSheet onClose={onClose} labelledBy="add-card-title">
      <div className="flex items-center justify-between border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <CreditCard className="h-4 w-4" />
          </div>
          <h2 id="add-card-title" className="text-base font-extrabold text-foreground">
            Nueva tarjeta
          </h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar modal"
          className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground transition active:scale-95"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
        {error && (
          <div className="rounded-xl bg-destructive/15 p-2.5 text-xs font-semibold text-destructive">
            {error}
          </div>
        )}

        {/* Card Number */}
        <div>
          <label className="block text-xs font-bold text-foreground mb-1">
            Número de tarjeta
          </label>
          <div className="relative">
            <input
              type="text"
              inputMode="numeric"
              placeholder="0000 0000 0000 0000"
              value={cardNumber}
              onChange={(e) => {
                setError(null)
                setCardNumber(formatCardNumber(e.target.value))
              }}
              className="w-full rounded-xl bg-muted px-3.5 py-2.5 text-sm font-semibold tracking-wider text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {cardNumber && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 rounded bg-card px-1.5 py-0.5 text-[10px] font-bold text-muted-foreground ring-1 ring-border">
                {detectBrand(cardNumber)}
              </span>
            )}
          </div>
        </div>

        {/* Cardholder Name */}
        <div>
          <label className="block text-xs font-bold text-foreground mb-1">
            Nombre del titular
          </label>
          <input
            type="text"
            placeholder="Como aparece en el plástico"
            value={holderName}
            onChange={(e) => {
              setError(null)
              setHolderName(e.target.value)
            }}
            className="w-full rounded-xl bg-muted px-3.5 py-2.5 text-sm font-semibold text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Expiry & CVV */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-foreground mb-1">
              Expiración
            </label>
            <input
              type="text"
              inputMode="numeric"
              placeholder="MM/AA"
              value={expiry}
              onChange={(e) => {
                setError(null)
                setExpiry(formatExpiry(e.target.value))
              }}
              className="w-full rounded-xl bg-muted px-3.5 py-2.5 text-sm font-semibold text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-foreground mb-1">
              CVV
            </label>
            <input
              type="password"
              inputMode="numeric"
              maxLength={4}
              placeholder="123"
              value={cvv}
              onChange={(e) => {
                setError(null)
                setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))
              }}
              className="w-full rounded-xl bg-muted px-3.5 py-2.5 text-sm font-semibold text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {/* Save Card Checkbox */}
        <label className="flex items-center gap-2 pt-1 cursor-pointer">
          <input
            type="checkbox"
            checked={savePermanently}
            onChange={(e) => setSavePermanently(e.target.checked)}
            className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
          />
          <span className="text-xs text-muted-foreground select-none">
            Guardar tarjeta para futuras compras en Siremás Express
          </span>
        </label>

        <div className="flex items-center gap-1.5 rounded-xl bg-muted/60 p-2.5 text-[11px] text-muted-foreground">
          <ShieldCheck className="h-4 w-4 shrink-0 text-sirena-green" />
          <span>Tus datos viajan encriptados de forma segura.</span>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-3.5 text-sm font-extrabold text-primary-foreground transition active:scale-[0.99]"
          >
            <Check className="h-4 w-4 text-secondary" />
            Usar esta tarjeta
          </button>
        </div>
      </form>
    </BottomSheet>
  )
}

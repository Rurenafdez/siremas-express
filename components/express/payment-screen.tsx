"use client"

import { useState } from "react"
import {
  ArrowLeft,
  CreditCard,
  Wallet,
  Plus,
  Check,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  Trash2,
  Star,
  ChevronDown,
  ChevronUp,
  Smartphone,
} from "lucide-react"
import { type CartLine, cartTotals, formatDOP } from "@/lib/express-data"
import { type User, type Card, type PaymentDetails } from "@/lib/db/schema"
import { processPayment } from "@/lib/payment-service"
import { AddCardModal } from "./add-card-modal"

type OtherSubMethod = "tpago" | "paypal" | null

export function PaymentScreen({
  cart,
  user,
  onAddCard,
  onRemoveCard,
  onSetDefaultCard,
  onPaid,
  onBack,
}: {
  cart: CartLine[]
  user?: User
  onAddCard?: (card: Omit<Card, "id">, save: boolean) => void
  onRemoveCard?: (cardId: string) => void
  onSetDefaultCard?: (cardId: string) => void
  onPaid: (paymentDetails: PaymentDetails) => void
  onBack: () => void
}) {
  const { total } = cartTotals(cart)
  const userPoints = user?.points ?? 2450
  const savedCards = user?.savedCards ?? [
    {
      id: "card_default",
      last4: "4821",
      brand: "Visa",
      holderName: "Camila Ramírez",
      expMonth: "08",
      expYear: "28",
    },
  ]
  const defaultCardId = user?.defaultCardId ?? savedCards[0]?.id
  const defaultCard = savedCards.find((c) => c.id === defaultCardId) ?? savedCards[0]

  // Pre-selected as "saved" (card) per requirement 13
  const [selected, setSelected] = useState<"saved" | "siremas_points" | "other">("saved")
  const [selectedCardId, setSelectedCardId] = useState<string>(defaultCard?.id ?? "")
  const [otherSubMethod, setOtherSubMethod] = useState<OtherSubMethod>(null)
  const [otherExpanded, setOtherExpanded] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [showAddCard, setShowAddCard] = useState(false)
  const [customCard, setCustomCard] = useState<Card | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const activeCard = customCard || savedCards.find((c) => c.id === selectedCardId) || defaultCard

  // Split calculations if user chooses points
  const pointsCoverAll = userPoints >= total
  const pointsUsed = pointsCoverAll ? total : userPoints
  const cardRemainder = pointsCoverAll ? 0 : total - userPoints

  async function handlePay() {
    if (selected === "other" && !otherSubMethod) {
      setErrorMessage("Elige un método de pago alternativo (tPago o PayPal).")
      return
    }
    setProcessing(true)
    setErrorMessage(null)
    try {
      const methodKey =
        selected === "other"
          ? (otherSubMethod as "tpago" | "paypal")
          : selected
      const result = await processPayment({
        selectedMethod: methodKey,
        total,
        userPoints,
        savedCard: activeCard,
        customCard: customCard || undefined,
      })

      if (result.success && result.paymentDetails) {
        onPaid(result.paymentDetails)
      } else {
        setErrorMessage(result.error || "No se pudo procesar el pago. Intenta de nuevo.")
        setProcessing(false)
      }
    } catch {
      setErrorMessage("Error de conexión al procesar el pago.")
      setProcessing(false)
    }
  }

  function handleCardAdded(newCardData: Omit<Card, "id">, save: boolean) {
    const newCard: Card = {
      ...newCardData,
      id: "temp_card_" + Date.now(),
    }
    setCustomCard(newCard)
    setSelectedCardId(newCard.id)
    setSelected("saved")
    if (save && onAddCard) {
      onAddCard(newCardData, true)
    }
  }

  function payButtonLabel() {
    if (processing) return "Procesando pago seguro…"
    if (selected === "other") {
      if (!otherSubMethod) return `Pagar ${formatDOP(total)}`
      return `Pagar con ${otherSubMethod === "tpago" ? "tPago" : "PayPal"} (${formatDOP(total)})`
    }
    if (selected === "siremas_points") {
      return pointsCoverAll
        ? `Pagar con ${pointsUsed} pts Siremás`
        : `Pagar (${pointsUsed} pts + RD$${cardRemainder})`
    }
    return `Pagar con ${activeCard?.brand} •••• ${activeCard?.last4} (${formatDOP(total)})`
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
          <h1 className="text-lg font-extrabold text-foreground">Método de Pago</h1>
        </header>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar px-5 py-4 space-y-4">
        {/* Total Header Card */}
        <div className="rounded-3xl bg-primary p-5 text-primary-foreground">
          <p className="text-xs text-primary-foreground/70">Total a pagar</p>
          <p className="mt-1 text-3xl font-extrabold tabular-nums">
            {formatDOP(total)}
          </p>
          {user && (
            <div className="mt-2 flex items-center gap-1 text-xs text-secondary font-semibold">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Tienes {userPoints.toLocaleString("es-DO")} Puntos Siremás disponibles</span>
            </div>
          )}
        </div>

        {errorMessage && (
          <div className="flex items-center gap-2 rounded-2xl bg-destructive/15 p-3 text-xs font-semibold text-destructive">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Methods Selection */}
        <div className="space-y-2.5">
          {/* Option 1: Saved Cards (Marked as RECOMMENDED per requirement 13) */}
          <div
            className={`w-full rounded-2xl bg-card p-3.5 ring-1 transition ${
              selected === "saved" ? "ring-2 ring-primary bg-primary/5" : "ring-border"
            }`}
          >
            {/* Default card row */}
            <div
              onClick={() => setSelected("saved")}
              className="flex items-center gap-3 w-full cursor-pointer"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-muted text-foreground">
                <CreditCard className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold text-foreground">
                    {customCard
                      ? `${customCard.brand} •••• ${customCard.last4}`
                      : `${activeCard?.brand} •••• ${activeCard?.last4}`}
                  </p>
                  <span className="rounded-full bg-sirena-yellow px-2 py-0.5 text-[10px] font-extrabold text-sirena-navy-deep">
                    Recomendado
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">Tarjeta de crédito guardada</p>
              </div>
              <span
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                  selected === "saved"
                    ? "bg-primary text-primary-foreground"
                    : "ring-1 ring-border"
                }`}
              >
                {selected === "saved" && <Check className="h-3.5 w-3.5" />}
              </span>
            </div>

            {/* Additional saved cards list */}
            {savedCards.length > 1 && (
              <div className="mt-3 space-y-2 border-t border-border/60 pt-2.5">
                {savedCards.map((card) => (
                  <div
                    key={card.id}
                    className={`flex items-center gap-2 rounded-xl px-2.5 py-1.5 cursor-pointer transition ${
                      selectedCardId === card.id && !customCard ? "bg-primary/10" : "hover:bg-muted/60"
                    }`}
                    onClick={() => { setSelectedCardId(card.id); setCustomCard(null); setSelected("saved") }}
                  >
                    <CreditCard className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className="flex-1 text-xs font-semibold text-foreground">
                      {card.brand} •••• {card.last4}
                    </span>
                    {card.id === defaultCardId && (
                      <span className="text-[10px] text-sirena-green font-bold">Default</span>
                    )}
                    <div className="flex items-center gap-1">
                      {card.id !== defaultCardId && onSetDefaultCard && (
                        <button
                          type="button"
                          title="Hacer predeterminada"
                          onClick={(e) => { e.stopPropagation(); onSetDefaultCard(card.id) }}
                          className="flex h-6 w-6 items-center justify-center rounded-full text-muted-foreground hover:text-secondary transition"
                        >
                          <Star className="h-3.5 w-3.5" />
                        </button>
                      )}
                      {savedCards.length > 1 && onRemoveCard && (
                        <button
                          type="button"
                          title="Eliminar tarjeta"
                          onClick={(e) => { e.stopPropagation(); onRemoveCard(card.id) }}
                          className="flex h-6 w-6 items-center justify-center rounded-full text-muted-foreground hover:text-destructive transition"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Add Card Button */}
            <div className="mt-3 flex items-center justify-between border-t border-border/60 pt-2.5">
              <button
                type="button"
                onClick={() => setShowAddCard(true)}
                className="flex items-center gap-1 text-xs font-bold text-primary hover:underline"
              >
                <Plus className="h-3.5 w-3.5" />
                Agregar otra tarjeta
              </button>
            </div>
          </div>

          {/* Option 2: Puntos Siremás */}
          <button
            type="button"
            onClick={() => setSelected("siremas_points")}
            className={`flex w-full flex-col gap-2 rounded-2xl bg-card p-3.5 text-left ring-1 transition ${
              selected === "siremas_points" ? "ring-2 ring-primary bg-primary/5" : "ring-border"
            }`}
          >
            <div className="flex items-center gap-3 w-full">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sirena-yellow-soft text-secondary-foreground">
                <Sparkles className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-foreground">Puntos Siremás</p>
                <p className="text-xs text-muted-foreground">
                  {pointsCoverAll
                    ? `${userPoints.toLocaleString("es-DO")} pts disponibles · Cubre el total`
                    : `${userPoints.toLocaleString("es-DO")} pts disponibles · Pago combinado`}
                </p>
              </div>
              <span
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                  selected === "siremas_points"
                    ? "bg-primary text-primary-foreground"
                    : "ring-1 ring-border"
                }`}
              >
                {selected === "siremas_points" && <Check className="h-3.5 w-3.5" />}
              </span>
            </div>

            {/* Split breakdown box when points are selected */}
            {selected === "siremas_points" && (
              <div className="mt-1 w-full rounded-xl bg-muted/70 p-2.5 text-xs text-muted-foreground space-y-1">
                {pointsCoverAll ? (
                  <p className="text-foreground font-medium">
                    ✓ Se canjearán <span className="font-bold text-sirena-green">{pointsUsed} puntos (RD${pointsUsed})</span>. Quedarán {userPoints - pointsUsed} pts.
                  </p>
                ) : (
                  <div className="space-y-0.5 text-[11px]">
                    <p className="text-foreground font-semibold">Desglose combinado:</p>
                    <p>• {pointsUsed} Puntos Siremás: <span className="font-bold text-sirena-green">-RD${pointsUsed}</span></p>
                    <p>• Restante a {activeCard?.brand} •••• {activeCard?.last4}: <span className="font-bold text-foreground">RD${cardRemainder}</span></p>
                  </div>
                )}
              </div>
            )}
          </button>

          {/* Option 3: Other Methods — tPago / PayPal (Point 21: now functional) */}
          <div
            className={`rounded-2xl bg-card ring-1 transition overflow-hidden ${
              selected === "other" ? "ring-2 ring-primary bg-primary/5" : "ring-border"
            }`}
          >
            <button
              type="button"
              onClick={() => {
                setSelected("other")
                setOtherExpanded(true)
              }}
              className="flex w-full items-center gap-3 p-3.5 text-left"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-muted text-foreground">
                <Wallet className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-foreground">Otros métodos</p>
                <p className="text-xs text-muted-foreground">
                  {otherSubMethod === "tpago" ? "tPago seleccionado" : otherSubMethod === "paypal" ? "PayPal seleccionado" : "tPago, PayPal, Enlace Express"}
                </p>
              </div>
              <div className="flex items-center gap-1.5">
                <span
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                    selected === "other"
                      ? "bg-primary text-primary-foreground"
                      : "ring-1 ring-border"
                  }`}
                >
                  {selected === "other" && <Check className="h-3.5 w-3.5" />}
                </span>
                {selected === "other" ? (
                  otherExpanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />
                ) : null}
              </div>
            </button>

            {/* Sub-methods panel — expands when "other" is selected */}
            {selected === "other" && otherExpanded && (
              <div className="border-t border-border/60 px-4 pb-4 pt-3 space-y-2">
                <p className="text-xs font-bold text-foreground mb-2">Elige tu método:</p>

                {/* tPago */}
                <button
                  type="button"
                  onClick={() => setOtherSubMethod("tpago")}
                  className={`flex w-full items-center gap-3 rounded-xl p-3 text-left transition ring-1 ${
                    otherSubMethod === "tpago" ? "ring-primary bg-primary/10" : "ring-border hover:bg-muted/60"
                  }`}
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-700 font-extrabold text-xs">
                    tP
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-foreground">tPago</p>
                    <p className="text-xs text-muted-foreground">Pago móvil dominicano</p>
                  </div>
                  <span className={`flex h-4 w-4 items-center justify-center rounded-full ${
                    otherSubMethod === "tpago" ? "bg-primary text-primary-foreground" : "ring-1 ring-border"
                  }`}>
                    {otherSubMethod === "tpago" && <Check className="h-3 w-3" />}
                  </span>
                </button>

                {/* PayPal */}
                <button
                  type="button"
                  onClick={() => setOtherSubMethod("paypal")}
                  className={`flex w-full items-center gap-3 rounded-xl p-3 text-left transition ring-1 ${
                    otherSubMethod === "paypal" ? "ring-primary bg-primary/10" : "ring-border hover:bg-muted/60"
                  }`}
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700 font-extrabold text-xs">
                    PP
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-foreground">PayPal</p>
                    <p className="text-xs text-muted-foreground">Pago internacional</p>
                  </div>
                  <span className={`flex h-4 w-4 items-center justify-center rounded-full ${
                    otherSubMethod === "paypal" ? "bg-primary text-primary-foreground" : "ring-1 ring-border"
                  }`}>
                    {otherSubMethod === "paypal" && <Check className="h-3 w-3" />}
                  </span>
                </button>

                <p className="text-[10px] text-muted-foreground pt-1">
                  <Smartphone className="inline h-3 w-3 mr-0.5" />
                  Punto de integración listo para conectar SDK real de tPago/PayPal.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Security badge */}
        <div className="flex items-center justify-center gap-1.5 py-1 text-[11px] text-muted-foreground">
          <ShieldCheck className="h-3.5 w-3.5 text-sirena-green" />
          Transacción encriptada y segura
        </div>
      </div>

      {/* Action Pay Button */}
      <div className="border-t border-border bg-card px-5 pb-7 pt-3">
        <button
          type="button"
          onClick={handlePay}
          disabled={processing}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-4 text-base font-extrabold text-primary-foreground active:scale-[0.99] disabled:opacity-70 transition shadow-md"
        >
          {payButtonLabel()}
        </button>
      </div>

      {showAddCard && (
        <AddCardModal
          onAddCard={handleCardAdded}
          onClose={() => setShowAddCard(false)}
        />
      )}
    </div>
  )
}

"use client"

import { useState } from "react"
import {
  type CartLine,
  type Product,
  CATALOG,
  UNAVAILABLE,
  SUBSTITUTE,
  PROMO,
  DEMO_SCAN_STEPS,
} from "@/lib/express-data"
import { HomeScreen } from "@/components/express/home-screen"
import { IntroScreen } from "@/components/express/intro-screen"
import { ScannerScreen } from "@/components/express/scanner-screen"
import { CartScreen } from "@/components/express/cart-screen"
import { VerifyScreen } from "@/components/express/verify-screen"
import { QrScreen } from "@/components/express/qr-screen"
import { StationScreen } from "@/components/express/station-screen"
import { PaymentScreen } from "@/components/express/payment-screen"
import { SuccessScreen } from "@/components/express/success-screen"
import { UnavailableSheet } from "@/components/express/unavailable-sheet"
import { PromoSheet } from "@/components/express/promo-sheet"
import { ReceiptSheet } from "@/components/express/receipt-sheet"

type Screen =
  | "home"
  | "intro"
  | "scan"
  | "cart"
  | "qr"
  | "ai-verify"
  | "payment"
  | "success"

const USER_NAME = "Camila Ramírez"

export function SiremasApp() {
  const [screen, setScreen] = useState<Screen>("home")
  const [cart, setCart] = useState<CartLine[]>([])
  const [scanIndex, setScanIndex] = useState(0)
  const [lastScanned, setLastScanned] = useState<{ name: string; key: number } | null>(null)
  const [unavailableOpen, setUnavailableOpen] = useState(false)
  const [promoOpen, setPromoOpen] = useState(false)
  const [receiptOpen, setReceiptOpen] = useState(false)
  const [orderId, setOrderId] = useState("LS-482103")

  const scanDone = scanIndex >= DEMO_SCAN_STEPS.length
  const nextStep = !scanDone ? DEMO_SCAN_STEPS[scanIndex] : null
  const scanHint = nextStep ? `Siguiente: ${nextStep.product.name}` : "Todo escaneado"

  function addToCart(product: Product, qty = 1) {
    setCart((prev) => {
      const existing = prev.find((l) => l.id === product.id)
      if (existing) {
        return prev.map((l) =>
          l.id === product.id ? { ...l, qty: l.qty + qty } : l,
        )
      }
      return [...prev, { ...product, qty }]
    })
  }

  function handleScan() {
    if (scanDone) return
    const step = DEMO_SCAN_STEPS[scanIndex]
    setScanIndex((i) => i + 1)

    if (step.type === "product") {
      addToCart(step.product)
      setLastScanned({ name: step.product.name, key: Date.now() })
    } else if (step.type === "unavailable") {
      // Automatically detect unavailable product (Frito Lay Original)
      setUnavailableOpen(true)
    }
  }

  function handleAddSubstitute() {
    addToCart(SUBSTITUTE, 1)
    setLastScanned({ name: SUBSTITUTE.name, key: Date.now() })
    setUnavailableOpen(false)
    // Trigger smart promo sheet right after substitute event
    setTimeout(() => {
      setPromoOpen(true)
    }, 350)
  }

  function handleCloseUnavailable() {
    setUnavailableOpen(false)
    setTimeout(() => {
      setPromoOpen(true)
    }, 350)
  }

  function handleAddPromo() {
    addToCart(PROMO, 1)
    setLastScanned({ name: PROMO.name, key: Date.now() })
    setPromoOpen(false)
  }

  function handleInc(id: string) {
    setCart((prev) =>
      prev.map((l) => (l.id === id ? { ...l, qty: l.qty + 1 } : l)),
    )
  }

  function handleDec(id: string) {
    setCart((prev) =>
      prev
        .map((l) => (l.id === id ? { ...l, qty: l.qty - 1 } : l))
        .filter((l) => l.qty > 0),
    )
  }

  function handleRemove(id: string) {
    setCart((prev) => prev.filter((l) => l.id !== id))
  }

  function handleStart() {
    setScreen("intro")
  }

  function handleGoToQr() {
    setOrderId("LS-" + Math.floor(100000 + Math.random() * 900000))
    setScreen("qr")
  }

  function handleReset() {
    setCart([])
    setScanIndex(0)
    setLastScanned(null)
    setUnavailableOpen(false)
    setPromoOpen(false)
    setReceiptOpen(false)
    setScreen("home")
  }

  return (
    <div className="relative h-full w-full overflow-hidden bg-background">
      {screen === "home" && (
        <HomeScreen
          userName={USER_NAME}
          cart={cart}
          onStart={handleStart}
          onViewCart={() => setScreen("cart")}
        />
      )}

      {screen === "intro" && (
        <IntroScreen
          onStart={() => setScreen("scan")}
          onBack={() => setScreen("home")}
        />
      )}

      {screen === "scan" && (
        <ScannerScreen
          cart={cart}
          lastScanned={lastScanned}
          scanHint={scanHint}
          scanDone={scanDone}
          onScan={handleScan}
          onInc={handleInc}
          onDec={handleDec}
          onRemove={handleRemove}
          onViewCart={() => setScreen("cart")}
          onBack={() => setScreen("intro")}
        />
      )}

      {screen === "cart" && (
        <CartScreen
          cart={cart}
          onInc={handleInc}
          onDec={handleDec}
          onRemove={handleRemove}
          onVerify={handleGoToQr}
          onBack={() => setScreen("scan")}
        />
      )}

      {screen === "qr" && (
        <QrScreen
          cart={cart}
          orderId={orderId}
          onArrive={() => setScreen("ai-verify")}
          onBack={() => setScreen("cart")}
        />
      )}

      {screen === "ai-verify" && (
        <VerifyScreen
          cart={cart}
          onVerified={() => setScreen("payment")}
          onBack={() => setScreen("qr")}
        />
      )}

      {screen === "payment" && (
        <PaymentScreen
          cart={cart}
          onPaid={() => setScreen("success")}
          onBack={() => setScreen("ai-verify")}
        />
      )}

      {screen === "success" && (
        <SuccessScreen
          cart={cart}
          onReceipt={() => setReceiptOpen(true)}
          onFinish={handleReset}
        />
      )}

      {/* Sheets and Modals */}
      {unavailableOpen && (
        <UnavailableSheet
          unavailable={UNAVAILABLE}
          substitute={SUBSTITUTE}
          onAdd={handleAddSubstitute}
          onClose={handleCloseUnavailable}
        />
      )}

      {promoOpen && (
        <PromoSheet
          promo={PROMO}
          onAdd={handleAddPromo}
          onClose={() => setPromoOpen(false)}
        />
      )}

      {receiptOpen && (
        <ReceiptSheet
          cart={cart}
          orderId={orderId}
          userName={USER_NAME}
          onClose={() => setReceiptOpen(false)}
        />
      )}
    </div>
  )
}


"use client"

import { useEffect, useState } from "react"
import {
  type CartLine,
  type Product,
  cartTotals,
  CATALOG,
  UNAVAILABLE,
  SUBSTITUTE,
  PROMO,
  DEMO_SCAN_STEPS,
} from "@/lib/express-data"
import {
  type User,
  type Order,
  type Card,
  type PaymentDetails,
} from "@/lib/db/schema"
import {
  getUser,
  acceptTermsAndVerifyCedula,
  addCard as addCardToDb,
  createOrder,
  getOrders,
  resetDemoUser,
} from "@/lib/db/repository"
import { HomeScreen } from "@/components/express/home-screen"
import { IntroScreen } from "@/components/express/intro-screen"
import { ScannerScreen } from "@/components/express/scanner-screen"
import { CartScreen } from "@/components/express/cart-screen"
import { VerifyScreen } from "@/components/express/verify-screen"
import { QrScreen } from "@/components/express/qr-screen"
import { PaymentScreen } from "@/components/express/payment-screen"
import { SuccessScreen } from "@/components/express/success-screen"
import { HistoryScreen } from "@/components/express/history-screen"
import { OnboardingScreen } from "@/components/express/onboarding-screen"
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
  | "history"

export function SiremasApp() {
  const [user, setUser] = useState<User | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [screen, setScreen] = useState<Screen>("home")
  const [cart, setCart] = useState<CartLine[]>([])
  const [scanIndex, setScanIndex] = useState(0)
  const [lastScanned, setLastScanned] = useState<{ name: string; key: number } | null>(null)
  const [unavailableOpen, setUnavailableOpen] = useState(false)
  const [promoOpen, setPromoOpen] = useState(false)
  const [receiptOpen, setReceiptOpen] = useState(false)
  const [orderId, setOrderId] = useState("LS-482103")
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | undefined>(undefined)

  useEffect(() => {
    // Load persisted user & orders on mount
    const loadedUser = getUser()
    setUser(loadedUser)
    setOrders(getOrders())
  }, [])

  const scanDone = scanIndex >= DEMO_SCAN_STEPS.length
  const nextStep = !scanDone ? DEMO_SCAN_STEPS[scanIndex] : null
  const scanHint = nextStep ? `Siguiente: ${nextStep.product.name}` : "Todo escaneado"

  function handleAcceptOnboarding(cedula: string, name: string) {
    const updated = acceptTermsAndVerifyCedula(cedula, name)
    setUser(updated)
    setScreen("home")
  }

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

  function handlePaid(details: PaymentDetails) {
    setPaymentDetails(details)
    const { subtotal, discounts, savingsEnRebaja, total } = cartTotals(cart)

    // Save order to persistent repository
    const newOrder = createOrder({
      orderId,
      items: cart,
      subtotal,
      discounts,
      savingsEnRebaja,
      total,
      paymentDetails: details,
      timeSavedMin: 12,
      userName: user?.name || "Camila Ramírez",
    })

    // Update local orders list & user state
    setOrders((prev) => [newOrder, ...prev])
    setUser(getUser())

    setScreen("success")
  }

  function handleAddCard(cardData: Omit<Card, "id">) {
    addCardToDb(cardData)
    setUser(getUser())
  }

  function handleReset() {
    setCart([])
    setScanIndex(0)
    setLastScanned(null)
    setUnavailableOpen(false)
    setPromoOpen(false)
    setReceiptOpen(false)
    setPaymentDetails(undefined)
    setScreen("home")
  }

  function handleResetDemo() {
    const unonboarded = resetDemoUser()
    setUser(unonboarded)
    setOrders([])
    handleReset()
  }

  // If user hasn't accepted terms or verified cédula, show Onboarding
  if (user && (!user.hasAcceptedTerms || !user.cedulaVerified)) {
    return (
      <div className="relative h-full w-full overflow-hidden bg-background">
        <OnboardingScreen onAccept={handleAcceptOnboarding} />
      </div>
    )
  }

  return (
    <div className="relative h-full w-full overflow-hidden bg-background">
      {screen === "home" && (
        <HomeScreen
          userName={user?.name || "Camila Ramírez"}
          points={user?.points ?? 2450}
          cart={cart}
          onStart={handleStart}
          onViewCart={() => setScreen("cart")}
          onViewHistory={() => {
            setOrders(getOrders())
            setScreen("history")
          }}
          onResetDemo={handleResetDemo}
        />
      )}

      {screen === "history" && (
        <HistoryScreen
          orders={orders}
          onBack={() => setScreen("home")}
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
          onAddToCart={addToCart}
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
          onAddToCart={addToCart}
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
          onAddToCart={addToCart}
          onVerified={() => setScreen("payment")}
          onBack={() => setScreen("qr")}
        />
      )}

      {screen === "payment" && (
        <PaymentScreen
          cart={cart}
          user={user || undefined}
          onAddCard={handleAddCard}
          onPaid={handlePaid}
          onBack={() => setScreen("ai-verify")}
        />
      )}

      {screen === "success" && (
        <SuccessScreen
          cart={cart}
          paymentDetails={paymentDetails}
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
          paymentDetails={paymentDetails}
          userName={user?.name || "Camila Ramírez"}
          onClose={() => setReceiptOpen(false)}
        />
      )}
    </div>
  )
}

"use client"

import { useEffect, useState } from "react"
import {
  type CartLine,
  type Product,
  cartTotals,
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
  type FulfillmentType,
} from "@/lib/db/schema"
import {
  getUser,
  acceptTermsAndVerifyCedula,
  addCard as addCardToDb,
  removeCard as removeCardFromDb,
  setDefaultCard as setDefaultCardInDb,
  createOrder,
  getOrders,
  resetDemoUser,
} from "@/lib/db/repository"
import { HomeScreen } from "@/components/express/home-screen"
import { IntroScreen } from "@/components/express/intro-screen"
import { ScannerScreen } from "@/components/express/scanner-screen"
import { CartScreen } from "@/components/express/cart-screen"
import { SirenaGoDeliveryScreen } from "@/components/express/sirenago-delivery-screen"
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
  | "sirenago-delivery"
  | "qr"
  | "ai-verify"
  | "payment"
  | "success"
  | "history"

export function SiremasApp() {
  const [user, setUser] = useState<User | null>(null)
  const [orders, setOrders] = useState<Order[]>([])

  // Point 23: Replace single screen state with a navigation stack.
  // The current screen is always the top of the stack.
  const [screenStack, setScreenStack] = useState<Screen[]>(["home"])
  const screen = screenStack[screenStack.length - 1]

  const [cart, setCart] = useState<CartLine[]>([])
  const [scanIndex, setScanIndex] = useState(0)
  const [lastScanned, setLastScanned] = useState<{ name: string; key: number } | null>(null)
  const [unavailableOpen, setUnavailableOpen] = useState(false)
  const [promoOpen, setPromoOpen] = useState(false)
  const [receiptOpen, setReceiptOpen] = useState(false)
  const [orderId, setOrderId] = useState("LS-482103")
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | undefined>(undefined)
  const [verificationPhotos, setVerificationPhotos] = useState<string[]>([])
  // Point 18: SirenaGo fulfillment state
  const [fulfillment, setFulfillment] = useState<FulfillmentType | undefined>(undefined)
  const [deliveryAddress, setDeliveryAddress] = useState<string | undefined>(undefined)

  useEffect(() => {
    const loadedUser = getUser()
    setUser(loadedUser)
    setOrders(getOrders())
  }, [])

  // ── Navigation helpers (Point 23) ───────────────────────────────────────
  /** Push a new screen onto the stack (navigate forward). */
  function goTo(nextScreen: Screen) {
    setScreenStack((prev) => [...prev, nextScreen])
  }

  /**
   * Pop the top screen off the stack (navigate back).
   * If already at root ("home"), this is a no-op.
   */
  function goBack() {
    setScreenStack((prev) => (prev.length > 1 ? prev.slice(0, -1) : prev))
  }

  // ── Demo scan logic ─────────────────────────────────────────────────────
  const scanDone = scanIndex >= DEMO_SCAN_STEPS.length
  const nextStep = !scanDone ? DEMO_SCAN_STEPS[scanIndex] : null
  const scanHint = nextStep ? `Siguiente: ${nextStep.product.name}` : "Todo escaneado"

  function handleAcceptOnboarding(cedula: string, name: string) {
    const updated = acceptTermsAndVerifyCedula(cedula, name)
    setUser(updated)
    // Replace the stack with home (onboarding is not in the nav stack)
    setScreenStack(["home"])
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
      setUnavailableOpen(true)
    }
  }

  function handleAddSubstitute() {
    addToCart(SUBSTITUTE, 1)
    setLastScanned({ name: SUBSTITUTE.name, key: Date.now() })
    setUnavailableOpen(false)
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

  // Point 17: two checkout routes from Cart
  function handleGoToQr() {
    // Generate a fresh order ID every time user enters QR flow
    setOrderId("LS-" + Math.floor(100000 + Math.random() * 900000))
    goTo("qr")
  }

  // Point 17: SirenaGo → Point 18: delivery selection before payment
  function handleSirenaGo() {
    setOrderId("LS-" + Math.floor(100000 + Math.random() * 900000))
    goTo("sirenago-delivery")
  }

  // Point 18: after fulfillment choice, go to payment
  function handleFulfillmentConfirm(choice: FulfillmentType, address?: string) {
    setFulfillment(choice)
    setDeliveryAddress(address)
    goTo("payment")
  }

  function handlePaid(details: PaymentDetails) {
    setPaymentDetails(details)
    const { subtotal, discounts, savingsEnRebaja, total } = cartTotals(cart)

    const newOrder = createOrder({
      orderId,
      items: cart,
      subtotal,
      discounts,
      savingsEnRebaja,
      total,
      paymentDetails: details,
      verificationPhotos: verificationPhotos.length > 0 ? verificationPhotos : ["/products/jugo-wala.png"],
      timeSavedMin: 12,
      userName: user?.name || "Camila Ramírez",
      fulfillment,
      deliveryAddress,
    })

    setOrders((prev) => [newOrder, ...prev])
    setUser(getUser())

    // Navigate to success — do NOT add more screens after success
    // (user cannot go back to payment from success)
    setScreenStack(["home", "success"])
  }

  // Point 20: card management
  function handleAddCard(cardData: Omit<Card, "id">) {
    addCardToDb(cardData)
    setUser(getUser())
  }

  function handleRemoveCard(cardId: string) {
    removeCardFromDb(cardId)
    setUser(getUser())
  }

  function handleSetDefaultCard(cardId: string) {
    setDefaultCardInDb(cardId)
    setUser(getUser())
  }

  /** Reset all transient state and return to home. */
  function handleReset() {
    setCart([])
    setScanIndex(0)
    setLastScanned(null)
    setUnavailableOpen(false)
    setPromoOpen(false)
    setReceiptOpen(false)
    setPaymentDetails(undefined)
    setVerificationPhotos([])
    setFulfillment(undefined)
    setDeliveryAddress(undefined)
    // Clear the stack — back to home root
    setScreenStack(["home"])
  }

  function handleResetDemo() {
    const unonboarded = resetDemoUser()
    setUser(unonboarded)
    setOrders([])
    handleReset()
  }

  // Point 15: Repeat purchase — preload items into cart and go to Cart screen
  function handleRepeatOrder(pastItems: CartLine[]) {
    setCart(pastItems.map((item) => ({ ...item })))
    // Push cart on top of wherever we are (history)
    goTo("cart")
  }

  // ── Onboarding gate ─────────────────────────────────────────────────────
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
          onStart={() => goTo("intro")}
          onViewCart={() => goTo("cart")}
          onViewHistory={() => {
            setOrders(getOrders())
            goTo("history")
          }}
          onResetDemo={handleResetDemo}
        />
      )}

      {screen === "history" && (
        <HistoryScreen
          orders={orders}
          onRepeatOrder={handleRepeatOrder}
          onBack={goBack}
        />
      )}

      {screen === "intro" && (
        <IntroScreen
          onStart={() => goTo("scan")}
          onBack={goBack}
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
          onViewCart={() => goTo("cart")}
          onBack={goBack}
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
          onSirenaGo={handleSirenaGo}
          onBack={goBack}
        />
      )}

      {/* Point 18: SirenaGo delivery/pickup selection */}
      {screen === "sirenago-delivery" && (
        <SirenaGoDeliveryScreen
          onConfirm={handleFulfillmentConfirm}
          onBack={goBack}
        />
      )}

      {screen === "qr" && (
        <QrScreen
          cart={cart}
          orderId={orderId}
          onArrive={() => goTo("ai-verify")}
          onBack={goBack}
        />
      )}

      {screen === "ai-verify" && (
        <VerifyScreen
          cart={cart}
          onAddToCart={addToCart}
          onVerified={(capturedPhotos) => {
            setVerificationPhotos(capturedPhotos)
            goTo("payment")
          }}
          onBack={goBack}
        />
      )}

      {screen === "payment" && (
        <PaymentScreen
          cart={cart}
          user={user || undefined}
          onAddCard={handleAddCard}
          onRemoveCard={handleRemoveCard}
          onSetDefaultCard={handleSetDefaultCard}
          onPaid={handlePaid}
          onBack={goBack}
        />
      )}

      {/* Point 23: Success cannot go back — stack is reset to ["home", "success"] by handlePaid */}
      {screen === "success" && (
        <SuccessScreen
          cart={cart}
          paymentDetails={paymentDetails}
          fulfillment={fulfillment}
          deliveryAddress={deliveryAddress}
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
          verificationPhotos={verificationPhotos}
          userName={user?.name || "Camila Ramírez"}
          fulfillment={fulfillment}
          deliveryAddress={deliveryAddress}
          onClose={() => setReceiptOpen(false)}
        />
      )}
    </div>
  )
}

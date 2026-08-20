import { User, Order, Card, PaymentDetails, FulfillmentType } from "./schema"
import {
  loadUserFromStorage,
  saveUserToStorage,
  loadOrdersFromStorage,
  saveOrdersToStorage,
  resetDemoStorage,
  SEED_USER,
} from "./storage"
import { type CartLine } from "@/lib/express-data"

export function getUser(): User {
  return loadUserFromStorage()
}

export function updateUser(updates: Partial<User>): User {
  const current = loadUserFromStorage()
  const updated = { ...current, ...updates }
  saveUserToStorage(updated)
  return updated
}

export function acceptTermsAndVerifyCedula(cedula: string, name?: string): User {
  return updateUser({
    cedula,
    cedulaVerified: true,
    hasAcceptedTerms: true,
    ...(name ? { name } : {}),
  })
}

export function addCard(cardData: Omit<Card, "id">): Card {
  const user = loadUserFromStorage()
  const newCard: Card = {
    ...cardData,
    id: "card_" + Math.random().toString(36).substring(2, 9),
  }
  const updatedCards = [...user.savedCards, newCard]
  updateUser({ savedCards: updatedCards, defaultCardId: newCard.id })
  return newCard
}

export function removeCard(cardId: string): User {
  const user = loadUserFromStorage()
  const updatedCards = user.savedCards.filter((c) => c.id !== cardId)
  // If removed card was default, set first remaining as default
  const newDefault =
    user.defaultCardId === cardId
      ? updatedCards[0]?.id
      : user.defaultCardId
  return updateUser({ savedCards: updatedCards, defaultCardId: newDefault })
}

export function setDefaultCard(cardId: string): User {
  return updateUser({ defaultCardId: cardId })
}

export function deductPoints(pointsToDeduct: number): User {
  const user = loadUserFromStorage()
  const updatedPoints = Math.max(0, user.points - pointsToDeduct)
  return updateUser({ points: updatedPoints })
}

export function addPoints(pointsToAdd: number): User {
  const user = loadUserFromStorage()
  const updatedPoints = user.points + pointsToAdd
  return updateUser({ points: updatedPoints })
}

export function getOrders(): Order[] {
  return loadOrdersFromStorage()
}

export function createOrder({
  orderId,
  items,
  subtotal,
  discounts,
  savingsEnRebaja,
  total,
  paymentDetails,
  verificationPhotos = [],
  timeSavedMin = 12,
  userName = "Camila Ramírez",
  fulfillment,
  deliveryAddress,
  pointsEarned = 0,
}: {
  orderId: string
  items: CartLine[]
  subtotal: number
  discounts: number
  savingsEnRebaja: number
  total: number
  paymentDetails: PaymentDetails
  verificationPhotos?: string[]
  timeSavedMin?: number
  userName?: string
  fulfillment?: FulfillmentType
  deliveryAddress?: string
  pointsEarned?: number
}): Order {
  const orders = loadOrdersFromStorage()
  const now = new Date()
  const dateStr = now.toLocaleDateString("es-DO", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }) + " · " + now.toLocaleTimeString("es-DO", { hour: "2-digit", minute: "2-digit" })

  const newOrder: Order = {
    id: orderId,
    date: dateStr,
    items,
    subtotal,
    discounts,
    savingsEnRebaja,
    total,
    paymentDetails,
    verificationPhotos,
    timeSavedMin,
    userName,
    fulfillment,
    deliveryAddress,
    pointsEarned,
  }

  // Prepend new order to list
  const updatedOrders = [newOrder, ...orders]
  saveOrdersToStorage(updatedOrders)

  // If points were used, deduct from user
  if (paymentDetails.pointsUsed && paymentDetails.pointsUsed > 0) {
    deductPoints(paymentDetails.pointsUsed)
  }

  // Point 24: If points were earned with this purchase, add to user balance
  if (pointsEarned && pointsEarned > 0) {
    addPoints(pointsEarned)
  }

  return newOrder
}

export function resetDemoUser(): User {
  resetDemoStorage()
  const unonboardedUser: User = {
    ...SEED_USER,
    hasAcceptedTerms: false,
    cedulaVerified: false,
    cedula: "",
  }
  saveUserToStorage(unonboardedUser)
  return unonboardedUser
}

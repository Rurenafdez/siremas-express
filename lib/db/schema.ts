import { type CartLine } from "@/lib/express-data"

export type Card = {
  id: string
  last4: string
  brand: string // "Visa" | "Mastercard" | "Amex"
  holderName: string
  expMonth: string
  expYear: string
}

export type User = {
  id: string
  name: string
  cedula: string
  cedulaVerified: boolean
  hasAcceptedTerms: boolean
  points: number
  savedCards: Card[]
  defaultCardId?: string
}

export type PaymentMethodType = "points" | "card" | "split" | "other" | "tpago" | "paypal"

export type PaymentDetails = {
  type: PaymentMethodType
  description: string
  pointsUsed?: number
  pointsAmount?: number
  cardUsed?: {
    last4: string
    brand: string
    amount: number
  }
  total: number
}

export type FulfillmentType = "pickup" | "delivery"

export type Order = {
  id: string
  date: string
  items: CartLine[]
  subtotal: number
  discounts: number
  savingsEnRebaja: number
  total: number
  paymentDetails: PaymentDetails
  verificationPhotos?: string[]
  timeSavedMin: number
  userName: string
  /** SirenaGo fulfillment: pickup in store or home delivery */
  fulfillment?: FulfillmentType
  /** Delivery address when fulfillment === "delivery" */
  deliveryAddress?: string
}

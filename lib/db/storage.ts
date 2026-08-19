import { User, Order, Card } from "./schema"

const USER_KEY = "siremas_express_user"
const ORDERS_KEY = "siremas_express_orders"

export const DEFAULT_CARDS: Card[] = [
  {
    id: "card_visa_4821",
    last4: "4821",
    brand: "Visa",
    holderName: "Camila Ramírez",
    expMonth: "08",
    expYear: "28",
  },
]

export const SEED_USER: User = {
  id: "user_camila_01",
  name: "Camila Ramírez",
  cedula: "001-1849204-8",
  cedulaVerified: true,
  hasAcceptedTerms: true,
  points: 2450,
  savedCards: DEFAULT_CARDS,
  defaultCardId: "card_visa_4821",
}

export const SEED_ORDERS: Order[] = [
  {
    id: "LS-819203",
    date: "14 de Agosto, 2026 · 5:20 PM",
    items: [
      {
        id: "jugo-wala",
        name: "Jugo Wala Naranja",
        detail: "Botella 500 ml",
        image: "/products/jugo-wala.png",
        price: 75,
        aisle: "Pasillo 1 — Bebidas y Jugos",
        isStoreBrand: true,
        brand: "Wala",
        qty: 1,
      },
      {
        id: "galletas-wala",
        name: "Galletas Wala",
        detail: "Paquete 200 g",
        image: "/products/galletas.png",
        price: 85,
        aisle: "Pasillo 2 — Galletas y Snacks",
        isStoreBrand: true,
        brand: "Wala",
        qty: 1,
      },
      {
        id: "agua",
        name: "Agua Purificada",
        detail: "Botella 1 L",
        image: "/products/agua.png",
        price: 40,
        aisle: "Pasillo 1 — Bebidas y Jugos",
        qty: 1,
      },
    ],
    subtotal: 200,
    discounts: 0,
    savingsEnRebaja: 0,
    total: 200,
    paymentDetails: {
      type: "card",
      description: "Visa •••• 4821",
      cardUsed: {
        last4: "4821",
        brand: "Visa",
        amount: 200,
      },
      total: 200,
    },
    timeSavedMin: 14,
    userName: "Camila Ramírez",
  },
  {
    id: "LS-730192",
    date: "18 de Agosto, 2026 · 11:45 AM",
    items: [
      {
        id: "jamon-cibao",
        name: "Jamón Cibao",
        detail: "Paquete 250 g · próximo a vencer",
        image: "/products/jamon.png",
        price: 90,
        originalPrice: 150,
        savingReason: "En rebaja",
        promoType: "rebaja",
        aisle: "Pasillo 7 — Lácteos y Embutidos",
        qty: 1,
      },
      {
        id: "chocolate",
        name: "Chocolate Dominicano",
        detail: "Barra 90 g",
        image: "/products/chocolate.png",
        price: 95,
        aisle: "Pasillo 5 — Dulces y Chocolates",
        qty: 1,
      },
    ],
    subtotal: 245,
    discounts: 60,
    savingsEnRebaja: 60,
    total: 185,
    paymentDetails: {
      type: "points",
      description: "185 pts Siremás",
      pointsUsed: 185,
      pointsAmount: 185,
      total: 185,
    },
    timeSavedMin: 11,
    userName: "Camila Ramírez",
  },
]

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined"
}

export function loadUserFromStorage(): User {
  if (!isBrowser()) return SEED_USER
  try {
    const raw = localStorage.getItem(USER_KEY)
    if (!raw) {
      localStorage.setItem(USER_KEY, JSON.stringify(SEED_USER))
      return SEED_USER
    }
    return JSON.parse(raw) as User
  } catch {
    return SEED_USER
  }
}

export function saveUserToStorage(user: User): void {
  if (!isBrowser()) return
  try {
    localStorage.setItem(USER_KEY, JSON.stringify(user))
  } catch (e) {
    console.error("Error saving user:", e)
  }
}

export function loadOrdersFromStorage(): Order[] {
  if (!isBrowser()) return SEED_ORDERS
  try {
    const raw = localStorage.getItem(ORDERS_KEY)
    if (!raw) {
      localStorage.setItem(ORDERS_KEY, JSON.stringify(SEED_ORDERS))
      return SEED_ORDERS
    }
    return JSON.parse(raw) as Order[]
  } catch {
    return SEED_ORDERS
  }
}

export function saveOrdersToStorage(orders: Order[]): void {
  if (!isBrowser()) return
  try {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders))
  } catch (e) {
    console.error("Error saving orders:", e)
  }
}

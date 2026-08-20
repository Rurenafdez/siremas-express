export type PromoType = "rebaja" | "2x1" | "puntos" | "none"

export type Product = {
  id: string
  name: string
  detail: string
  image: string
  /** Price the customer actually pays (DOP) */
  price: number
  /** Original / regular price, when the line carries a saving */
  originalPrice?: number
  /** Short reason shown next to a discounted line */
  savingReason?: string
  /** Physical aisle location in La Sirena store */
  aisle: string
  /** Whether the product is a store brand (marca propia / blanca La Sirena) */
  isStoreBrand?: boolean
  /** Brand name (e.g. "Wala", "First Class", "Frito Lay") */
  brand?: string
  /** Category / promo type */
  promoType?: PromoType
}

export type CartLine = Product & { qty: number }

/** Products Michael scans, in demo order. */
export const CATALOG: Product[] = [
  {
    id: "jugo-wala",
    name: "Jugo Wala Naranja",
    detail: "Botella 500 ml",
    image: "/products/jugo-wala.png",
    price: 75,
    aisle: "Pasillo 1 — Bebidas y Jugos",
    isStoreBrand: true,
    brand: "Wala",
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
  },
  {
    id: "agua",
    name: "Agua Purificada",
    detail: "Botella 1 L",
    image: "/products/agua.png",
    price: 40,
    aisle: "Pasillo 1 — Bebidas y Jugos",
  },
  {
    id: "chocolate",
    name: "Chocolate Dominicano",
    detail: "Barra 90 g",
    image: "/products/chocolate.png",
    price: 95,
    aisle: "Pasillo 5 — Dulces y Chocolates",
  },
]

/** The item Michael tries to scan that is out of stock. */
export const UNAVAILABLE: Product = {
  id: "papitas-fritolay",
  name: "Frito Lay Original",
  detail: "Papitas fritas 150 g",
  image: "/products/papitas-fritolay.png",
  price: 100,
  aisle: "Pasillo 4 — Snacks y Papitas",
  brand: "Frito Lay",
}

/** Smart substitute suggested for the unavailable product: store brand Wala (15% savings). */
export const SUBSTITUTE: Product = {
  id: "papitas-wala",
  name: "Wala Papitas Originales",
  detail: "Papitas fritas 150 g · Marca propia",
  image: "/products/papitas-wala.png",
  price: 85,
  originalPrice: 100,
  savingReason: "Alternativa Wala",
  aisle: "Pasillo 4 — Snacks y Papitas",
  isStoreBrand: true,
  brand: "Wala",
}

/** Smart promo: item with direct discount ("En rebaja", ~18% savings). */
export const PROMO: Product = {
  id: "jamon-cibao",
  name: "Jamón Cibao",
  detail: "Paquete 250 g · Selección especial",
  image: "/products/jamon.png",
  price: 90,
  originalPrice: 110,
  savingReason: "En rebaja",
  promoType: "rebaja",
  aisle: "Pasillo 7 — Lácteos y Embutidos",
  brand: "Cibao",
}

/** Extended catalog for instant search in store */
export const ALL_STORE_PRODUCTS: Product[] = [
  ...CATALOG,
  SUBSTITUTE,
  PROMO,
  {
    id: "leche-rica",
    name: "Leche Rica Entera",
    detail: "Tetra Pak 1 Litro",
    image: "/products/agua.png",
    price: 80,
    aisle: "Pasillo 7 — Lácteos y Embutidos",
    brand: "Rica",
  },
  {
    id: "arroz-la-garza",
    name: "Arroz La Garza Premium",
    detail: "Funda 2 Libras",
    image: "/products/galletas.png",
    price: 95,
    aisle: "Pasillo 3 — Arroz y Granos",
    brand: "La Garza",
  },
  {
    id: "aceite-crisol",
    name: "Aceite Crisol de Soya",
    detail: "Botella 500 ml",
    image: "/products/jugo-wala.png",
    price: 110,
    aisle: "Pasillo 6 — Aceites y Condimentos",
    brand: "Crisol",
  },
  {
    id: "refresco-wala-uva",
    name: "Refresco Wala Uva",
    detail: "Botella 2 Litros",
    image: "/products/jugo-wala.png",
    price: 65,
    aisle: "Pasillo 1 — Bebidas y Jugos",
    isStoreBrand: true,
    brand: "Wala",
  },
]

export function searchProducts(query: string): Product[] {
  const q = query.trim().toLowerCase()
  if (!q) return ALL_STORE_PRODUCTS
  return ALL_STORE_PRODUCTS.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.detail.toLowerCase().includes(q) ||
      p.aisle.toLowerCase().includes(q) ||
      (p.brand && p.brand.toLowerCase().includes(q)),
  )
}

export function formatDOP(value: number): string {
  return "RD$" + Math.round(value).toLocaleString("es-DO")
}

export function lineRegular(line: CartLine): number {
  return (line.originalPrice ?? line.price) * line.qty
}

export function linePaid(line: CartLine): number {
  return line.price * line.qty
}

export function lineSaving(line: CartLine): number {
  return lineRegular(line) - linePaid(line)
}

export function cartCount(lines: CartLine[]): number {
  return lines.reduce((n, l) => n + l.qty, 0)
}

export function calculateSavingsEnRebaja(lines: CartLine[]): number {
  return lines
    .filter((l) => l.promoType === "rebaja" || l.savingReason?.toLowerCase().includes("rebaja"))
    .reduce((s, l) => s + lineSaving(l), 0)
}

/** Point 24: 1 pt per RD$100, 2 pts per RD$100 on store brands (Wala), calculated per line rounded down */
export function calculateEarnedPoints(lines: CartLine[]): number {
  return lines.reduce((totalPoints, line) => {
    const paidAmount = linePaid(line)
    const rate = line.isStoreBrand ? 2 : 1
    const linePoints = Math.floor((paidAmount / 100) * rate)
    return totalPoints + linePoints
  }, 0)
}

export function cartTotals(lines: CartLine[]) {
  const subtotal = lines.reduce((s, l) => s + lineRegular(l), 0)
  const discounts = lines.reduce((s, l) => s + lineSaving(l), 0)
  const savingsEnRebaja = calculateSavingsEnRebaja(lines)
  const total = subtotal - discounts
  return { subtotal, discounts, savingsEnRebaja, total }
}

export type ScanStep =
  | { type: "product"; product: Product }
  | { type: "unavailable"; product: Product; substitute: Product }

export const DEMO_SCAN_STEPS: ScanStep[] = [
  { type: "product", product: CATALOG[0] }, // Jugo Wala Naranja
  { type: "product", product: CATALOG[1] }, // Galletas Wala
  { type: "unavailable", product: UNAVAILABLE, substitute: SUBSTITUTE }, // Frito Lay -> Wala
  { type: "product", product: CATALOG[2] }, // Agua Purificada
  { type: "product", product: CATALOG[3] }, // Chocolate Dominicano
]

export type AiScenarioId = "happy" | "not_visible" | "extra_item"

export type AiScenario = {
  id: AiScenarioId
  name: string
  description: string
}

export const AI_VERIFY_SCENARIOS: AiScenario[] = [
  {
    id: "happy",
    name: "Camino Feliz (100% verificado)",
    description: "La cámara reconoce todos los productos de tu carrito sin discrepancias.",
  },
  {
    id: "not_visible",
    name: "Discrepancia: Producto no visible",
    description: "Uno de los productos escaneados está oculto o no se distingue con claridad.",
  },
  {
    id: "extra_item",
    name: "Discrepancia: Producto no escaneado",
    description: "La cámara detecta un artículo en la cesta que no fue registrado en el carrito.",
  },
]

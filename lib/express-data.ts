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
  },
  {
    id: "galletas-wala",
    name: "Galletas Wala",
    detail: "Paquete 200 g",
    image: "/products/galletas.png",
    price: 85,
  },
  {
    id: "agua",
    name: "Agua Purificada",
    detail: "Botella 1 L",
    image: "/products/agua.png",
    price: 40,
  },
  {
    id: "chocolate",
    name: "Chocolate Dominicano",
    detail: "Barra 90 g",
    image: "/products/chocolate.png",
    price: 95,
  },
]

/** The item Michael tries to scan that is out of stock. */
export const UNAVAILABLE: Product = {
  id: "papitas-fritolay",
  name: "Frito Lay Original",
  detail: "Papitas fritas 150 g",
  image: "/products/papitas-fritolay.png",
  price: 120,
}

/** Smart substitute suggested for the unavailable product. */
export const SUBSTITUTE: Product = {
  id: "papitas-wala",
  name: "Wala Papitas Originales",
  detail: "Papitas fritas 150 g",
  image: "/products/papitas-wala.png",
  price: 85,
  originalPrice: 120,
  savingReason: "Alternativa Wala",
}

/** Smart promo: item close to expiring, deep discount. */
export const PROMO: Product = {
  id: "jamon-cibao",
  name: "Jamón Cibao",
  detail: "Paquete 250 g · próximo a vencer",
  image: "/products/jamon.png",
  price: 90,
  originalPrice: 150,
  savingReason: "Precio Compra Exprés",
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

export function cartTotals(lines: CartLine[]) {
  const subtotal = lines.reduce((s, l) => s + lineRegular(l), 0)
  const discounts = lines.reduce((s, l) => s + lineSaving(l), 0)
  const total = subtotal - discounts
  return { subtotal, discounts, total }
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


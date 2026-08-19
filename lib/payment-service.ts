import { PaymentDetails, Card } from "./db/schema"

export type ProcessPaymentParams = {
  selectedMethod: "siremas_points" | "saved" | "new" | "other"
  total: number
  userPoints: number
  savedCard?: Card
  customCard?: Card
}

export async function processPayment({
  selectedMethod,
  total,
  userPoints,
  savedCard,
  customCard,
}: ProcessPaymentParams): Promise<{ success: boolean; paymentDetails: PaymentDetails; error?: string }> {
  // Simulate network roundtrip
  await new Promise((resolve) => setTimeout(resolve, 1100))

  const activeCard = customCard || savedCard || {
    id: "card_default",
    last4: "4821",
    brand: "Visa",
    holderName: "Camila Ramírez",
    expMonth: "08",
    expYear: "28",
  }

  if (selectedMethod === "siremas_points") {
    // 1 Point = RD$1
    if (userPoints >= total) {
      // 100% covered by Siremás points
      return {
        success: true,
        paymentDetails: {
          type: "points",
          description: `Pagado con ${total.toLocaleString("es-DO")} pts Siremás`,
          pointsUsed: total,
          pointsAmount: total,
          total,
        },
      }
    } else {
      // Split payment: points + card remainder
      const pointsUsed = userPoints
      const cardRemainder = total - userPoints
      return {
        success: true,
        paymentDetails: {
          type: "split",
          description: `Pagado con ${pointsUsed.toLocaleString("es-DO")} pts Siremás + RD$${cardRemainder.toLocaleString("es-DO")} en ${activeCard.brand} •••• ${activeCard.last4}`,
          pointsUsed,
          pointsAmount: pointsUsed,
          cardUsed: {
            last4: activeCard.last4,
            brand: activeCard.brand,
            amount: cardRemainder,
          },
          total,
        },
      }
    }
  }

  if (selectedMethod === "saved" || selectedMethod === "new") {
    return {
      success: true,
      paymentDetails: {
        type: "card",
        description: `Pagado con ${activeCard.brand} •••• ${activeCard.last4}`,
        cardUsed: {
          last4: activeCard.last4,
          brand: activeCard.brand,
          amount: total,
        },
        total,
      },
    }
  }

  // Other methods (tPago, etc.)
  return {
    success: true,
    paymentDetails: {
      type: "other",
      description: "Pagado con tPago / Enlace Express",
      total,
    },
  }
}

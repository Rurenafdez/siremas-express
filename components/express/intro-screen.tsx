import { ScanBarcode, ShieldCheck, Wallet, ArrowLeft, Sparkles } from "lucide-react"

const STEPS = [
  {
    icon: ScanBarcode,
    title: "Escanea tus productos",
    body: "Apunta la cámara al código de barras mientras recorres la tienda, sin esperar en caja.",
  },
  {
    icon: ShieldCheck,
    title: "Verifica con IA",
    body: "Genera tu Pase QR y confirma tu compra en la estación exprés con verificación automática.",
  },
  {
    icon: Wallet,
    title: "Paga desde tu celular",
    body: "Completa el pago con tu tarjeta o Puntos Siremás. Sin filas, sin esperas.",
  },
]

export function IntroScreen({
  onStart,
  onBack,
}: {
  onStart: () => void
  onBack: () => void
}) {
  return (
    <div className="flex h-full flex-col bg-primary text-primary-foreground">
      <div className="px-5 pt-5 pb-2">
        <button
          type="button"
          onClick={onBack}
          aria-label="Volver"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-foreground/10 transition active:scale-95"
        >
          <ArrowLeft className="h-5 w-5" aria-hidden />
        </button>
      </div>

      <div className="flex flex-1 flex-col px-6 pb-8 pt-4">
        {/* Hero */}
        <div className="flex items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary text-secondary-foreground shadow-lg">
            <ScanBarcode className="h-7 w-7" aria-hidden />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold leading-tight">Compra Exprés</h1>
            <p className="text-xs text-primary-foreground/70 mt-0.5">La Sirena · Scan & Go</p>
          </div>
        </div>

        <p className="mt-4 max-w-[20rem] text-sm text-primary-foreground/75 leading-relaxed text-pretty">
          Escanea tus productos mientras compras y paga sin pasar por caja. Así de simple.
        </p>

        <ol className="mt-7 space-y-4">
          {STEPS.map((step, i) => (
            <li
              key={step.title}
              className="flex items-start gap-4 animate-slide-up"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary-foreground/10">
                <step.icon className="h-6 w-6 text-secondary" aria-hidden />
                <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-secondary text-[11px] font-extrabold text-secondary-foreground shadow">
                  {i + 1}
                </span>
              </div>
              <div className="pt-0.5 flex-1">
                <p className="text-sm font-extrabold leading-tight">{step.title}</p>
                <p className="mt-0.5 text-xs text-primary-foreground/65 leading-relaxed">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-auto pt-8 space-y-2">
          <button
            type="button"
            onClick={onStart}
            className="w-full rounded-2xl bg-secondary py-4 text-base font-extrabold text-secondary-foreground shadow-lg transition active:scale-[0.99]"
          >
            Comenzar compra
          </button>
          <p className="text-center text-[11px] text-primary-foreground/50">
            <Sparkles className="inline h-3 w-3 mr-0.5 text-secondary" />
            Acumulas Puntos Siremás en cada compra exprés
          </p>
        </div>
      </div>
    </div>
  )
}

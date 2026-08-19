import { useEffect, useRef, useState } from "react"
import {
  ArrowLeft,
  Camera,
  Check,
  Store,
  Sparkles,
  ChevronRight,
} from "lucide-react"
import { type CartLine } from "@/lib/express-data"

type Phase = "idle" | "scanning" | "done"

export function VerifyScreen({
  cart,
  onVerified,
  onBack,
}: {
  cart: CartLine[]
  onVerified: () => void
  onBack: () => void
}) {
  const [phase, setPhase] = useState<Phase>("idle")
  const [recognized, setRecognized] = useState(0)
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])

  const items = cart

  useEffect(() => {
    return () => timers.current.forEach(clearTimeout)
  }, [])

  function startScan() {
    setPhase("scanning")
    setRecognized(0)
    items.forEach((_, i) => {
      const t = setTimeout(() => {
        setRecognized(i + 1)
        if (i === items.length - 1) {
          const done = setTimeout(() => setPhase("done"), 600)
          timers.current.push(done)
        }
      }, 550 * (i + 1))
      timers.current.push(t)
    })
  }

  return (
    <div className="flex h-full flex-col bg-sirena-navy-deep text-primary-foreground">
      <div className="flex items-center gap-3 px-5 py-4 border-b border-primary-foreground/10">
        <button
          type="button"
          onClick={onBack}
          aria-label="Volver"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-foreground/10 transition active:scale-95"
        >
          <ArrowLeft className="h-5 w-5" aria-hidden />
        </button>
        <h1 className="text-base font-extrabold">Verificación con IA</h1>
      </div>

      {/* Camera framing */}
      <div className="px-5 pt-3">
        <div className="relative flex aspect-square w-full max-h-[260px] items-center justify-center overflow-hidden rounded-3xl bg-primary/40 ring-1 ring-primary-foreground/10">
          <span className="absolute left-4 top-4 h-10 w-10 rounded-tl-2xl border-l-4 border-t-4 border-secondary" />
          <span className="absolute right-4 top-4 h-10 w-10 rounded-tr-2xl border-r-4 border-t-4 border-secondary" />
          <span className="absolute bottom-4 left-4 h-10 w-10 rounded-bl-2xl border-b-4 border-l-4 border-secondary" />
          <span className="absolute bottom-4 right-4 h-10 w-10 rounded-br-2xl border-b-4 border-r-4 border-secondary" />

          {phase === "scanning" && (
            <span className="animate-scanline absolute inset-x-8 h-0.5 rounded-full bg-secondary shadow-[0_0_12px_2px_var(--sirena-yellow)]" />
          )}

          {phase === "done" ? (
            <div className="animate-pop-in flex flex-col items-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-sirena-green">
                <Check className="h-9 w-9 text-primary-foreground" aria-hidden />
              </div>
              <p className="mt-2 text-base font-extrabold">Compra verificada</p>
            </div>
          ) : (
            <div className="flex flex-col items-center px-8 text-center">
              <Camera
                className="h-12 w-12 text-primary-foreground/40"
                aria-hidden
              />
              <p className="mt-2 text-xs font-semibold text-pretty">
                {phase === "scanning"
                  ? "Analizando tus productos…"
                  : "Coloca todos tus productos frente a la cámara"}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Recognition checklist */}
      <div className="no-scrollbar mt-3 flex-1 overflow-y-auto px-5">
        {phase === "idle" ? (
          <div className="flex items-start gap-2 rounded-2xl bg-primary-foreground/5 p-3 text-xs text-primary-foreground/75">
            <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-secondary" aria-hidden />
            <p className="text-pretty">
              Verificaremos que los productos de tu carrito coincidan con los que
              llevas contigo.
            </p>
          </div>
        ) : (
          <ul className="space-y-2">
            {items.map((item, i) => {
              const ok = i < recognized
              return (
                <li
                  key={item.id}
                  className={`flex items-center gap-3 rounded-2xl p-2.5 ring-1 transition ${
                    ok
                      ? "bg-sirena-green/15 ring-sirena-green/40"
                      : "bg-primary-foreground/5 ring-primary-foreground/10"
                  }`}
                >
                  <span
                    className={`flex h-5 w-5 items-center justify-center rounded-full transition ${
                      ok
                        ? "bg-sirena-green text-primary-foreground"
                        : "bg-primary-foreground/10 text-transparent"
                    }`}
                  >
                    <Check className="h-3.5 w-3.5" aria-hidden />
                  </span>
                  <span className="text-xs font-semibold">
                    {item.name}
                    {item.qty > 1 ? ` (x${item.qty})` : ""}
                  </span>
                  <span className="ml-auto text-[11px] font-medium text-primary-foreground/60">
                    {ok ? "Reconocido" : "…"}
                  </span>
                </li>
              )
            })}
          </ul>
        )}
      </div>

      {/* Action */}
      <div className="px-5 pb-6 pt-3">
        {phase === "idle" && (
          <button
            type="button"
            onClick={startScan}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-secondary py-3.5 text-base font-extrabold text-secondary-foreground active:scale-[0.99]"
          >
            <Camera className="h-5 w-5" aria-hidden />
            Tomar foto
          </button>
        )}
        {phase === "scanning" && (
          <button
            type="button"
            disabled
            className="w-full rounded-2xl bg-primary-foreground/10 py-3.5 text-base font-bold text-primary-foreground/60"
          >
            Verificando… {recognized}/{items.length}
          </button>
        )}
        {phase === "done" && (
          <button
            type="button"
            onClick={onVerified}
            className="animate-slide-up flex w-full items-center justify-center gap-2 rounded-2xl bg-sirena-green py-3.5 text-base font-extrabold text-primary-foreground active:scale-[0.99]"
          >
            <Store className="h-5 w-5" aria-hidden />
            Continuar a Estación de Salida
            <ChevronRight className="h-5 w-5" aria-hidden />
          </button>
        )}
      </div>
    </div>
  )
}

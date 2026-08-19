import { Signal, Wifi, BatteryFull } from "lucide-react"

/** Faux iOS status bar to sell the "inside the La Sirena app" feel. */
export function StatusBar({ dark = false }: { dark?: boolean }) {
  const tone = dark ? "text-primary-foreground" : "text-foreground"
  return (
    <div
      className={`flex items-center justify-between px-6 pt-3 pb-1 text-xs font-semibold ${tone}`}
    >
      <span className="tabular-nums">9:41</span>
      <div className="flex items-center gap-1.5">
        <Signal className="h-3.5 w-3.5" aria-hidden />
        <Wifi className="h-3.5 w-3.5" aria-hidden />
        <BatteryFull className="h-4 w-4" aria-hidden />
      </div>
    </div>
  )
}

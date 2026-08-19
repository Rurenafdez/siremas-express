"use client"

import { useState } from "react"
import {
  ShieldCheck,
  Camera,
  MapPin,
  CreditCard,
  Sparkles,
  Check,
  AlertCircle,
  FileText,
} from "lucide-react"

export function OnboardingScreen({
  onAccept,
}: {
  onAccept: (cedula: string, name: string) => void
}) {
  const [cedula, setCedula] = useState("")
  const [name, setName] = useState("Camila Ramírez")
  const [accepted, setAccepted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [validating, setValidating] = useState(false)

  function formatCedula(value: string) {
    const cleaned = value.replace(/\D/g, "").slice(0, 11)
    if (cleaned.length <= 3) return cleaned
    if (cleaned.length <= 10) return `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 10)}-${cleaned.slice(10)}`
  }

  function handleAutoFillDemo() {
    setCedula("001-1849204-8")
    setName("Camila Ramírez")
    setAccepted(true)
    setError(null)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const cleaned = cedula.replace(/\D/g, "")
    if (cleaned.length !== 11) {
      setError("Ingresa una cédula dominicana válida de 11 dígitos (000-0000000-0)")
      return
    }
    if (!name.trim()) {
      setError("Ingresa tu nombre completo")
      return
    }
    if (!accepted) {
      setError("Debes aceptar los Términos de Servicio y la Política de Privacidad para continuar")
      return
    }

    setValidating(true)
    setError(null)
    // Simulate JCE validation delay
    setTimeout(() => {
      onAccept(cedula, name)
    }, 800)
  }

  return (
    <div className="flex h-full flex-col bg-background overflow-hidden">
      {/* Header Banner */}
      <div className="bg-primary px-6 pb-6 pt-8 text-primary-foreground text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary text-secondary-foreground shadow-lg">
          <ShieldCheck className="h-8 w-8" />
        </div>
        <h1 className="mt-3 text-2xl font-extrabold leading-tight">
          Bienvenido a Compra Exprés
        </h1>
        <p className="mt-1 text-xs text-primary-foreground/80">
          La Sirena · Escanea, paga y sal sin filas
        </p>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar px-6 py-4 space-y-4">
        {/* Permission summaries */}
        <div className="rounded-2xl bg-card p-3.5 shadow-sm ring-1 ring-border space-y-2.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
            <FileText className="h-4 w-4 text-primary" />
            <span>Permisos y uso de datos</span>
          </div>

          <div className="space-y-2 text-xs text-muted-foreground">
            <div className="flex items-start gap-2.5">
              <Camera className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <p><span className="font-semibold text-foreground">Cámara:</span> Para escanear códigos de barra en góndola y verificación visual con IA.</p>
            </div>
            <div className="flex items-start gap-2.5">
              <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <p><span className="font-semibold text-foreground">Ubicación:</span> Para confirmar tu tienda La Sirena y promociones en pasillo.</p>
            </div>
            <div className="flex items-start gap-2.5">
              <CreditCard className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <p><span className="font-semibold text-foreground">Pagos y Puntos Siremás:</span> Cobro seguro y acumulación automática de puntos.</p>
            </div>
          </div>
        </div>

        {/* Form Identity */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {error && (
            <div className="flex items-start gap-2 rounded-xl bg-destructive/15 p-2.5 text-xs font-semibold text-destructive">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-foreground mb-1">
              Nombre y apellido
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setError(null)
                setName(e.target.value)
              }}
              placeholder="Ej: Camila Ramírez"
              className="w-full rounded-xl bg-muted px-3.5 py-2.5 text-sm font-semibold text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <div className="flex justify-between items-baseline mb-1">
              <label className="block text-xs font-bold text-foreground">
                Cédula Dominicana
              </label>
              <span className="text-[10px] text-muted-foreground">Verificación requerida (JCE)</span>
            </div>
            <input
              type="text"
              inputMode="numeric"
              placeholder="001-0000000-0"
              value={cedula}
              onChange={(e) => {
                setError(null)
                setCedula(formatCedula(e.target.value))
              }}
              className="w-full rounded-xl bg-muted px-3.5 py-2.5 text-sm font-semibold tracking-wider text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Terms Checkbox */}
          <label className="flex items-start gap-2.5 pt-1 cursor-pointer">
            <input
              type="checkbox"
              checked={accepted}
              onChange={(e) => {
                setError(null)
                setAccepted(e.target.checked)
              }}
              className="mt-0.5 h-4 w-4 rounded border-border text-primary focus:ring-primary"
            />
            <span className="text-xs text-muted-foreground select-none leading-tight">
              He leído y acepto los <span className="font-semibold text-foreground underline">Términos del Servicio</span> y la <span className="font-semibold text-foreground underline">Política de Privacidad</span> de Grupo Ramos / La Sirena.
            </span>
          </label>

          <div className="pt-2 space-y-2">
            <button
              type="submit"
              disabled={validating}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-3.5 text-sm font-extrabold text-primary-foreground transition active:scale-[0.99] disabled:opacity-60"
            >
              {validating ? "Validando identidad…" : "Continuar a Compra Exprés"}
            </button>

            <button
              type="button"
              onClick={handleAutoFillDemo}
              className="flex w-full items-center justify-center gap-1.5 py-2 text-xs font-bold text-primary hover:underline"
            >
              <Sparkles className="h-3.5 w-3.5 text-secondary" />
              Autocompletar perfil demo (Camila Ramírez)
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

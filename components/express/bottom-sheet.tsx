"use client"

import type { ReactNode } from "react"

/** Shared dimmed overlay + rounded bottom sheet used by smart pop-ups. */
export function BottomSheet({
  children,
  onClose,
  labelledBy,
}: {
  children: ReactNode
  onClose?: () => void
  labelledBy?: string
}) {
  return (
    <div className="absolute inset-0 z-40 flex items-end">
      <button
        type="button"
        aria-label="Cerrar"
        onClick={onClose}
        className="absolute inset-0 bg-primary/40 backdrop-blur-[2px]"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        className="animate-pop-in relative w-full rounded-t-3xl bg-card p-5 pb-7 shadow-2xl ring-1 ring-border"
      >
        <div className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-border" />
        {children}
      </div>
    </div>
  )
}

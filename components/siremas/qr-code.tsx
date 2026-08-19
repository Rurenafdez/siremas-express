"use client"

import { useMemo } from "react"

// Deterministic pseudo-random QR-style matrix for the demo.
function buildMatrix(seed: string, size: number): boolean[][] {
  let h = 2166136261
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  const rand = () => {
    h ^= h << 13
    h ^= h >>> 17
    h ^= h << 5
    return ((h >>> 0) % 1000) / 1000
  }
  const m: boolean[][] = Array.from({ length: size }, () =>
    Array.from({ length: size }, () => rand() > 0.5),
  )
  return m
}

// Returns "on" | "off" | null (not part of a finder)
function finderState(r: number, c: number, size: number): boolean | null {
  const boxes = [
    [0, 0],
    [0, size - 7],
    [size - 7, 0],
  ]
  for (const [r0, c0] of boxes) {
    if (r >= r0 && r < r0 + 7 && c >= c0 && c < c0 + 7) {
      const lr = r - r0
      const lc = c - c0
      const ring = lr === 0 || lr === 6 || lc === 0 || lc === 6
      const core = lr >= 2 && lr <= 4 && lc >= 2 && lc <= 4
      return ring || core
    }
  }
  return null
}

export function QrCode({
  value = "SIREMAS-EXPRESS",
  className = "",
}: {
  value?: string
  className?: string
}) {
  const size = 25
  const matrix = useMemo(() => buildMatrix(value, size), [value])

  return (
    <div
      className={`grid aspect-square w-full ${className}`}
      style={{ gridTemplateColumns: `repeat(${size}, 1fr)` }}
      role="img"
      aria-label="Código QR de salida Siremás Express"
    >
      {matrix.map((row, r) =>
        row.map((on, c) => {
          const finder = finderState(r, c, size)
          const filled = finder === null ? on : finder
          return (
            <span
              key={`${r}-${c}`}
              className="block h-full w-full"
              style={{
                backgroundColor: filled
                  ? "var(--sirena-navy-deep)"
                  : "transparent",
              }}
            />
          )
        }),
      )}
    </div>
  )
}

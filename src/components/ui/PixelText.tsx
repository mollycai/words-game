'use client'

import { useEffect, useState } from 'react'

interface PixelTextProps {
  text: string
  charSize?: number
  className?: string
  /** single color or array of per-char colors */
  color?: string | string[]
  /** per-char glow — if array, matches color array; if single string, applies to all */
  glowColor?: string | string[]
  cellSize?: number
  gap?: number
}

function sampleChar(char: string, size: number, color: string): string[][] {
  const S = 768
  const canvas = document.createElement('canvas')
  canvas.width = S
  canvas.height = S
  const ctx = canvas.getContext('2d')!
  ctx.clearRect(0, 0, S, S)

  const fontSize = Math.round(S * 0.88)
  ctx.font = `900 ${fontSize}px "PingFang SC", "Heiti SC", "STHeiti", "Microsoft YaHei", "Arial Black", sans-serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillStyle = '#FFFFFF'
  ctx.fillText(char, S / 2, S / 2)

  const img = ctx.getImageData(0, 0, S, S)
  const d = img.data

  // Bounding box
  let x0 = S, y0 = S, x1 = 0, y1 = 0
  for (let y = 0; y < S; y++) {
    for (let x = 0; x < S; x++) {
      if (d[(y * S + x) * 4 + 3] > 40) {
        if (x < x0) x0 = x; if (y < y0) y0 = y
        if (x > x1) x1 = x; if (y > y1) y1 = y
      }
    }
  }
  if (x1 <= x0 || y1 <= y0) return Array.from({ length: size }, () => Array(size).fill(''))

  // Square crop
  const w = x1 - x0 + 1, h = y1 - y0 + 1
  const sz = Math.max(w, h) * 1.06
  const cx = x0 + w / 2, cy = y0 + h / 2

  const grid: string[][] = []
  const step = sz / size
  for (let gy = 0; gy < size; gy++) {
    const row: string[] = []
    const by = cy - sz / 2 + gy * step
    for (let gx = 0; gx < size; gx++) {
      const bx = cx - sz / 2 + gx * step
      let total = 0, count = 0
      const ey = Math.min(S, Math.floor(by + step))
      for (let py = Math.max(0, Math.floor(by)); py < ey; py++) {
        const ex = Math.min(S, Math.floor(bx + step))
        for (let px = Math.max(0, Math.floor(bx)); px < ex; px++) {
          total += d[(py * S + px) * 4 + 3]
          count++
        }
      }
      row.push(count > 0 && total / count > 35 ? color : '')
    }
    grid.push(row)
  }
  return grid
}

export function PixelText({
  text,
  charSize = 16,
  className,
  color = '#F0EEFF',
  glowColor,
  cellSize = 5,
  gap = 2,
}: PixelTextProps) {
  const [chars, setChars] = useState<string[][][]>([])
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const colorArr = Array.isArray(color) ? color : Array.from(text, () => color)
    const grids = Array.from(text).map((ch, i) => sampleChar(ch, charSize, colorArr[i] || colorArr[0] || '#F0EEFF'))
    setChars(grids)
    setReady(true)
  }, [text, charSize, JSON.stringify(color)])

  if (!ready) {
    const fallbackColor = Array.isArray(color) ? color[0] : color
    return <span className={className} style={{ fontFamily: '"Arial Black", sans-serif', color: fallbackColor, fontSize: '2rem' }}>{text}</span>
  }

  const totalCols = chars.reduce((sum, g) => sum + (g[0]?.length ?? charSize) + gap, 0) - gap
  const rows = charSize
  const totalW = totalCols * cellSize
  const totalH = rows * cellSize

  const glowArr = Array.isArray(glowColor)
    ? glowColor
    : Array.from(text, () => glowColor || '')

  return (
    <span
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        verticalAlign: 'middle',
        imageRendering: 'pixelated',
      }}
    >
      <svg width={totalW} height={totalH} viewBox={`0 0 ${totalCols} ${rows}`} style={{ display: 'block' }}>
        <defs>
          {glowArr.map((gc, i) =>
            gc ? (
              <filter key={i} id={`glow-${i}`} x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur in="SourceGraphic" stdDeviation={cellSize * 0.35} result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            ) : null
          )}
        </defs>
        {chars.map((grid, ci) => {
          const cols = grid[0]?.length ?? charSize
          const offsetX = chars.slice(0, ci).reduce((s, g) => s + (g[0]?.length ?? charSize) + gap, 0)
          const hasGlow = glowArr[ci]
          return (
            <g key={ci} filter={hasGlow ? `url(#glow-${ci})` : undefined}>
              {grid.map((row, y) =>
                row.map((cell, x) =>
                  cell ? (
                    <rect key={`${y}-${x}`} x={offsetX + x} y={y} width={1} height={1} fill={cell} shapeRendering="crispEdges" />
                  ) : null
                )
              )}
            </g>
          )
        })}
      </svg>
    </span>
  )
}

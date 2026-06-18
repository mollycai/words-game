import React from 'react'

interface PixelIconProps {
  /** 2D grid: '' = transparent, hex color string otherwise. N×N grid auto-fits 24×24 viewBox. */
  grid: string[][]
  size?: number
  className?: string
}

export function PixelIcon({ grid, size = 24, className }: PixelIconProps) {
  const rows = grid.length
  const cols = grid[0]?.length ?? 0
  const cellSize = 24 / Math.max(rows, cols)

  const rects: React.ReactElement[] = []
  grid.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (!cell) return
      const gap = cellSize * 0.06
      rects.push(
        <rect
          key={`${y}-${x}`}
          x={x * cellSize + gap}
          y={y * cellSize + gap}
          width={cellSize - gap * 2}
          height={cellSize - gap * 2}
          fill={cell}
          rx={cellSize * 0.08}
        />
      )
    })
  })

  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      {rects}
    </svg>
  )
}

/** Single-color convenience wrapper: number[][] grid + a single color */
export function PixelIconMono({ grid, color = 'currentColor', size = 24, className }: {
  grid: number[][]; color?: string; size?: number; className?: string
}) {
  const hexGrid: string[][] = grid.map(row => row.map(cell => (cell ? color : '')))
  return <PixelIcon grid={hexGrid} size={size} className={className} />
}

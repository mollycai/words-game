'use client'

import { useEffect, useRef } from 'react'

interface Particle {
  sx: number; sy: number
  vx: number; vy: number
  gravity: number
  life: number
  elapsed: number
  size: number
  color: string
}

interface PixelExplosionProps {
  baseColor: string
}

const SCALE = 1.0 // tight spread

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return { r, g, b }
}

function spawnParticles(baseColor: string, w: number, h: number): Particle[] {
  const rgb = hexToRgb(baseColor)
  const cx = w / 2, cy = h / 2
  const particles: Particle[] = []
  const rows = 10, cols = 12

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const sx = (col / cols) * w + Math.random() * (w / cols) * 0.3
      const sy = (row / rows) * h + Math.random() * (h / rows) * 0.3

      const angle = Math.atan2(sy - cy, sx - cx)
      const speed = 15 + Math.random() * 30
      const vx = Math.cos(angle) * speed * SCALE
      const vy = Math.sin(angle) * speed * SCALE
      const gravity = 200 + Math.random() * 150
      const life = 0.3 + Math.random() * 0.3

      const size = 2 + Math.random() * 3

      const rv = Math.min(255, Math.max(0, rgb.r + Math.floor(Math.random() * 60 - 30)))
      const gv = Math.min(255, Math.max(0, rgb.g + Math.floor(Math.random() * 60 - 30)))
      const bv = Math.min(255, Math.max(0, rgb.b + Math.floor(Math.random() * 60 - 30)))

      particles.push({
        sx, sy, vx, vy, gravity, life,
        elapsed: -Math.random() * 0.04,
        size,
        color: `rgb(${rv},${gv},${bv})`,
      })
    }
  }
  return particles
}

export default function PixelExplosion({ baseColor }: PixelExplosionProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Match canvas to parent block size
    const parent = canvas.parentElement
    const w = parent ? parent.offsetWidth : 100
    const h = parent ? parent.offsetHeight : 60
    canvas.width = w
    canvas.height = h

    const particles = spawnParticles(baseColor, w, h)
    let prevTime: number | null = null

    function frame(now: number) {
      const dt = prevTime ? Math.min(0.05, (now - prevTime) / 1000) : 0.016
      prevTime = now

      ctx!.clearRect(0, 0, w, h)

      let alive = false
      for (const p of particles) {
        p.elapsed += dt
        if (p.elapsed > p.life) continue
        if (p.elapsed < 0) { alive = true; continue }

        alive = true
        const t = p.elapsed
        const px = p.sx + p.vx * t
        const py = p.sy + p.vy * t + 0.5 * p.gravity * t * t

        const alpha = Math.max(0, 1 - t / p.life)
        ctx!.globalAlpha = alpha
        ctx!.fillStyle = p.color
        ctx!.fillRect(px - p.size / 2, py - p.size / 2, p.size, p.size)
      }
      ctx!.globalAlpha = 1

      if (alive) {
        animRef.current = requestAnimationFrame(frame)
      }
    }

    animRef.current = requestAnimationFrame(frame)

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current)
    }
  }, [baseColor])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 20,
      }}
    />
  )
}

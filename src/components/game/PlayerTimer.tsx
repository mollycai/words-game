'use client'

import { formatTime } from '@/lib/gameLogic'

interface PlayerTimerProps {
  name: string
  color: string
  elapsed: number
  finished: boolean
  quit: boolean
}

export default function PlayerTimer({ name, color, elapsed, finished, quit }: PlayerTimerProps) {
  return (
    <div
      className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl mx-2 mt-2 shadow-sm"
      style={{
        background: `linear-gradient(135deg, ${color}12, ${color}08)`,
        border: `1px solid ${color}30`,
      }}
    >
      <div className="w-3.5 h-3.5 rounded-full shadow-inner flex-shrink-0" style={{ backgroundColor: color }}>
        <div className="w-full h-full rounded-full bg-white/30" />
      </div>
      <span className="font-bold text-sm text-text-main">{name}</span>

      {quit && (
        <span className="ml-auto text-danger-500 text-xs font-semibold">弃权</span>
      )}

      {!finished && !quit && (
        <span className="ml-auto font-mono text-lg font-bold tabular-nums text-text-main">
          {formatTime(elapsed)}
        </span>
      )}

      {finished && !quit && (
        <>
          <span className="ml-auto font-mono text-lg font-bold tabular-nums text-success-600">
            {formatTime(elapsed)}
          </span>
          <span className="text-success-500 text-xs font-semibold">✓</span>
        </>
      )}

      {quit && (
        <span className="font-mono text-base font-bold tabular-nums text-text-muted/40 line-through ml-1">
          {formatTime(elapsed)}
        </span>
      )}
    </div>
  )
}

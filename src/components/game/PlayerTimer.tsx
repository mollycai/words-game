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
    <div className="flex items-center gap-2 px-2 py-1">
      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
      <span className="font-bold text-sm">{name}</span>
      <span
        className={`ml-auto font-mono text-lg font-bold tabular-nums ${
          finished && !quit ? 'text-success-500' : quit ? 'text-danger-500 line-through' : ''
        }`}
      >
        {formatTime(elapsed)}
      </span>
      {finished && !quit && <span className="text-success-500 text-xs">✓</span>}
      {quit && <span className="text-danger-500 text-xs">弃权</span>}
    </div>
  )
}

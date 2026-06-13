'use client'

import type { PlayerState } from '@/types'
import { formatTime } from '@/lib/gameLogic'

interface PodiumProps {
  champion: PlayerState
}

export default function Podium({ champion }: PodiumProps) {
  return (
    <div className="text-center space-y-2 animate-pop-in">
      <p className="text-6xl">🏆</p>
      <div className="w-4 h-4 rounded-full mx-auto" style={{ backgroundColor: champion.color }} />
      <p className="text-2xl font-extrabold">{champion.name}</p>
      <p className="text-3xl font-mono font-bold text-warning-500">{formatTime(champion.elapsed)}</p>
    </div>
  )
}

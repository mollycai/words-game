'use client'

import type { PlayerState } from '@/types'
import { formatTime } from '@/lib/gameLogic'

interface RankCardProps {
  player: PlayerState
  rank: number
}

const MEDAL_EMOJI: Record<number, string> = { 1: '🥇', 2: '🥈', 3: '🥉' }

export default function RankCard({ player, rank }: RankCardProps) {
  return (
    <div
      className={`flex items-center gap-4 bg-white rounded-xl p-4 ${
        rank === 1 ? 'ring-2 ring-warning-500 shadow-lg scale-105' : 'shadow'
      }`}
    >
      <span className="text-3xl">{MEDAL_EMOJI[rank] || `#${rank}`}</span>
      <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: player.color }} />
      <div className="flex-1">
        <p className="font-bold">{player.name}</p>
        {player.quit ? (
          <p className="text-danger-500 text-sm">弃权</p>
        ) : (
          <p className="text-muted text-sm">{formatTime(player.elapsed)}</p>
        )}
      </div>
    </div>
  )
}

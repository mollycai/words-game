'use client'

import type { PlayerState } from '@/types'
import { formatTime } from '@/lib/gameLogic'
import { PixelTrophy } from '@/components/icons'

interface PodiumProps {
  champion: PlayerState
}

export default function Podium({ champion }: PodiumProps) {
  return (
    <div className="text-center animate-pop-in" style={{ position: 'relative', zIndex: 1 }}>
      {/* Champion icon */}
      <div className="flex justify-center mb-2">
        <PixelTrophy size={56} />
      </div>

      {/* Player dot + name */}
      <div style={{
        fontFamily: 'var(--font-press-start), monospace',
        fontSize: 11,
        color: '#fff',
        textShadow: `0 0 12px ${champion.color}, 0 0 24px ${champion.color}60`,
        letterSpacing: 2,
        marginBottom: 6,
      }}>
        {champion.name}
      </div>

      {/* Time */}
      <div style={{
        fontFamily: '"Courier New", monospace',
        fontSize: 28,
        fontWeight: 700,
        color: '#FCC364',
        textShadow: '0 0 16px rgba(252,195,100,0.6), 0 0 32px rgba(252,195,100,0.3)',
        letterSpacing: 3,
      }}>
        {formatTime(champion.elapsed)}
      </div>

      {/* Champion label */}
      <div style={{
        fontFamily: '"Courier New", monospace',
        fontSize: 10,
        fontWeight: 700,
        color: '#FCC364',
        textShadow: '0 0 6px rgba(252,195,100,0.4)',
        letterSpacing: 2,
        marginTop: 4,
      }}>
        ★ CHAMPION ★
      </div>
    </div>
  )
}

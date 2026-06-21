'use client'

import type { PlayerState } from '@/types'
import { formatTime } from '@/lib/gameLogic'
import { PixelMedal } from '@/components/icons'

interface RankCardProps {
  player: PlayerState
  rank: number
}

export default function RankCard({ player, rank }: RankCardProps) {
  const isFirst = rank === 1 && !player.quit

  return (
    <div
      style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '12px 16px',
        background: '#0d0d1a',
        border: isFirst
          ? '2px solid rgba(252,195,100,0.4)'
          : '1px solid rgba(139,131,240,0.12)',
        boxShadow: isFirst
          ? '0 0 16px rgba(252,195,100,0.12), inset 0 0 20px rgba(0,0,0,0.3)'
          : 'inset 0 0 16px rgba(0,0,0,0.3)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* CRT scanlines */}
      <span style={{
        position: 'absolute', inset: 0,
        background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.06) 0px, transparent 2px, rgba(0,0,0,0.06) 4px)',
        pointerEvents: 'none',
      }} />

      {/* Medal */}
      <span style={{ position: 'relative', zIndex: 1, flexShrink: 0 }}>
        {rank <= 3 ? (
          <PixelMedal rank={rank as 1 | 2 | 3} size={28} />
        ) : (
          <span style={{
            fontFamily: '"Courier New", monospace',
            fontSize: 16, fontWeight: 700,
            color: '#555',
          }}>
            #{rank}
          </span>
        )}
      </span>

      {/* Player dot */}
      <span style={{
        width: 8, height: 8,
        borderRadius: '50%',
        background: player.color,
        boxShadow: `0 0 8px ${player.color}`,
        flexShrink: 0,
        position: 'relative', zIndex: 1,
      }} />

      {/* Name + status */}
      <div style={{ flex: 1, position: 'relative', zIndex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: '"Courier New", monospace',
          fontSize: 12, fontWeight: 700,
          color: player.quit ? '#555' : '#ddd',
          letterSpacing: 1,
        }}>
          {player.name}
        </div>
        {player.quit ? (
          <div style={{
            fontFamily: 'monospace',
            fontSize: 10,
            color: '#FF3B30',
            textShadow: '0 0 6px rgba(255,59,48,0.3)',
          }}>
            弃权
          </div>
        ) : (
          <div style={{
            fontFamily: '"Courier New", monospace',
            fontSize: 10,
            color: '#888',
          }}>
            {formatTime(player.elapsed)}
          </div>
        )}
      </div>

      {/* Time display right-aligned */}
      {!player.quit && (
        <span style={{
          fontFamily: '"Courier New", monospace',
          fontSize: 14, fontWeight: 700,
          color: player.finished ? '#4FE8BA' : '#aaa',
          textShadow: player.finished ? '0 0 8px rgba(79,232,186,0.4)' : 'none',
          position: 'relative', zIndex: 1,
          flexShrink: 0,
        }}>
          {formatTime(player.elapsed)}
        </span>
      )}
    </div>
  )
}

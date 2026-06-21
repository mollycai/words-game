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
      className="flex items-center gap-2 px-3 py-2 flex-shrink-0"
      style={{
        borderBottom: '1px solid rgba(255,255,255,0.04)',
      }}
    >
      {/* Neon dot */}
      <span style={{
        width: 8, height: 8,
        borderRadius: '50%',
        background: quit ? '#555' : color,
        boxShadow: quit ? 'none' : `0 0 10px ${color}, 0 0 20px ${color}`,
        flexShrink: 0,
      }} />

      {/* Player name */}
      <span style={{
        fontFamily: 'var(--font-press-start), monospace',
        fontSize: 7,
        color: quit ? '#444' : '#ccc',
        letterSpacing: 1,
      }}>
        {name}
      </span>

      {/* Quit badge */}
      {quit && (
        <span style={{
          marginLeft: 'auto',
          fontFamily: 'monospace',
          fontSize: 9,
          fontWeight: 700,
          color: '#FF3B30',
          textShadow: '0 0 6px rgba(255,59,48,0.3)',
        }}>
          弃权
        </span>
      )}

      {/* Running timer */}
      {!finished && !quit && (
        <span style={{
          marginLeft: 'auto',
          fontFamily: '"Courier New", monospace',
          fontSize: 11, fontWeight: 700,
          color: '#eee',
          textShadow: '0 0 8px rgba(255,255,255,0.3)',
          fontVariantNumeric: 'tabular-nums',
        }}>
          {formatTime(elapsed)}
        </span>
      )}

      {/* Finished timer */}
      {finished && !quit && (
        <>
          <span style={{
            marginLeft: 'auto',
            fontFamily: '"Courier New", monospace',
            fontSize: 11, fontWeight: 700,
            color: '#4FE8BA',
            textShadow: '0 0 8px rgba(79,232,186,0.4)',
          }}>
            {formatTime(elapsed)}
          </span>
          <span style={{
            fontFamily: 'monospace',
            fontSize: 10, fontWeight: 700,
            color: '#4FE8BA',
            textShadow: '0 0 6px rgba(79,232,186,0.3)',
          }}>
            ✓
          </span>
        </>
      )}

      {/* Quit timer (strikethrough) */}
      {quit && (
        <span style={{
          fontFamily: '"Courier New", monospace',
          fontSize: 10, fontWeight: 700,
          color: '#333',
          textDecoration: 'line-through',
          marginLeft: 4,
        }}>
          {formatTime(elapsed)}
        </span>
      )}
    </div>
  )
}

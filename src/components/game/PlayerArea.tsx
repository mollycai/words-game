'use client'

import type { PlayerState, Block } from '@/types'
import PlayerTimer from './PlayerTimer'
import BlockGrid from './BlockGrid'

interface PlayerAreaProps {
  player: PlayerState
  disabled: boolean
  onBlockClick: (playerId: number, block: Block) => void
}

export default function PlayerArea({ player, disabled, onBlockClick }: PlayerAreaProps) {
  return (
    <div
      className="flex-1 flex flex-col min-w-0 relative"
      style={{
        // Neon vertical divider (except last player)
        borderRight: player.id < 3
          ? '2px solid transparent'
          : 'none',
        borderImage: player.id < 3
          ? 'linear-gradient(180deg, transparent, rgba(139,131,240,0.4), rgba(139,131,240,0.15), transparent) 1'
          : undefined,
      }}
    >
      <PlayerTimer
        name={player.name}
        color={player.color}
        elapsed={player.elapsed}
        finished={player.finished}
        quit={player.quit}
      />

      <div className={`flex-1 flex flex-col ${player.quit ? 'opacity-25 pointer-events-none grayscale' : ''}`}>
        {/* Quit state */}
        {player.quit && (
          <div className="flex-1 flex items-center justify-center">
            <span style={{
              fontFamily: '"Courier New", monospace',
              fontSize: 12, fontWeight: 700,
              color: player.color,
              border: `2px dashed ${player.color}30`,
              background: `${player.color}08`,
              padding: '8px 16px',
              letterSpacing: 1,
            }}>
              已弃权
            </span>
          </div>
        )}

        {/* Playing grid */}
        {!player.quit && (
          <BlockGrid
            blocks={player.blocks}
            playerId={player.id}
            disabled={disabled || player.finished}
            onBlockClick={(block) => onBlockClick(player.id, block)}
          />
        )}

        {/* Finished banner */}
        {player.finished && !player.quit && (
          <div style={{
            textAlign: 'center',
            padding: '8px',
            fontFamily: '"Courier New", monospace',
            fontSize: 10, fontWeight: 700,
            letterSpacing: 1,
            color: '#4FE8BA',
            textShadow: '0 0 6px rgba(79,232,186,0.3)',
            borderTop: '1px solid rgba(79,232,186,0.2)',
            background: 'rgba(79,232,186,0.04)',
          }}>
            ✓ ALL CLEAR!
          </div>
        )}
      </div>
    </div>
  )
}

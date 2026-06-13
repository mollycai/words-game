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
      className="flex-1 flex flex-col min-w-0 bg-white/50 overflow-hidden"
      style={{
        borderRight: player.id < 3 ? '1px solid #e5e7eb' : 'none',
      }}
    >
      <PlayerTimer
        name={player.name}
        color={player.color}
        elapsed={player.elapsed}
        finished={player.finished}
        quit={player.quit}
      />

      <div className={`flex-1 flex flex-col ${player.quit ? 'opacity-30 pointer-events-none grayscale' : ''}`}>
        {player.quit && (
          <div className="flex-1 flex items-center justify-center">
            <span
              className="text-lg font-extrabold px-4 py-2 rounded-xl"
              style={{
                color: player.color,
                border: `2px dashed ${player.color}40`,
                backgroundColor: `${player.color}08`,
              }}
            >
              已弃权
            </span>
          </div>
        )}

        {!player.quit && (
          <BlockGrid
            blocks={player.blocks}
            playerId={player.id}
            playerColor={player.color}
            disabled={disabled || player.finished}
            onBlockClick={(block) => onBlockClick(player.id, block)}
          />
        )}

        {player.finished && !player.quit && (
          <div className="flex items-center justify-center py-3">
            <div
              className="flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm"
              style={{
                backgroundColor: `${player.color}12`,
                color: player.color,
              }}
            >
              ✅ 全部完成!
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

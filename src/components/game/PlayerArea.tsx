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
      className="flex-1 flex flex-col min-w-0"
      style={{ borderRight: player.id < 3 ? '2px dashed #e5e7eb' : 'none' }}
    >
      <PlayerTimer
        name={player.name}
        color={player.color}
        elapsed={player.elapsed}
        finished={player.finished}
        quit={player.quit}
      />
      <div className={`flex-1 ${player.quit ? 'opacity-40 pointer-events-none' : ''}`}>
        {player.quit && (
          <div className="flex items-center justify-center h-full">
            <span className="text-danger-500 font-bold text-lg">已弃权</span>
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
          <div className="flex items-center justify-center py-4">
            <span className="text-success-500 font-bold text-lg">✅ 完成!</span>
          </div>
        )}
      </div>
    </div>
  )
}

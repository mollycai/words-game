'use client'

import type { Block } from '@/types'
import { gridCols } from '@/lib/gameLogic'
import WordBlock from './WordBlock'

interface BlockGridProps {
  blocks: Block[]
  playerId: number
  playerColor: string
  disabled: boolean
  onBlockClick: (block: Block) => void
}

export default function BlockGrid({ blocks, playerId, playerColor, disabled, onBlockClick }: BlockGridProps) {
  const cols = gridCols(blocks.length)

  return (
    <div
      className="grid gap-2 p-2"
      style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
    >
      {blocks.map((block) => (
        <WordBlock
          key={block.id}
          block={block}
          color={playerColor}
          disabled={disabled}
          onClick={() => onBlockClick(block)}
        />
      ))}
    </div>
  )
}

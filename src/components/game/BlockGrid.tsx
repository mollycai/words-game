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

function gridRows(total: number, cols: number): number {
  return Math.ceil(total / cols)
}

export default function BlockGrid({ blocks, playerId, playerColor, disabled, onBlockClick }: BlockGridProps) {
  const cols = gridCols(blocks.length)
  const rows = gridRows(blocks.length, cols)

  return (
    <div
      className="grid h-full gap-3 p-3"
      style={{
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 1fr)`,
      }}
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

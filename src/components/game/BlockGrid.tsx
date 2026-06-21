'use client'

import type { Block } from '@/types'
import { gridCols, blockFontSize } from '@/lib/gameLogic'
import WordBlock from './WordBlock'

interface BlockGridProps {
  blocks: Block[]
  playerId: number
  disabled: boolean
  onBlockClick: (block: Block) => void
}

function gridRows(total: number, cols: number): number {
  return Math.ceil(total / cols)
}

export default function BlockGrid({ blocks, playerId, disabled, onBlockClick }: BlockGridProps) {
  const total = blocks.length
  const cols = gridCols(total)
  const rows = gridRows(total, cols)
  const fontSize = blockFontSize(total)

  // Tighter vertical gap for many rows; wider blocks need less horizontal padding
  const gap = total <= 16 ? 5 : total <= 32 ? 4 : total <= 50 ? 3 : total <= 70 ? 2 : 2
  const pad = total <= 16 ? 8 : total <= 50 ? 5 : 3

  return (
    <div
      className="h-full"
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
        gap: `${gap}px`,
        padding: `${pad}px`,
        overflow: 'visible', // allow explosion particles to escape
      }}
    >
      {blocks.map((block) => (
        <WordBlock
          key={block.id}
          block={block}
          playerId={playerId}
          disabled={disabled}
          fontSize={fontSize}
          onClick={() => onBlockClick(block)}
        />
      ))}
    </div>
  )
}

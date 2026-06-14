'use client'

import type { Block } from '@/types'
import { gridCols, blockFontSize, blockGap, blockPadding } from '@/lib/gameLogic'
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
  const total = blocks.length
  const cols = gridCols(total)
  const rows = gridRows(total, cols)
  const fontSize = blockFontSize(total)

  return (
    <div
      className={`grid h-full overflow-auto ${blockGap(total)} ${blockPadding(total)}`}
      style={{
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
      }}
    >
      {blocks.map((block) => (
        <WordBlock
          key={block.id}
          block={block}
          color={playerColor}
          disabled={disabled}
          fontSize={fontSize}
          onClick={() => onBlockClick(block)}
        />
      ))}
    </div>
  )
}

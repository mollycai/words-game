'use client'

import type { Block } from '@/types'

interface WordBlockProps {
  block: Block
  color: string
  onClick: () => void
  disabled: boolean
}

export default function WordBlock({ block, color, onClick, disabled }: WordBlockProps) {
  const isMatched = block.status === 'matched'
  const isSelected = block.status === 'selected'
  const isWrong = block.status === 'wrong'

  const borderColor = block.type === 'english' ? color : `${color}80`

  return (
    <button
      onClick={onClick}
      disabled={disabled || isMatched}
      className={`
        relative w-full aspect-[3/2] rounded-xl font-bold
        flex items-center justify-center text-center px-2
        transition-all duration-200
        min-w-[44px] min-h-[44px]
        ${isMatched ? 'scale-0 opacity-0 pointer-events-none' : ''}
        ${isSelected ? 'scale-105 shadow-lg z-10 -translate-y-0.5' : ''}
        ${isWrong ? 'animate-shake ring-2 ring-danger-500' : ''}
        ${!isSelected && !isWrong ? 'hover:shadow-md hover:-translate-y-0.5' : ''}
      `}
      style={{
        backgroundColor: isSelected ? color : '#FFFFFF',
        borderColor: isSelected ? color : borderColor,
        borderWidth: '2px',
        color: isSelected ? '#FFFFFF' : '#1A1A2E',
        boxShadow: isSelected ? `0 4px 16px ${color}40` : undefined,
      }}
    >
      <span className="text-sm sm:text-base leading-tight">{block.text}</span>
      <span
        className="absolute top-1 right-1.5 text-[10px] opacity-40"
        style={{ color: isSelected ? 'rgba(255,255,255,0.7)' : undefined }}
      >
        {block.type === 'english' ? 'EN' : '中'}
      </span>
    </button>
  )
}

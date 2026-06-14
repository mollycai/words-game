'use client'

import type { Block } from '@/types'

interface WordBlockProps {
  block: Block
  color: string
  onClick: () => void
  disabled: boolean
  fontSize: number
}

export default function WordBlock({ block, color, onClick, disabled, fontSize }: WordBlockProps) {
  const isMatched = block.status === 'matched'
  const isSelected = block.status === 'selected'
  const isWrong = block.status === 'wrong'
  const isEnglish = block.type === 'english'

  return (
    <button
      onClick={onClick}
      disabled={disabled || isMatched}
      className={`
        relative w-full rounded-lg font-semibold
        flex items-center justify-center text-center
        transition-all duration-200
        ${isMatched ? 'scale-0 opacity-0 pointer-events-none' : ''}
        ${isSelected
          ? 'scale-105 z-10 shadow-xl ring-2 -translate-y-0.5'
          : 'shadow-sm hover:shadow hover:-translate-y-px'
        }
        ${isWrong ? 'animate-shake ring-2 ring-danger-500' : ''}
      `}
      style={{
        backgroundColor: isSelected
          ? color
          : isEnglish ? '#EDF4FC' : '#FFFFFF',
        borderColor: isSelected
          ? color
          : isEnglish ? `${color}35` : '#E5E7EB',
        borderWidth: isSelected ? '2px' : '1px',
        color: isSelected ? '#FFFFFF' : '#1A1A2E',
        boxShadow: isSelected ? `0 4px 16px ${color}40` : undefined,
        fontSize: `${fontSize}px`,
      }}
    >
      <span className="leading-tight px-0.5 line-clamp-2">
        {block.text}
      </span>
    </button>
  )
}

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
  const isEnglish = block.type === 'english'

  return (
    <button
      onClick={onClick}
      disabled={disabled || isMatched}
      className={`
        relative w-full aspect-[3/2] rounded-2xl font-bold
        flex flex-col items-center justify-center text-center px-2 gap-0.5
        transition-all duration-200
        min-w-[44px] min-h-[44px]
        ${isMatched ? 'scale-0 opacity-0 pointer-events-none' : ''}
        ${isSelected
          ? 'scale-105 z-10 -translate-y-1 shadow-xl ring-2'
          : 'shadow-sm hover:shadow-md hover:-translate-y-0.5'
        }
        ${isWrong ? 'animate-shake ring-2 ring-danger-500' : ''}
        ${isSelected ? '' : isEnglish ? 'bg-gradient-to-b from-white to-blue-50/30' : 'bg-gradient-to-b from-white to-orange-50/30'}
      `}
      style={{
        borderColor: isSelected ? color : isEnglish ? `${color}60` : `${color}30`,
        borderWidth: isSelected ? '2.5px' : '1.5px',
        backgroundColor: isSelected ? color : undefined,
        color: isSelected ? '#FFFFFF' : '#1A1A2E',
        boxShadow: isSelected ? `0 8px 24px ${color}40` : undefined,
        ...(isSelected ? {} : {}),
      }}
    >
      {/* Type ribbon */}
      <span
        className={`
          absolute -top-0.5 -right-0.5 px-1.5 py-0.5 rounded-bl-lg rounded-tr-xl text-[10px] font-semibold
          ${isSelected ? 'bg-white/20 text-white/90' : isEnglish ? 'bg-primary-100 text-primary-600' : 'bg-warning-100 text-warning-600'}
        `}
      >
        {isEnglish ? 'EN' : '中'}
      </span>

      {/* Main text */}
      <span className={`leading-tight ${isSelected ? 'text-base' : 'text-sm sm:text-base'}`}>
        {block.text}
      </span>
    </button>
  )
}

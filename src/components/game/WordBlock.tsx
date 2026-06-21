'use client'

import { useState, useEffect, useRef } from 'react'
import type { Block } from '@/types'
import PixelExplosion from '@/components/ui/PixelExplosion'
import { playMatchSound } from '@/lib/sound'

// Scheme C: 6 distinct player × type colors
const BLOCK_COLORS: Record<number, Record<string, {
  base: string; text: string; bg: string; border: string
}>> = {
  1: {
    english:  { base: '#4B3FD9', text: '#D2CFFF', bg: 'rgba(75,63,217,0.12)',  border: 'rgba(75,63,217,0.4)' },
    chinese:  { base: '#8B64F0', text: '#E8D0FF', bg: 'rgba(139,100,240,0.09)', border: 'rgba(139,100,240,0.3)' },
  },
  2: {
    english:  { base: '#FF3B30', text: '#FFD0CE', bg: 'rgba(255,59,48,0.12)',  border: 'rgba(255,59,48,0.4)' },
    chinese:  { base: '#FF9500', text: '#FFE4B5', bg: 'rgba(255,149,0,0.1)',   border: 'rgba(255,149,0,0.35)' },
  },
  3: {
    english:  { base: '#06D6A0', text: '#B5FFE5', bg: 'rgba(6,214,160,0.12)',  border: 'rgba(6,214,160,0.4)' },
    chinese:  { base: '#00BED2', text: '#B8F0FF', bg: 'rgba(0,190,210,0.09)',  border: 'rgba(0,190,210,0.3)' },
  },
}

interface WordBlockProps {
  block: Block
  playerId: number
  onClick: () => void
  disabled: boolean
  fontSize: number
}

export default function WordBlock({ block, playerId, onClick, disabled, fontSize }: WordBlockProps) {
  const isMatched = block.status === 'matched'
  const isSelected = block.status === 'selected'
  const isWrong = block.status === 'wrong'

  const colors = BLOCK_COLORS[playerId]?.[block.type] ?? BLOCK_COLORS[1].english

  // Track transition to matched for explosion
  const [phase, setPhase] = useState<'normal' | 'vanishing' | 'exploding' | 'gone'>('normal')
  const prevMatched = useRef(isMatched)

  useEffect(() => {
    if (isMatched && !prevMatched.current) {
      playMatchSound()
      setPhase('vanishing')
      const t1 = setTimeout(() => setPhase('exploding'), 50)
      const t2 = setTimeout(() => setPhase('gone'), 800)
      return () => { clearTimeout(t1); clearTimeout(t2) }
    }
    prevMatched.current = isMatched
  }, [isMatched])

  const showContent = phase === 'normal' || phase === 'vanishing'
  const hideContainer = phase === 'gone'
  const exploding = phase === 'exploding'

  return (
    <button
      onClick={onClick}
      disabled={disabled || isMatched}
      className={`relative flex items-center justify-center text-center overflow-visible ${isWrong ? 'animate-shake' : ''}`}
      style={{
        fontFamily: '"Courier New", monospace',
        fontSize: `${fontSize}px`,
        fontWeight: 700,
        lineHeight: 1.2,
        wordBreak: 'break-all',
        padding: '1px 6px',
        cursor: isMatched ? 'default' : 'pointer',
        // Hide container after explosion; keep visible during explosion
        opacity: hideContainer ? 0 : 1,
        transform: isSelected ? 'scale(1.08)' : hideContainer ? 'scale(0.3) rotate(10deg)' : 'scale(1)',
        transition: hideContainer ? 'all 0.25s ease-out' : 'all 0.15s',
        zIndex: isSelected ? 5 : 0,
        // Content styles
        color: !showContent ? 'transparent' : isSelected ? '#fff' : isWrong ? '#FF3B30' : colors.text,
        background: !showContent
          ? 'transparent'
          : isSelected
            ? colors.base
            : isWrong
              ? 'rgba(255,59,48,0.12)'
              : colors.bg,
        border: !showContent
          ? '2px solid transparent'
          : isSelected
            ? `2px solid ${colors.base}`
            : isWrong
              ? '2px solid #FF3B30'
              : `2px solid ${colors.border}`,
        boxShadow: !showContent
          ? 'none'
          : isSelected
            ? `0 0 20px ${colors.base}70, 0 0 40px ${colors.base}40, 0 0 2px #fff`
            : isWrong
              ? '0 0 16px rgba(255,59,48,0.5), 0 0 2px #FF3B30'
              : 'none',
        textShadow: isSelected ? '0 0 4px rgba(255,255,255,0.5)' : 'none',
      }}
      onMouseEnter={(e) => {
        if (isSelected || isMatched || disabled) return
        e.currentTarget.style.background = colors.base + '25'
        e.currentTarget.style.borderColor = colors.base + '99'
        e.currentTarget.style.color = '#fff'
      }}
      onMouseLeave={(e) => {
        if (isSelected || isMatched || disabled) return
        e.currentTarget.style.background = colors.bg
        e.currentTarget.style.borderColor = colors.border
        e.currentTarget.style.color = colors.text
      }}
    >
      {showContent && (
        <span className="leading-tight px-0.5 line-clamp-2">
          {block.text}
        </span>
      )}

      {exploding && <PixelExplosion baseColor={colors.base} />}
    </button>
  )
}

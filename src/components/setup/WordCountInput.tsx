'use client'

import { useState, useEffect } from 'react'

interface WordCountInputProps {
  value: number
  max: number
  onChange: (n: number) => void
}

const MIN_WORDS = 10
const MAX_WORDS = 50

export default function WordCountInput({ value, max, onChange }: WordCountInputProps) {
  const [local, setLocal] = useState(String(value))

  useEffect(() => {
    setLocal(String(value))
  }, [value])

  const handleBlur = () => {
    let n = parseInt(local, 10)
    if (isNaN(n) || n < MIN_WORDS) {
      n = MIN_WORDS
    } else if (n > MAX_WORDS) {
      n = MAX_WORDS
    }
    if (max > 0 && n > max) {
      n = max
    }
    setLocal(String(n))
    onChange(n)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value
    setLocal(raw)
    const n = parseInt(raw, 10)
    if (!isNaN(n) && n >= MIN_WORDS && n <= MAX_WORDS && (max === 0 || n <= max)) {
      onChange(n)
    }
  }

  const effectiveMax = max > 0 ? Math.min(max, MAX_WORDS) : MAX_WORDS

  return (
    <div className="flex items-center gap-4">
      <input
        type="text"
        inputMode="numeric"
        value={local}
        onChange={handleChange}
        onBlur={handleBlur}
        className="text-center transition-all outline-none"
        style={{
          width: 88, height: 48,
          fontFamily: 'var(--font-press-start), monospace',
          fontSize: 16,
          color: '#fff',
          background: '#0a0a16',
          border: '2px solid #2a2a3a',
        }}
        onFocus={(e) => {
          e.target.style.borderColor = '#8B83F0'
          e.target.style.boxShadow = '0 0 10px rgba(139,131,240,0.3)'
        }}
        onBlurCapture={(e) => {
          e.currentTarget.style.borderColor = '#2a2a3a'
          e.currentTarget.style.boxShadow = 'none'
        }}
      />
      <span style={{ fontSize: 10, color: '#666', fontFamily: 'monospace' }}>
        {MIN_WORDS}–{effectiveMax}
      </span>
      {max > 0 && parseInt(local, 10) > max && (
        <span style={{ fontSize: 10, color: '#FCC364', textShadow: '0 0 6px rgba(252,195,100,0.3)' }}>
          词表仅有 {max} 词
        </span>
      )}
    </div>
  )
}

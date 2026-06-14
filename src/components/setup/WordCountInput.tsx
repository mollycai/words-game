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
    // Allow free typing (including empty)
    const raw = e.target.value
    setLocal(raw)
    // Immediately apply if it's a valid number in range
    const n = parseInt(raw, 10)
    if (!isNaN(n) && n >= MIN_WORDS && n <= MAX_WORDS && (max === 0 || n <= max)) {
      onChange(n)
    }
  }

  const effectiveMax = max > 0 ? Math.min(max, MAX_WORDS) : MAX_WORDS

  return (
    <div>
      <label className="block text-sm font-semibold mb-2">
        每人单词数（{MIN_WORDS}–{effectiveMax}）
      </label>
      <input
        type="number"
        min={MIN_WORDS}
        max={effectiveMax}
        value={local}
        onChange={handleChange}
        onBlur={handleBlur}
        className="w-32 h-14 text-center text-xl font-bold border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none"
      />
      {max > 0 && parseInt(local, 10) > max && (
        <p className="text-danger-500 text-xs mt-1">单词表仅有 {max} 个单词，请设置为 {max} 或以下</p>
      )}
    </div>
  )
}

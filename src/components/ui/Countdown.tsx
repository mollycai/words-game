'use client'

import { useEffect, useState } from 'react'

interface CountdownProps {
  from?: number
  onFinish: () => void
}

export default function Countdown({ from = 3, onFinish }: CountdownProps) {
  const [value, setValue] = useState(from)
  const [show, setShow] = useState(true)

  useEffect(() => {
    if (value <= 0) {
      setShow(false)
      onFinish()
      return
    }
    const timer = setTimeout(() => setValue((v) => v - 1), 1000)
    return () => clearTimeout(timer)
  }, [value, onFinish])

  if (!show) return null

  const display = value === 0 ? 'GO!' : String(value)

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 60,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(0,0,0,0.75)',
    }}>
      <span
        key={value}
        className="animate-pop-in"
        style={{
          fontFamily: 'var(--font-press-start), monospace',
          fontSize: value === 0 ? 96 : 120,
          fontWeight: 400,
          color: value === 0 ? '#4FE8BA' : '#fff',
          textShadow: value === 0
            ? '0 0 40px rgba(79,232,186,0.7), 0 0 80px rgba(79,232,186,0.4), 0 0 4px #fff'
            : '0 0 30px rgba(139,131,240,0.6), 0 0 60px rgba(139,131,240,0.3)',
        }}
      >
        {display}
      </span>
    </div>
  )
}

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
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50">
      <span
        key={value}
        className={`text-[120px] font-extrabold animate-pop-in ${
          value === 0 ? 'text-success-500' : 'text-white'
        }`}
      >
        {display}
      </span>
    </div>
  )
}

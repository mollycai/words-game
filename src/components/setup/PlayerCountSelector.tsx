'use client'

interface PlayerCountSelectorProps {
  value: number
  onChange: (n: number) => void
}

export default function PlayerCountSelector({ value, onChange }: PlayerCountSelectorProps) {
  return (
    <div className="flex items-center gap-3">
      {[1, 2, 3].map((n) => (
        <button
          key={n}
          onClick={() => onChange(n)}
          className="transition-all"
          style={{
            width: 52, height: 52,
            fontFamily: 'var(--font-press-start), monospace',
            fontSize: 18,
            color: value === n ? '#fff' : '#555',
            background: value === n ? 'rgba(139,131,240,0.12)' : '#0a0a16',
            border: value === n ? '2px solid #8B83F0' : '2px solid #2a2a3a',
            boxShadow: value === n ? '0 0 12px rgba(139,131,240,0.4), inset 0 0 8px rgba(139,131,240,0.1)' : 'none',
            cursor: 'pointer',
          }}
        >
          {n}
        </button>
      ))}
    </div>
  )
}

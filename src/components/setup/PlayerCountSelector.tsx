'use client'

interface PlayerCountSelectorProps {
  value: number
  onChange: (n: number) => void
}

export default function PlayerCountSelector({ value, onChange }: PlayerCountSelectorProps) {
  return (
    <div>
      <label className="block text-sm font-semibold mb-2">比赛人数</label>
      <div className="flex gap-2">
        {[1, 2, 3].map((n) => (
          <button
            key={n}
            onClick={() => onChange(n)}
            className={`w-16 h-16 rounded-xl text-2xl font-bold transition-colors ${
              value === n
                ? 'bg-primary-500 text-white shadow-md'
                : 'bg-white border-2 border-gray-200 hover:border-primary-300'
            }`}
          >
            {n}
          </button>
        ))}
      </div>
      <p className="text-xs text-muted mt-1">{value} 人比赛</p>
    </div>
  )
}

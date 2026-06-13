'use client'

interface WordCountInputProps {
  value: number
  max: number
  onChange: (n: number) => void
}

export default function WordCountInput({ value, max, onChange }: WordCountInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const n = parseInt(e.target.value, 10)
    if (!isNaN(n) && n >= 10) onChange(n)
  }

  return (
    <div>
      <label className="block text-sm font-semibold mb-2">每人单词数（≥10）</label>
      <input
        type="number"
        min={10}
        max={max || 100}
        value={value}
        onChange={handleChange}
        className="w-32 h-14 text-center text-xl font-bold border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none"
      />
      {max > 0 && value > max && (
        <p className="text-danger-500 text-xs mt-1">单词表仅有 {max} 个单词，请设置为 {max} 或以下</p>
      )}
    </div>
  )
}

'use client'

import { useRef, useState } from 'react'
import { parseExcelFile } from '@/lib/wordParser'
import type { WordPair } from '@/types'
import type { ParseError } from '@/lib/wordParser'

interface ExcelUploaderProps {
  onParsed: (pairs: WordPair[], fileName: string) => void
}

export default function ExcelUploader({ onParsed }: ExcelUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [fileName, setFileName] = useState('')
  const [total, setTotal] = useState(0)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setError('')
    setLoading(true)
    try {
      const result = await parseExcelFile(file)
      setFileName(file.name)
      setTotal(result.total)
      onParsed(result.pairs, file.name)
    } catch (err) {
      const pe = err as ParseError
      setError(pe.error || '解析失败')
      setFileName('')
      setTotal(0)
    }
    setLoading(false)
  }

  return (
    <div>
      <label className="block text-sm font-semibold mb-2">导入单词表 (Excel)</label>
      <input
        ref={inputRef}
        type="file"
        accept=".xlsx,.xls"
        onChange={handleFile}
        className="hidden"
      />
      <button
        onClick={() => inputRef.current?.click()}
        className="px-6 py-4 border-2 border-dashed border-primary-300 rounded-xl text-primary-500 hover:bg-primary-100 transition-colors font-semibold min-w-[44px] min-h-[44px]"
      >
        {loading ? '解析中...' : fileName ? `📄 ${fileName}` : '📁 点击上传 Excel 文件'}
      </button>
      {total > 0 && <p className="text-success-500 text-xs mt-1">✅ 已导入 {total} 个单词</p>}
      {error && <p className="text-danger-500 text-xs mt-1">❌ {error}</p>}
    </div>
  )
}

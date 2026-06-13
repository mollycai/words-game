'use client'

import { useRef, useState, useEffect } from 'react'
import { parseExcelFile, downloadTemplate } from '@/lib/wordParser'
import type { WordPair } from '@/types'
import type { ParseError } from '@/lib/wordParser'

interface ExcelUploaderProps {
  hasExisting: boolean
  existingFileName: string
  existingTotal: number
  onParsed: (pairs: WordPair[], fileName: string) => void
  onClear: () => void
}

export default function ExcelUploader({
  hasExisting, existingFileName, existingTotal,
  onParsed, onClear,
}: ExcelUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [fileName, setFileName] = useState('')
  const [total, setTotal] = useState(0)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Sync external state when hydrated
  useEffect(() => {
    if (hasExisting && fileName === '' && total === 0) {
      setFileName(existingFileName)
      setTotal(existingTotal)
    }
  }, [hasExisting, existingFileName, existingTotal, fileName, total])

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

  const handleDelete = () => {
    setFileName('')
    setTotal(0)
    setError('')
    onClear()
  }

  const showFile = fileName || (hasExisting ? existingFileName : '')

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

      {showFile ? (
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-primary-50 border border-primary-200 rounded-xl px-4 py-3 text-sm">
            <p className="font-semibold text-primary-700">📄 {showFile}</p>
            <p className="text-primary-500 text-xs mt-0.5">
              {total > 0 ? `已解析 ${total} 个单词` : `已缓存 ${existingTotal} 个单词`}
            </p>
          </div>
          <button
            onClick={handleDelete}
            className="flex-shrink-0 w-10 h-10 rounded-xl bg-danger-100 text-danger-500 hover:bg-danger-200 transition-colors flex items-center justify-center text-lg"
            title="删除单词表"
          >
            🗑
          </button>
        </div>
      ) : (
        <button
          onClick={() => inputRef.current?.click()}
          className="w-full px-6 py-4 border-2 border-dashed border-primary-300 rounded-xl text-primary-500 hover:bg-primary-100 transition-colors font-semibold min-w-[44px] min-h-[44px]"
        >
          {loading ? '⏳ 解析中...' : '📁 点击上传 Excel 文件'}
        </button>
      )}

      {!showFile && total > 0 && <p className="text-success-500 text-xs mt-1">✅ 已导入 {total} 个单词</p>}
      {error && <p className="text-danger-500 text-xs mt-1">❌ {error}</p>}

      <p className="text-xs text-muted mt-2">
        还没有单词表？{' '}
        <button
          onClick={downloadTemplate}
          className="text-primary-500 underline hover:text-primary-700 font-medium"
        >
          下载单词表模板
        </button>
      </p>
    </div>
  )
}

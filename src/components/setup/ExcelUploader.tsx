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
      <input
        ref={inputRef}
        type="file"
        accept=".xlsx,.xls"
        onChange={handleFile}
        className="hidden"
      />

      {showFile ? (
        <div className="flex-1">
          <div
            style={{
              border: '2px solid rgba(79,232,186,0.2)',
              padding: '12px 14px',
              background: 'rgba(79,232,186,0.04)',
            }}
          >
            <div className="flex items-center gap-3">
              <span style={{ fontSize: 20 }}>📄</span>
              <div className="flex-1 min-w-0">
                <div style={{
                  fontFamily: '"Courier New", monospace',
                  fontSize: 11, fontWeight: 700,
                  color: '#4FE8BA',
                  textShadow: '0 0 6px rgba(79,232,186,0.3)',
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>
                  {showFile}
                </div>
                <div style={{ fontSize: 10, color: '#888', marginTop: 2 }}>
                  {total > 0 ? `已解析 ${total} 个单词` : `已缓存 ${existingTotal} 个单词`}
                </div>
              </div>
              <button
                onClick={handleDelete}
                style={{
                  width: 36, height: 36,
                  background: 'transparent',
                  border: '2px solid rgba(255,59,48,0.2)',
                  color: '#FF3B30',
                  fontFamily: '"Courier New", monospace',
                  fontSize: 14, fontWeight: 700,
                  cursor: 'pointer',
                  flexShrink: 0,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#FF3B30'
                  e.currentTarget.style.boxShadow = '0 0 8px rgba(255,59,48,0.3)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255,59,48,0.2)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
                title="删除单词表"
              >
                ✕
              </button>
            </div>
          </div>
          {error && (
            <p style={{ fontSize: 10, color: '#FF3B30', marginTop: 6, textShadow: '0 0 6px rgba(255,59,48,0.3)' }}>
              ❌ {error}
            </p>
          )}
        </div>
      ) : (
        <div>
          <button
            onClick={() => inputRef.current?.click()}
            className="w-full flex flex-col items-center gap-1 transition-all"
            style={{
              border: '2px dashed #333',
              padding: '18px 16px',
              background: 'transparent',
              cursor: 'pointer',
              minHeight: 72,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#FCC364'
              e.currentTarget.style.boxShadow = '0 0 10px rgba(252,195,100,0.12)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#333'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            <span style={{ fontSize: 24, opacity: 0.5 }}>📁</span>
            <span style={{
              fontFamily: '"Courier New", monospace',
              fontSize: 11, fontWeight: 700,
              color: '#aaa',
              letterSpacing: 1,
            }}>
              {loading ? '解析中...' : '点击上传 Excel 文件'}
            </span>
            <span style={{ fontSize: 10, color: '#666' }}>.xlsx / .xls</span>
          </button>
          {error && (
            <p style={{ fontSize: 10, color: '#FF3B30', marginTop: 6, textShadow: '0 0 6px rgba(255,59,48,0.3)' }}>
              ❌ {error}
            </p>
          )}
        </div>
      )}

      <p style={{ fontSize: 10, color: '#555', marginTop: 8 }}>
        还没有单词表？{' '}
        <button
          onClick={downloadTemplate}
          style={{
            color: '#8B83F0',
            textDecoration: 'underline',
            background: 'none', border: 'none',
            cursor: 'pointer', fontSize: 10,
            fontFamily: 'monospace',
          }}
        >
          下载模板
        </button>
      </p>
    </div>
  )
}

'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useSetupStore } from '@/stores/setupStore'
import PlayerCountSelector from '@/components/setup/PlayerCountSelector'
import WordCountInput from '@/components/setup/WordCountInput'
import ExcelUploader from '@/components/setup/ExcelUploader'

const FLOATING_CHARS = [
  { char: 'S', top: '6%',  left: '6%',  rotate: '-8deg', size: '80px', glow: 'rgba(75,63,217,0.3)' },
  { char: 'E', top: '14%', right: '10%', rotate: '10deg', size: '64px', glow: 'rgba(6,214,160,0.25)' },
  { char: 'T', top: '45%', left: '4%',  rotate: '5deg',  size: '72px', glow: 'rgba(255,73,48,0.2)' },
  { char: 'U', top: '60%', right: '7%', rotate: '-6deg', size: '56px', glow: 'rgba(245,166,35,0.25)' },
  { char: 'P', top: '78%', left: '12%',  rotate: '12deg', size: '68px', glow: 'rgba(75,63,217,0.25)' },
  { char: 'C', top: '88%', right: '14%', rotate: '-4deg', size: '52px', glow: 'rgba(6,214,160,0.2)' },
  { char: 'F', top: '30%', left: '90%', rotate: '8deg',  size: '60px', glow: 'rgba(255,73,48,0.2)' },
  { char: 'G', top: '72%', right: '88%', rotate: '-10deg',size: '48px', glow: 'rgba(245,166,35,0.2)' },
]

export default function SetupPage() {
  const router = useRouter()
  const {
    playerCount, wordCount, wordPairs, sourceFileName, hydrated,
    hydrate, setPlayerCount, setWordCount, setWordPairs, clearWordPairs,
  } = useSetupStore()

  useEffect(() => {
    hydrate()
  }, [hydrate])

  const canStart = wordPairs.length > 0 && wordPairs.length >= wordCount && wordCount >= 10

  const handleStart = () => {
    if (!canStart) return
    router.push('/game')
  }

  if (!hydrated) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center" style={{ background: '#0a0a14' }}>
        <div className="flex flex-col items-center gap-4">
          <div style={{
            width: 32, height: 32,
            border: '3px solid rgba(139,131,240,0.15)',
            borderTopColor: '#8B83F0',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
          }} />
          <p style={{ color: '#666', fontSize: 12, fontFamily: 'monospace' }}>加载中...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden" style={{ background: '#0a0a14' }}>
      {/* Decorative floating letters */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
        {FLOATING_CHARS.map((item, i) => (
          <span
            key={i}
            className="absolute font-bold animate-neon-flicker"
            style={{
              top: item.top,
              [item.left ? 'left' : 'right']: item.left || item.right,
              transform: `rotate(${item.rotate})`,
              color: 'rgba(255,255,255,0.04)',
              textShadow: `0 0 8px ${item.glow}, 0 0 16px ${item.glow}`,
              fontFamily: 'var(--font-press-start), monospace',
              fontSize: item.size,
            }}
          >
            {item.char}
          </span>
        ))}
      </div>

      {/* Main CRT panel */}
      <div className="relative z-10 w-full" style={{ maxWidth: 520 }}>
        <div
          className="relative overflow-hidden"
          style={{
            background: '#0d0d1a',
            border: '2px solid rgba(139,131,240,0.27)',
            boxShadow: 'inset 0 0 40px rgba(0,0,0,0.5), 0 0 20px rgba(75,63,217,0.08)',
          }}
        >
          {/* CRT scanlines overlay */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.08) 0px, transparent 2px, rgba(0,0,0,0.08) 4px)',
            pointerEvents: 'none', zIndex: 10,
          }} />

          {/* Header bar */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '10px 14px',
            borderBottom: '1px solid rgba(139,131,240,0.18)',
            background: 'rgba(75,63,217,0.08)',
            position: 'relative', zIndex: 1,
          }}>
            <span style={{
              width: 7, height: 7,
              background: '#8B83F0',
              boxShadow: '0 0 8px #8B83F0',
              flexShrink: 0,
            }} />
            <span style={{
              fontFamily: '"Courier New", monospace',
              fontSize: 12, fontWeight: 700,
              color: '#8B83F0',
              letterSpacing: 1,
              textShadow: '0 0 6px rgba(139,131,240,0.4)',
            }}>
              GAME SETTINGS
            </span>
          </div>

          {/* Settings rows */}
          <div className="relative z-10">
            {/* Row: Player count */}
            <div style={{
              display: 'flex', alignItems: 'center',
              padding: '16px 18px',
              borderBottom: '1px solid rgba(139,131,240,0.06)',
              gap: 20,
            }}>
              <span style={{
                width: 130, flexShrink: 0,
                fontFamily: '"Courier New", monospace',
                fontSize: 11, fontWeight: 700,
                color: '#aaa',
                letterSpacing: 1,
              }}>
                PLAYERS
              </span>
              <div className="flex-1">
                <PlayerCountSelector value={playerCount} onChange={setPlayerCount} />
              </div>
            </div>

            {/* Row: Word count */}
            <div style={{
              display: 'flex', alignItems: 'center',
              padding: '16px 18px',
              borderBottom: '1px solid rgba(139,131,240,0.06)',
              gap: 20,
            }}>
              <span style={{
                width: 130, flexShrink: 0,
                fontFamily: '"Courier New", monospace',
                fontSize: 11, fontWeight: 700,
                color: '#aaa',
                letterSpacing: 1,
              }}>
                WORDS/EACH
              </span>
              <div className="flex-1">
                <WordCountInput value={wordCount} max={wordPairs.length} onChange={setWordCount} />
              </div>
            </div>

            {/* Row: Word list */}
            <div style={{
              display: 'flex', alignItems: 'flex-start',
              padding: '16px 18px',
              borderBottom: '1px solid rgba(139,131,240,0.06)',
              gap: 20,
            }}>
              <span style={{
                width: 130, flexShrink: 0,
                fontFamily: '"Courier New", monospace',
                fontSize: 11, fontWeight: 700,
                color: '#aaa',
                letterSpacing: 1,
                paddingTop: 6,
              }}>
                WORD LIST
              </span>
              <div className="flex-1">
                <ExcelUploader
                  hasExisting={wordPairs.length > 0}
                  existingFileName={sourceFileName}
                  existingTotal={wordPairs.length}
                  onParsed={setWordPairs}
                  onClear={clearWordPairs}
                />
              </div>
            </div>

            {/* Row: Summary */}
            <div style={{
              display: 'flex', alignItems: 'center',
              padding: '16px 18px',
              borderBottom: '1px solid rgba(139,131,240,0.06)',
              gap: 20,
            }}>
              <span style={{
                width: 130, flexShrink: 0,
                fontFamily: '"Courier New", monospace',
                fontSize: 11, fontWeight: 700,
                color: '#888',
                letterSpacing: 1,
              }}>
                STATUS
              </span>
              <div className="flex-1" style={{
                background: 'rgba(139,131,240,0.04)',
                border: '1px solid rgba(139,131,240,0.06)',
                padding: '10px 14px',
                fontFamily: 'monospace',
                fontSize: 11,
                color: '#999',
              }}>
                <span style={{ color: '#666' }}>
                  {playerCount}人 · {wordCount}词/人
                </span>
                <span style={{ marginLeft: 12, color: wordPairs.length > 0 ? '#4FE8BA' : '#555' }}>
                  {wordPairs.length > 0 ? `词表: ${wordPairs.length}词` : '未导入单词表'}
                </span>
              </div>
            </div>

            {/* Row: Actions */}
            <div style={{
              display: 'flex', alignItems: 'center',
              padding: '20px 18px',
              gap: 14,
            }}>
              <span style={{ width: 130, flexShrink: 0 }} />
              <div className="flex-1 flex gap-3">
                <Link
                  href="/"
                  className="flex-1 text-center transition-all"
                  style={{
                    padding: '13px 0',
                    fontFamily: '"Courier New", monospace',
                    fontSize: 12, fontWeight: 700,
                    letterSpacing: 1,
                    color: '#888',
                    background: 'transparent',
                    border: '2px solid #2a2a3a',
                    textDecoration: 'none',
                    display: 'block',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#555'
                    e.currentTarget.style.color = '#aaa'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#2a2a3a'
                    e.currentTarget.style.color = '#888'
                  }}
                >
                  ← 返回
                </Link>
                <button
                  onClick={handleStart}
                  disabled={!canStart}
                  className="flex-1 relative overflow-hidden transition-all"
                  style={{
                    padding: '13px 0',
                    fontFamily: '"Courier New", monospace',
                    fontSize: 13, fontWeight: 700,
                    letterSpacing: 2,
                    color: canStart ? '#fff' : '#444',
                    background: 'transparent',
                    border: canStart ? '2px solid #8B83F0' : '2px solid #2a2a3a',
                    boxShadow: canStart
                      ? 'inset 0 0 20px rgba(75,63,217,0.15), 0 0 12px rgba(75,63,217,0.35), 0 0 2px #8B83F0'
                      : 'none',
                    cursor: canStart ? 'pointer' : 'not-allowed',
                  }}
                >
                  {canStart && (
                    <span style={{
                      position: 'absolute', inset: 0,
                      background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.1) 0px, transparent 1px, rgba(0,0,0,0.1) 2px)',
                      pointerEvents: 'none',
                    }} />
                  )}
                  <span style={{ position: 'relative', zIndex: 1 }}>⚡ 开始比赛</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Validation messages */}
        {!canStart && wordPairs.length > 0 && (
          <p className="text-center mt-3" style={{
            fontSize: 10, color: '#FCC364',
            textShadow: '0 0 6px rgba(252,195,100,0.3)',
            fontFamily: 'monospace',
          }}>
            {wordPairs.length < wordCount
              ? `词表仅有 ${wordPairs.length} 词，请减少每人单词数`
              : wordCount < 10
                ? '单词数量至少为 10'
                : ''}
          </p>
        )}
        {!canStart && wordPairs.length === 0 && (
          <p className="text-center mt-3" style={{
            fontSize: 10, color: '#555',
            fontFamily: 'monospace',
          }}>
            请先导入单词表
          </p>
        )}

        {/* Back to home */}
        <div className="text-center mt-8">
          <Link href="/" style={{
            fontSize: 10, color: '#555',
            fontFamily: 'monospace',
            textDecoration: 'none',
          }}>
            适用于课堂教学 · 互动白板 · 触屏设备
          </Link>
        </div>
      </div>
    </main>
  )
}

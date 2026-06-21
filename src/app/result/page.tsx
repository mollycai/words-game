'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useGameStore } from '@/stores/gameStore'
import { rankPlayers } from '@/lib/gameLogic'
import type { PlayerState } from '@/types'
import Podium from '@/components/result/Podium'
import RankCard from '@/components/result/RankCard'

const FLOATING_CHARS = [
  { char: 'W', top: '8%',  left: '8%',  rotate: '-10deg', size: '72px', glow: 'rgba(245,166,35,0.25)' },
  { char: 'I', top: '15%', right: '10%', rotate: '6deg',   size: '56px', glow: 'rgba(6,214,160,0.2)' },
  { char: 'N', top: '40%', left: '5%',  rotate: '12deg',   size: '64px', glow: 'rgba(255,73,48,0.2)' },
  { char: 'V', top: '55%', right: '8%', rotate: '-8deg',   size: '52px', glow: 'rgba(75,63,217,0.25)' },
  { char: 'C', top: '75%', left: '10%', rotate: '5deg',    size: '60px', glow: 'rgba(6,214,160,0.2)' },
  { char: 'T', top: '85%', right: '12%',rotate: '-4deg',   size: '48px', glow: 'rgba(245,166,35,0.2)' },
]

export default function ResultPage() {
  const router = useRouter()
  const players = useGameStore((s) => s.players)
  const reset = useGameStore((s) => s.reset)
  const [ranked, setRanked] = useState<PlayerState[]>([])
  const hasLoaded = useRef(false)

  useEffect(() => {
    if (players.length === 0 && !hasLoaded.current) {
      router.replace('/')
      return
    }
    if (players.length > 0) {
      hasLoaded.current = true
      setRanked(rankPlayers(players))
    }
  }, [players, router])

  const handlePlayAgain = () => {
    reset()
    router.push('/game')
  }

  const handleBackToSetup = () => {
    reset()
    router.push('/setup')
  }

  if (ranked.length === 0) return null

  const champion = ranked[0]
  const hasChampion = champion && !champion.quit

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
      <div className="relative z-10 w-full" style={{ maxWidth: 480 }}>
        <div
          className="relative overflow-hidden"
          style={{
            background: '#0d0d1a',
            border: '2px solid rgba(139,131,240,0.27)',
            boxShadow: 'inset 0 0 40px rgba(0,0,0,0.5), 0 0 20px rgba(75,63,217,0.08)',
          }}
        >
          {/* CRT scanlines */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.08) 0px, transparent 2px, rgba(0,0,0,0.08) 4px)',
            pointerEvents: 'none', zIndex: 10,
          }} />

          {/* Header */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '10px 14px',
            borderBottom: '1px solid rgba(139,131,240,0.18)',
            background: 'rgba(75,63,217,0.08)',
            position: 'relative', zIndex: 1,
          }}>
            <span style={{
              width: 7, height: 7,
              background: '#FCC364',
              boxShadow: '0 0 8px #FCC364',
              flexShrink: 0,
            }} />
            <span style={{
              fontFamily: '"Courier New", monospace',
              fontSize: 12, fontWeight: 700,
              color: '#FCC364',
              letterSpacing: 1,
              textShadow: '0 0 6px rgba(252,195,100,0.4)',
            }}>
              RESULTS
            </span>
          </div>

          {/* Body */}
          <div style={{ padding: '28px 24px 24px', position: 'relative', zIndex: 1 }}>
            {/* Podium / Champion */}
            {hasChampion ? (
              <div className="mb-8">
                <Podium champion={champion} />
              </div>
            ) : (
              <div className="text-center mb-8" style={{
                fontFamily: '"Courier New", monospace',
                fontSize: 12, fontWeight: 700,
                color: '#666',
                letterSpacing: 1,
              }}>
                所有选手均已弃权
              </div>
            )}

            {/* Rank cards */}
            <div className="space-y-2 mb-8">
              {ranked.map((player, i) => (
                <RankCard key={player.id} player={player} rank={i + 1} />
              ))}
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleBackToSetup}
                style={{
                  flex: 1,
                  padding: '13px 0',
                  fontFamily: '"Courier New", monospace',
                  fontSize: 12, fontWeight: 700,
                  letterSpacing: 1,
                  color: '#888',
                  background: 'transparent',
                  border: '2px solid #2a2a3a',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
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
                ← 返回设置
              </button>
              <button
                onClick={handlePlayAgain}
                style={{
                  flex: 1,
                  padding: '13px 0',
                  fontFamily: '"Courier New", monospace',
                  fontSize: 13, fontWeight: 700,
                  letterSpacing: 2,
                  color: '#fff',
                  background: 'transparent',
                  border: '2px solid #8B83F0',
                  boxShadow: 'inset 0 0 20px rgba(75,63,217,0.15), 0 0 12px rgba(75,63,217,0.35), 0 0 2px #8B83F0',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = 'inset 0 0 30px rgba(75,63,217,0.25), 0 0 20px rgba(75,63,217,0.5), 0 0 4px #8B83F0'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = 'inset 0 0 20px rgba(75,63,217,0.15), 0 0 12px rgba(75,63,217,0.35), 0 0 2px #8B83F0'
                }}
              >
                <span style={{
                  position: 'absolute', inset: 0,
                  background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.1) 0px, transparent 1px, rgba(0,0,0,0.1) 2px)',
                  pointerEvents: 'none',
                }} />
                <span style={{ position: 'relative', zIndex: 1 }}>⚡ 再来一局</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
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

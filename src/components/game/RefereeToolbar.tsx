'use client'

import { useState } from 'react'
import type { PlayerState, GameStatus } from '@/types'
import Modal from '@/components/ui/Modal'
import { useButtonSound } from '@/lib/useButtonSound'

interface RefereeToolbarProps {
  status: GameStatus
  players: PlayerState[]
  onPause: () => void
  onResume: () => void
  onQuitPlayer: (playerId: number) => void
  onReturn: () => void
}

export default function RefereeToolbar({ status, players, onPause, onResume, onQuitPlayer, onReturn }: RefereeToolbarProps) {
  const [quitTarget, setQuitTarget] = useState<number | null>(null)
  const [showReturnModal, setShowReturnModal] = useState(false)
  const { playClick } = useButtonSound()
  const isPlaying = status === 'playing'
  const isPaused = status === 'paused'
  const canAct = isPlaying || isPaused

  return (
    <>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '8px 14px',
        background: '#0d0d1a',
        borderBottom: '1px solid #1a1a2e',
        position: 'relative', zIndex: 40,
        flexWrap: 'wrap',
      }}>
        {/* Status indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{
            width: 8, height: 8,
            borderRadius: '50%',
            background: isPlaying ? '#4FE8BA' : isPaused ? '#FCC364' : '#555',
            boxShadow: isPlaying
              ? '0 0 10px #4FE8BA'
              : isPaused
                ? '0 0 10px #FCC364'
                : 'none',
            animation: isPlaying ? 'pulse 1.2s infinite' : 'none',
          }} />
          <span style={{
            fontFamily: 'var(--font-press-start), monospace',
            fontSize: 10,
            color: isPlaying ? '#4FE8BA' : isPaused ? '#FCC364' : '#666',
            textShadow: isPlaying
              ? '0 0 10px rgba(79,232,186,0.5)'
              : isPaused
                ? '0 0 10px rgba(252,195,100,0.4)'
                : 'none',
            letterSpacing: 1,
          }}>
            {isPlaying ? 'IN GAME' : isPaused ? 'PAUSED' : 'READY'}
          </span>
        </div>

        {/* Separator */}
        <span style={{ width: 1, height: 22, background: '#1a1a30' }} />

        {/* Pause / Resume */}
        {canAct && (
          <button
            onClick={() => { playClick(); isPaused ? onResume() : onPause() }}
            style={{
              padding: '6px 14px',
              fontFamily: 'var(--font-press-start), monospace',
              fontSize: 9,
              letterSpacing: 1,
              color: isPaused ? '#4FE8BA' : '#FCC364',
              background: 'transparent',
              border: `1px solid ${isPaused ? 'rgba(79,232,186,0.35)' : 'rgba(252,195,100,0.35)'}`,
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = isPaused
                ? '0 0 12px rgba(79,232,186,0.35)'
                : '0 0 12px rgba(252,195,100,0.35)'
            }}
            onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none' }}
          >
            {isPaused ? '▶ RESUME' : '⏸ PAUSE'}
          </button>
        )}

        {/* Quit player buttons — red by default */}
        {players.map((p) => (
          <button
            key={p.id}
            disabled={!canAct || p.finished}
            onClick={() => { playClick(); setQuitTarget(p.id) }}
            style={{
              padding: '6px 14px',
              fontFamily: 'var(--font-press-start), monospace',
              fontSize: 9,
              letterSpacing: 1,
              color: canAct && !p.finished ? '#FF3B30' : '#552222',
              background: canAct && !p.finished ? 'rgba(255,59,48,0.06)' : 'transparent',
              border: canAct && !p.finished ? '1px solid rgba(255,59,48,0.3)' : '1px solid #2a1a1a',
              cursor: canAct && !p.finished ? 'pointer' : 'default',
              transition: 'all 0.15s',
              opacity: canAct && !p.finished ? 1 : 0.35,
            }}
            onMouseEnter={(e) => {
              if (!canAct || p.finished) return
              e.currentTarget.style.borderColor = '#FF3B30'
              e.currentTarget.style.background = 'rgba(255,59,48,0.12)'
              e.currentTarget.style.boxShadow = '0 0 10px rgba(255,59,48,0.3)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255,59,48,0.3)'
              e.currentTarget.style.background = 'rgba(255,59,48,0.06)'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            {p.name} QUIT
          </button>
        ))}

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Return button */}
        <button
          onClick={() => { playClick(); setShowReturnModal(true) }}
          style={{
            padding: '6px 14px',
            fontFamily: 'var(--font-press-start), monospace',
            fontSize: 9,
            letterSpacing: 1,
            color: '#555',
            background: 'transparent',
            border: '1px solid #2a2a3a',
            cursor: 'pointer',
            transition: 'all 0.15s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#666'
            e.currentTarget.style.color = '#aaa'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#2a2a3a'
            e.currentTarget.style.color = '#555'
          }}
        >
          ← BACK
        </button>
      </div>

      {/* Quit confirmation modal */}
      <Modal
        open={quitTarget !== null}
        title={`${players.find(p => p.id === quitTarget)?.name ?? ''} 放弃比赛`}
        message={`确定要让${players.find(p => p.id === quitTarget)?.name ?? ''}放弃吗？其成绩将不计入排名。`}
        confirmText="确认放弃"
        variant="danger"
        onConfirm={() => { if (quitTarget !== null) { onQuitPlayer(quitTarget); setQuitTarget(null) } }}
        onCancel={() => setQuitTarget(null)}
      />

      {/* Return confirmation modal */}
      <Modal
        open={showReturnModal}
        title="返回设置"
        message="比赛进行中，确定要退出吗？当前比赛数据将不会保存。"
        confirmText="确认退出"
        variant="danger"
        onConfirm={() => { setShowReturnModal(false); onReturn() }}
        onCancel={() => setShowReturnModal(false)}
      />
    </>
  )
}

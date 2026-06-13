'use client'

import { useState } from 'react'
import type { PlayerState, GameStatus } from '@/types'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'

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
  const isPlaying = status === 'playing'
  const isPaused = status === 'paused'
  const canAct = isPlaying || isPaused

  return (
    <>
      <div className="relative z-40 bg-white/90 backdrop-blur border-b border-gray-200 px-4 py-3 flex items-center gap-3 flex-wrap shadow-sm">
        {/* Game status indicator */}
        <div className="flex items-center gap-2 mr-2">
          <div className={`w-2.5 h-2.5 rounded-full ${isPlaying ? 'bg-success-500 animate-pulse' : isPaused ? 'bg-warning-500' : 'bg-gray-300'}`} />
          <span className="text-sm font-semibold text-text-main">
            {isPlaying ? '比赛中' : isPaused ? '已暂停' : '准备中'}
          </span>
        </div>

        <div className="w-px h-6 bg-gray-200" />

        {/* Pause / Resume */}
        {canAct && (
          isPaused
            ? <Button variant="success" size="sm" onClick={onResume}>▶ 继续比赛</Button>
            : <Button variant="warning" size="sm" onClick={onPause}>⏸ 暂停</Button>
        )}

        {/* Quit player buttons */}
        {players.map((p) => (
          <Button
            key={p.id}
            variant="ghost"
            size="sm"
            className="!border-gray-300 !text-text-main hover:!bg-danger-50 hover:!border-danger-300 hover:!text-danger-500"
            disabled={!canAct || p.finished}
            onClick={() => setQuitTarget(p.id)}
          >
            🏳 {p.name}放弃
          </Button>
        ))}

        <div className="flex-1" />

        <Button variant="ghost" size="sm" className="!border-gray-300 !text-text-main" onClick={() => setShowReturnModal(true)}>
          ↩ 返回
        </Button>
      </div>

      {/* Quit confirmation */}
      <Modal
        open={quitTarget !== null}
        title={`${players.find(p => p.id === quitTarget)?.name ?? ''} 放弃比赛`}
        message={`确定要让${players.find(p => p.id === quitTarget)?.name ?? ''}放弃吗？其成绩将不计入排名。`}
        confirmText="确认放弃"
        variant="danger"
        onConfirm={() => { if (quitTarget !== null) { onQuitPlayer(quitTarget); setQuitTarget(null) } }}
        onCancel={() => setQuitTarget(null)}
      />

      {/* Return confirmation */}
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

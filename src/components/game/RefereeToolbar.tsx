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
      <div className="bg-gray-800 text-white px-4 py-2 flex items-center gap-2 flex-wrap rounded-b-xl">
        {/* Pause / Resume */}
        {canAct && (
          isPaused
            ? <Button variant="warning" size="sm" onClick={onResume}>▶ 继续</Button>
            : <Button variant="warning" size="sm" onClick={onPause}>⏸ 暂停</Button>
        )}

        {/* Quit player buttons */}
        {players.map((p) => (
          <Button
            key={p.id}
            variant="ghost"
            size="sm"
            className="text-white border-gray-500 hover:bg-gray-700"
            disabled={!canAct || p.finished}
            onClick={() => setQuitTarget(p.id)}
          >
            🏳 {p.name}放弃
          </Button>
        ))}

        <div className="flex-1" />

        <Button variant="ghost" size="sm" className="text-white border-gray-500 hover:bg-gray-700" onClick={() => setShowReturnModal(true)}>
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

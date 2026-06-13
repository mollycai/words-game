'use client'

import { useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useGameStore } from '@/stores/gameStore'
import { useSetupStore } from '@/stores/setupStore'
import Countdown from '@/components/ui/Countdown'
import RefereeToolbar from './RefereeToolbar'
import PlayerArea from './PlayerArea'
import type { Block } from '@/types'

export default function GameLayout() {
  const router = useRouter()
  const rafRef = useRef<number>(0)
  const lastTimeRef = useRef<number>(0)

  const {
    status, players, countdownValue,
    initGame, startCountdown, finishCountdown,
    pauseGame, resumeGame, quitPlayer,
    selectBlock, tickPlayer,
    reset,
  } = useGameStore()

  const { playerCount, wordCount, wordPairs } = useSetupStore()

  // Initialize game on mount
  useEffect(() => {
    if (wordPairs.length === 0) {
      router.replace('/setup')
      return
    }
    initGame(playerCount, wordCount, wordPairs)
    // Start countdown after a brief moment so the UI renders
    const t = setTimeout(() => startCountdown(), 300)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Timer loop via requestAnimationFrame
  const timerLoop = useCallback((time: number) => {
    if (lastTimeRef.current === 0) lastTimeRef.current = time
    const delta = time - lastTimeRef.current
    lastTimeRef.current = time

    const st = useGameStore.getState()
    if (st.status === 'playing') {
      st.players.forEach((p) => {
        if (!p.finished) tickPlayer(p.id, delta)
      })
    }

    rafRef.current = requestAnimationFrame(timerLoop)
  }, [tickPlayer])

  useEffect(() => {
    if (status === 'playing') {
      lastTimeRef.current = 0
      rafRef.current = requestAnimationFrame(timerLoop)
    }
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [status, timerLoop])

  // Navigate to result when game finishes
  useEffect(() => {
    if (status === 'finished') {
      router.push('/result')
    }
  }, [status, router])

  const handleBlockClick = (playerId: number, block: Block) => {
    selectBlock(playerId, block)
  }

  const handleReturn = () => {
    reset()
    router.push('/setup')
  }

  return (
    <div className="min-h-screen flex flex-col bg-surface-page">
      {/* Countdown overlay */}
      {status === 'countdown' && (
        <Countdown from={countdownValue} onFinish={finishCountdown} />
      )}

      {/* Pause overlay */}
      {status === 'paused' && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/40">
          <span className="text-white text-4xl font-extrabold animate-pop-in">⏸ 已暂停</span>
        </div>
      )}

      {/* Referee toolbar */}
      <RefereeToolbar
        status={status}
        players={players}
        onPause={pauseGame}
        onResume={resumeGame}
        onQuitPlayer={quitPlayer}
        onReturn={handleReturn}
      />

      {/* Player areas */}
      <div className="flex-1 flex">
        {players.map((player) => (
          <PlayerArea
            key={player.id}
            player={player}
            disabled={status !== 'playing' || player.finished}
            onBlockClick={handleBlockClick}
          />
        ))}
      </div>
    </div>
  )
}

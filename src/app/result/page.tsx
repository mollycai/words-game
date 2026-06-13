'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useGameStore } from '@/stores/gameStore'
import { rankPlayers } from '@/lib/gameLogic'
import type { PlayerState } from '@/types'
import Button from '@/components/ui/Button'
import Podium from '@/components/result/Podium'
import RankCard from '@/components/result/RankCard'

export default function ResultPage() {
  const router = useRouter()
  const players = useGameStore((s) => s.players)
  const reset = useGameStore((s) => s.reset)
  const [ranked, setRanked] = useState<PlayerState[]>([])
  const hasLoaded = useRef(false)

  useEffect(() => {
    // Only redirect if we never had results (direct access to /result)
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
    <main className="min-h-screen flex flex-col items-center justify-center p-6 space-y-8">
      <h1 className="text-3xl font-extrabold">🎉 比赛结束</h1>

      {hasChampion && <Podium champion={champion} />}

      {!hasChampion && (
        <p className="text-muted text-lg">所有选手均已弃权</p>
      )}

      <div className="w-full max-w-sm space-y-3">
        {ranked.map((player, i) => (
          <RankCard key={player.id} player={player} rank={i + 1} />
        ))}
      </div>

      <div className="flex gap-3">
        <Button variant="ghost" onClick={handleBackToSetup}>返回设置</Button>
        <Button onClick={handlePlayAgain}>再来一局</Button>
      </div>
    </main>
  )
}

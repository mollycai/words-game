'use client'

import dynamic from 'next/dynamic'

const GameLayout = dynamic(() => import('@/components/game/GameLayout'), { ssr: false })

export default function GamePage() {
  return <GameLayout />
}

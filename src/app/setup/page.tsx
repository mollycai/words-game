'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSetupStore } from '@/stores/setupStore'
import Button from '@/components/ui/Button'
import PlayerCountSelector from '@/components/setup/PlayerCountSelector'
import WordCountInput from '@/components/setup/WordCountInput'
import ExcelUploader from '@/components/setup/ExcelUploader'

export default function SetupPage() {
  const router = useRouter()
  const {
    playerCount, wordCount, wordPairs, sourceFileName, hydrated,
    hydrate, setPlayerCount, setWordCount, setWordPairs, clearWordPairs,
  } = useSetupStore()

  // Hydrate persisted state after mount (avoids SSR hydration mismatch)
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
      <main className="min-h-screen flex flex-col items-center justify-center p-6">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-primary-100 border-t-primary-500 rounded-full animate-spin" />
          <p className="text-muted text-sm">加载中...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="bg-white rounded-3xl shadow-lg p-10 max-w-md w-full space-y-8 animate-pop-in">
        <h1 className="text-2xl font-bold text-center">⚙️ 比赛设置</h1>

        <PlayerCountSelector value={playerCount} onChange={setPlayerCount} />

        <ExcelUploader
          hasExisting={wordPairs.length > 0}
          existingFileName={sourceFileName}
          existingTotal={wordPairs.length}
          onParsed={setWordPairs}
          onClear={clearWordPairs}
        />

        <WordCountInput value={wordCount} max={wordPairs.length} onChange={setWordCount} />

        {/* Summary */}
        <div className="bg-surface-page rounded-xl p-4 text-sm space-y-1">
          <p><span className="text-muted">比赛人数：</span><strong>{playerCount} 人</strong></p>
          <p><span className="text-muted">每人单词数：</span><strong>{wordCount} 个</strong></p>
          <p><span className="text-muted">单词表：</span><strong>{wordPairs.length > 0 ? `${sourceFileName}（共 ${wordPairs.length} 词）` : '未导入'}</strong></p>
        </div>

        <div className="flex gap-3">
          <Button variant="ghost" className="flex-1" onClick={() => router.push('/')}>返回</Button>
          <Button className="flex-1" disabled={!canStart} onClick={handleStart}>
            开始比赛
          </Button>
        </div>
        {!canStart && wordPairs.length > 0 && (
          <p className="text-warning-500 text-xs text-center">
            {wordPairs.length < wordCount
              ? `单词表仅有 ${wordPairs.length} 个单词，请将比赛单词数设置为 ${wordPairs.length} 或以下`
              : wordCount < 10
              ? '单词数量至少为 10'
              : ''}
          </p>
        )}
        {!canStart && wordPairs.length === 0 && (
          <p className="text-muted text-xs text-center">请先导入单词表</p>
        )}
      </div>
    </main>
  )
}

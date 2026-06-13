'use client'

import { useRouter } from 'next/navigation'
import { useSetupStore } from '@/stores/setupStore'
import Button from '@/components/ui/Button'
import PlayerCountSelector from '@/components/setup/PlayerCountSelector'
import WordCountInput from '@/components/setup/WordCountInput'
import ExcelUploader from '@/components/setup/ExcelUploader'

export default function SetupPage() {
  const router = useRouter()
  const {
    playerCount, wordCount, wordPairs, sourceFileName,
    setPlayerCount, setWordCount, setWordPairs,
  } = useSetupStore()

  const canStart = wordPairs.length > 0 && wordPairs.length >= wordCount && wordCount >= 10

  const handleStart = () => {
    if (!canStart) return
    router.push('/game')
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="bg-white rounded-3xl shadow-lg p-10 max-w-md w-full space-y-8">
        <h1 className="text-2xl font-bold text-center">⚙️ 比赛设置</h1>

        <PlayerCountSelector value={playerCount} onChange={setPlayerCount} />

        <ExcelUploader onParsed={setWordPairs} />

        <WordCountInput value={wordCount} max={wordPairs.length} onChange={setWordCount} />

        {/* Summary */}
        <div className="bg-surface-page rounded-xl p-4 text-sm space-y-1">
          <p><span className="text-muted">比赛人数：</span><strong>{playerCount} 人</strong></p>
          <p><span className="text-muted">每人单词数：</span><strong>{wordCount} 个</strong></p>
          <p><span className="text-muted">单词表：</span><strong>{sourceFileName || '未导入'}</strong>（共 {wordPairs.length} 词）</p>
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

import type { WordPair, Block, PlayerState } from '@/types'

let _idCounter = 0
function uid(): string {
  return `b_${++_idCounter}_${Math.random().toString(36).slice(2, 8)}`
}

/** Fisher-Yates shuffle (in-place, returns same array) */
export function shuffle<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

/** Pick `count` random WordPairs from the pool */
export function pickWords(pool: WordPair[], count: number): WordPair[] {
  const shuffled = shuffle([...pool])
  return shuffled.slice(0, count)
}

/** Build shuffled Block array from WordPairs */
export function buildBlocks(pairs: WordPair[]): Block[] {
  const blocks: Block[] = []
  for (const wp of pairs) {
    blocks.push({ id: uid(), wordPairId: wp.id, type: 'english', text: wp.english, status: 'normal' })
    blocks.push({ id: uid(), wordPairId: wp.id, type: 'chinese', text: wp.chinese, status: 'normal' })
  }
  return shuffle(blocks)
}

/** Check if two selected blocks form a valid match */
export function checkMatch(a: Block, b: Block): 'correct' | 'wrong-same-type' | 'wrong' {
  if (a.type === b.type) return 'wrong-same-type'
  if (a.wordPairId === b.wordPairId) return 'correct'
  return 'wrong'
}

/** Compute columns for a grid of `total` blocks to be as square as possible */
export function gridCols(total: number): number {
  if (total <= 4) return 2
  if (total <= 9) return 3
  if (total <= 16) return 4
  if (total <= 25) return 5
  if (total <= 36) return 6
  if (total <= 50) return 7
  if (total <= 64) return 8
  if (total <= 80) return 9
  return 10
}

/** Compute font size in px for blocks based on total count */
export function blockFontSize(total: number): number {
  if (total <= 20) return 13
  if (total <= 40) return 11
  if (total <= 60) return 10
  if (total <= 80) return 9
  return 8
}

/** Compute grid gap in Tailwind class based on total blocks */
export function blockGap(total: number): string {
  if (total <= 20) return 'gap-3'
  if (total <= 40) return 'gap-2'
  if (total <= 60) return 'gap-1.5'
  if (total <= 80) return 'gap-1'
  return 'gap-0.5'
}

/** Compute grid padding based on total blocks */
export function blockPadding(total: number): string {
  if (total <= 20) return 'p-3'
  if (total <= 60) return 'p-2'
  return 'p-1'
}

/** Rank players: finished first by elapsed, then quitters by quitTime */
export function rankPlayers(players: PlayerState[]): PlayerState[] {
  return [...players].sort((a, b) => {
    if (a.finished && !a.quit && b.finished && !b.quit) return a.elapsed - b.elapsed
    if (a.finished && !a.quit) return -1
    if (b.finished && !b.quit) return 1
    if (a.quit && b.quit) return (a.quitTime ?? Infinity) - (b.quitTime ?? Infinity)
    if (a.quit) return 1
    return -1
  })
}

/** Format milliseconds to mm:ss.t */
export function formatTime(ms: number): string {
  const totalSeconds = ms / 1000
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = (totalSeconds % 60).toFixed(1)
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(4, '0')}`
}

/** Count remaining (non-matched) blocks for a player */
export function remainingBlocks(blocks: Block[]): number {
  return blocks.filter(b => b.status !== 'matched').length
}

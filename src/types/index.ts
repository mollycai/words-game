export interface WordPair {
  id: string
  english: string
  chinese: string
}

export interface Block {
  id: string
  wordPairId: string
  type: 'english' | 'chinese'
  text: string
  status: 'normal' | 'selected' | 'matched' | 'wrong'
}

export interface PlayerState {
  id: number
  name: string
  color: string
  blocks: Block[]
  elapsed: number
  finished: boolean
  quit: boolean
  quitTime: number | null
}

export type GameStatus = 'idle' | 'countdown' | 'playing' | 'paused' | 'finished'

export interface SetupState {
  playerCount: number
  wordCount: number
  wordPairs: WordPair[]
  sourceFileName: string
}

export type MatchResult =
  | { type: 'correct' }
  | { type: 'wrong' }
  | { type: 'same-type' }

import { create } from 'zustand'
import type { WordPair } from '@/types'
import { saveSetupPrefs, loadSetupPrefs, saveWordPairs, loadWordPairs } from '@/lib/storage'

interface SetupStore {
  playerCount: number
  wordCount: number
  wordPairs: WordPair[]
  sourceFileName: string
  setPlayerCount: (n: number) => void
  setWordCount: (n: number) => void
  setWordPairs: (pairs: WordPair[], fileName: string) => void
  reset: () => void
  isValid: () => boolean
}

const cached = loadSetupPrefs()

export const useSetupStore = create<SetupStore>((set, get) => ({
  playerCount: cached?.playerCount ?? 2,
  wordCount: cached?.wordCount ?? 10,
  wordPairs: [],
  sourceFileName: '',

  setPlayerCount: (n) => {
    set({ playerCount: n })
    saveSetupPrefs({ playerCount: n, wordCount: get().wordCount })
  },

  setWordCount: (n) => {
    set({ wordCount: n })
    saveSetupPrefs({ playerCount: get().playerCount, wordCount: n })
  },

  setWordPairs: (pairs, fileName) => {
    set({ wordPairs: pairs, sourceFileName: fileName })
    saveWordPairs(pairs.map(p => ({ english: p.english, chinese: p.chinese })))
  },

  reset: () => set({ playerCount: 2, wordCount: 10, wordPairs: [], sourceFileName: '' }),

  isValid: () => {
    const { wordPairs, wordCount } = get()
    return wordPairs.length > 0 && wordPairs.length >= wordCount && wordCount >= 10
  },
}))

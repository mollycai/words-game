import { create } from 'zustand'
import type { WordPair } from '@/types'
import { saveSetupPrefs, loadSetupPrefs, saveWordPairs, loadWordPairs } from '@/lib/storage'

interface SetupStore {
  playerCount: number
  wordCount: number
  wordPairs: WordPair[]
  sourceFileName: string
  hydrated: boolean
  hydrate: () => void
  setPlayerCount: (n: number) => void
  setWordCount: (n: number) => void
  setWordPairs: (pairs: WordPair[], fileName: string) => void
  clearWordPairs: () => void
  reset: () => void
  isValid: () => boolean
}

export const useSetupStore = create<SetupStore>((set, get) => ({
  // Default values — hydrated from localStorage on client mount
  playerCount: 2,
  wordCount: 10,
  wordPairs: [],
  sourceFileName: '',
  hydrated: false,

  hydrate: () => {
    if (get().hydrated) return
    const prefs = loadSetupPrefs()
    const savedPairs = loadWordPairs()
    const pairs: WordPair[] = (savedPairs ?? []).map((p, i) => ({
      id: `wp_${i}`,
      english: p.english,
      chinese: p.chinese,
    }))
    set({
      playerCount: prefs?.playerCount ?? 2,
      wordCount: prefs?.wordCount ?? 10,
      wordPairs: pairs,
      sourceFileName: pairs.length > 0 ? '（已缓存）' : '',
      hydrated: true,
    })
  },

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

  clearWordPairs: () => {
    set({ wordPairs: [], sourceFileName: '' })
    saveWordPairs([])
  },

  reset: () => set({ playerCount: 2, wordCount: 10, wordPairs: [], sourceFileName: '' }),

  isValid: () => {
    const { wordPairs, wordCount } = get()
    return wordPairs.length > 0 && wordPairs.length >= wordCount && wordCount >= 10
  },
}))

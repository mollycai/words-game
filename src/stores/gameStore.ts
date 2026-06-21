import { create } from 'zustand'
import type { GameStatus, PlayerState, Block } from '@/types'
import { pickWords, buildBlocks, checkMatch, remainingBlocks } from '@/lib/gameLogic'

const PLAYER_COLORS: Record<number, string> = { 1: '#4B3FD9', 2: '#FF3B30', 3: '#06D6A0' }

interface GameStore {
  status: GameStatus
  players: PlayerState[]
  selected: Record<number, Block | null>
  countdownValue: number
  flashWrong: { playerId: number; blockIds: [string, string] } | null

  initGame: (playerCount: number, wordCount: number, wordPairs: import('@/types').WordPair[]) => void
  startCountdown: () => void
  finishCountdown: () => void
  pauseGame: () => void
  resumeGame: () => void
  quitPlayer: (playerId: number) => void
  selectBlock: (playerId: number, block: Block) => void
  tickPlayer: (playerId: number, delta: number) => void
  endGame: () => void
  reset: () => void
}

export const useGameStore = create<GameStore>((set, get) => ({
  status: 'idle',
  players: [],
  selected: {},
  countdownValue: 3,
  flashWrong: null,

  initGame: (playerCount, wordCount, wordPairs) => {
    const players: PlayerState[] = []
    for (let i = 1; i <= playerCount; i++) {
      const picked = pickWords(wordPairs, wordCount)
      players.push({
        id: i,
        name: `选手 ${i}`,
        color: PLAYER_COLORS[i],
        blocks: buildBlocks(picked),
        elapsed: 0,
        finished: false,
        quit: false,
        quitTime: null,
      })
    }
    set({ players, status: 'idle', countdownValue: 3, selected: {}, flashWrong: null })
  },

  startCountdown: () => set({ status: 'countdown', countdownValue: 3 }),

  finishCountdown: () => set({ status: 'playing' }),

  pauseGame: () => set({ status: 'paused' }),

  resumeGame: () => set({ status: 'playing' }),

  quitPlayer: (playerId) => {
    set((s) => ({
      players: s.players.map((p) =>
        p.id === playerId ? { ...p, quit: true, finished: true, quitTime: Date.now() } : p
      ),
    }))
    // Check if all done
    const st = get()
    if (st.players.every((p) => p.finished)) {
      set({ status: 'finished' })
    }
  },

  selectBlock: (playerId, block) => {
    const st = get()
    if (st.status !== 'playing') return
    if (block.status === 'matched') return

    const prev = st.selected[playerId] ?? null

    // Clicking the already-selected block: deselect
    if (prev && prev.id === block.id) {
      set((s) => ({
        selected: { ...s.selected, [playerId]: null },
        players: s.players.map((p) =>
          p.id === playerId
            ? { ...p, blocks: p.blocks.map((b) => (b.id === block.id ? { ...b, status: 'normal' as const } : b)) }
            : p
        ),
      }))
      return
    }

    // First selection for this player — highlight it
    if (!prev) {
      set((s) => ({
        selected: { ...s.selected, [playerId]: { ...block, status: 'selected' } },
        players: s.players.map((p) =>
          p.id === playerId
            ? { ...p, blocks: p.blocks.map((b) => (b.id === block.id ? { ...b, status: 'selected' as const } : b)) }
            : p
        ),
      }))
      return
    }

    // Second selection for this player — check match
    const result = checkMatch(prev, block)

    if (result === 'correct') {
      // Match! Mark both as matched
      set((s) => ({
        selected: { ...s.selected, [playerId]: null },
        players: s.players.map((p) => {
          if (p.id !== playerId) return p
          const updated = p.blocks.map((b) => {
            if (b.id === prev.id || b.id === block.id) return { ...b, status: 'matched' as const }
            return b
          })
          const allDone = remainingBlocks(updated) === 0
          return { ...p, blocks: updated, finished: allDone }
        }),
      }))
      // Check if all players done
      const after = get()
      if (after.players.every((p) => p.finished)) {
        set({ status: 'finished' })
      }
    } else {
      // Wrong match — flash then reset
      set((s) => ({
        selected: { ...s.selected, [playerId]: null },
        flashWrong: { playerId, blockIds: [prev.id, block.id] },
        players: s.players.map((p) => {
          if (p.id !== playerId) return p
          return {
            ...p,
            blocks: p.blocks.map((b) => {
              if (b.id === prev.id || b.id === block.id) return { ...b, status: 'wrong' as const }
              return b
            }),
          }
        }),
      }))
      // Clear flash after 400ms
      setTimeout(() => {
        set((s) => ({
          flashWrong: null,
          players: s.players.map((p) => {
            if (p.id !== playerId) return p
            return {
              ...p,
              blocks: p.blocks.map((b) => (b.status === 'wrong' ? { ...b, status: 'normal' as const } : b)),
            }
          }),
        }))
      }, 400)
    }
  },

  tickPlayer: (playerId, delta) => {
    set((s) => ({
      players: s.players.map((p) =>
        p.id === playerId && !p.finished ? { ...p, elapsed: p.elapsed + delta } : p
      ),
    }))
  },

  endGame: () => set({ status: 'finished' }),

  reset: () => set({ status: 'idle', players: [], selected: {}, countdownValue: 3, flashWrong: null }),
}))

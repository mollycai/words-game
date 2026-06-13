# 英文单词消消乐 v1 — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the v1 core playable version of Word Match — an in-classroom English word elimination game for 1-3 players on a single screen.

**Architecture:** Next.js 14 App Router with four pages (Start, Setup, Game, Result), Zustand for state management (setupStore + gameStore), Tailwind CSS for styling with custom semantic color tokens. Excel parsing via `xlsx` library on the client. Game state lives in memory (Zustand), settings cached in localStorage. API route scaffolded for future backend migration.

**Tech Stack:** Next.js 14, React 18.3, Tailwind CSS 3.4, Zustand 5, TypeScript 5, pnpm, xlsx (SheetJS)

---

### Task 1: Project Scaffolding

**Files:**
- Create: `package.json`
- Create: `next.config.js`
- Create: `tailwind.config.ts`
- Create: `tsconfig.json`
- Create: `postcss.config.js`
- Create: `src/app/globals.css`
- Create: `src/app/layout.tsx`
- Create: `.gitignore`

- [ ] **Step 1: Initialize project with pnpm**

```bash
cd /Users/edwincai/project/words-game
pnpm init
```

Expected: `package.json` created.

- [ ] **Step 2: Install dependencies**

```bash
pnpm add next@14 react@^18.3.0 react-dom@^18.3.0 zustand@^5.0.0 xlsx
pnpm add -D typescript@^5.0.0 @types/react@^18.3.0 @types/react-dom@^18.3.0 tailwindcss@^3.4.0 postcss autoprefixer
```

- [ ] **Step 3: Write package.json scripts**

Read the generated `package.json`, then overwrite with:

```json
{
  "name": "words-game",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  }
}
```

- [ ] **Step 4: Write next.config.js**

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

module.exports = nextConfig
```

- [ ] **Step 5: Write tailwind.config.ts**

```ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary:   { 100: '#D6E8FA', 300: '#6BA5E3', 500: '#4A90D9', 700: '#3A7BC8' },
        success:   { 100: '#D4F5DD', 300: '#6DD98A', 500: '#34C759', 700: '#2DB84D' },
        danger:    { 100: '#FFD6D4', 300: '#FF6B63', 500: '#FF3B30', 700: '#E0352B' },
        warning:   { 100: '#FFEACC', 300: '#FFB84D', 500: '#FF9500', 700: '#E08500' },
        player:    { '1': '#4A90D9', '2': '#FF9500', '3': '#34C759' },
        surface:   { page: '#F8F9FA', card: '#FFFFFF' },
      },
      textColor: {
        main: '#1A1A2E',
        muted: '#6B7280',
      },
    },
  },
  plugins: [],
}

export default config
```

- [ ] **Step 6: Write postcss.config.js**

```js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

- [ ] **Step 7: Write tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 8: Write src/app/globals.css**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20%, 60% { transform: translateX(-5px); }
  40%, 80% { transform: translateX(5px); }
}

@keyframes pop-in {
  0% { transform: scale(0.5); opacity: 0; }
  70% { transform: scale(1.1); }
  100% { transform: scale(1); opacity: 1; }
}

.animate-shake {
  animation: shake 0.4s ease-in-out;
}

.animate-pop-in {
  animation: pop-in 0.3s ease-out;
}
```

- [ ] **Step 9: Write src/app/layout.tsx** — root layout with font and global body style

```tsx
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '英文单词消消乐 - Word Match',
  description: '课堂互动单词竞赛游戏',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className="bg-surface-page text-text-main min-h-screen">
        {children}
      </body>
    </html>
  )
}
```

- [ ] **Step 10: Write .gitignore**

```
node_modules/
.next/
out/
```

- [ ] **Step 11: Verify dev server starts**

```bash
pnpm dev
```

Open http://localhost:3000 — should show a blank page (no routes yet), no errors.

Then stop the dev server (`Ctrl+C`).

---

### Task 2: Type Definitions

**Files:**
- Create: `src/types/index.ts`

- [ ] **Step 1: Write src/types/index.ts**

```ts
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
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
pnpm exec tsc --noEmit
```

Expected: No errors.

---

### Task 3: Utility Libraries

**Files:**
- Create: `src/lib/storage.ts`
- Create: `src/lib/gameLogic.ts`
- Create: `src/lib/wordParser.ts`

- [ ] **Step 1: Write src/lib/storage.ts** — localStorage wrapper for setup persistence

```ts
const KEYS = {
  SETUP: 'words-game-setup',
  WORDS: 'words-game-words',
} as const

export function saveSetupPrefs(prefs: { playerCount: number; wordCount: number }): void {
  try {
    localStorage.setItem(KEYS.SETUP, JSON.stringify(prefs))
  } catch { /* quota exceeded — silently ignore */ }
}

export function loadSetupPrefs(): { playerCount: number; wordCount: number } | null {
  try {
    const raw = localStorage.getItem(KEYS.SETUP)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function saveWordPairs(pairs: { english: string; chinese: string }[]): void {
  try {
    localStorage.setItem(KEYS.WORDS, JSON.stringify(pairs))
  } catch { /* quota exceeded */ }
}

export function loadWordPairs(): { english: string; chinese: string }[] | null {
  try {
    const raw = localStorage.getItem(KEYS.WORDS)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}
```

- [ ] **Step 2: Write src/lib/gameLogic.ts** — random pick, shuffle, match check, ranking

```ts
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
  return 5
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
```

- [ ] **Step 3: Write src/lib/wordParser.ts** — parse Excel file using xlsx on client

```ts
import * as XLSX from 'xlsx'
import type { WordPair } from '@/types'

export interface ParseResult {
  pairs: WordPair[]
  total: number
}

export interface ParseError {
  error: string
}

export function parseExcelFile(file: File): Promise<ParseResult> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target!.result as ArrayBuffer)
        const workbook = XLSX.read(data, { type: 'array' })
        const sheetName = workbook.SheetNames[0]
        if (!sheetName) {
          reject({ error: '文件中没有找到工作表' })
          return
        }
        const sheet = workbook.Sheets[sheetName]
        const rows: unknown[][] = XLSX.utils.sheet_to_json(sheet, { header: 1 })

        const pairs: WordPair[] = []
        for (let i = 0; i < rows.length; i++) {
          const row = rows[i]
          if (!row || row.length < 2) continue
          const english = String(row[0] ?? '').trim()
          const chinese = String(row[1] ?? '').trim()
          // Skip header row or empty cells
          if (!english || !chinese) continue
          if (english === '英文' || english === '单词' || english.toLowerCase() === 'english') continue
          pairs.push({ id: `wp_${i}`, english, chinese })
        }

        if (pairs.length === 0) {
          reject({ error: '文件中没有解析到有效的单词数据' })
          return
        }
        resolve({ pairs, total: pairs.length })
      } catch {
        reject({ error: '文件解析失败，请上传 .xlsx 或 .xls 文件' })
      }
    }
    reader.onerror = () => reject({ error: '文件读取失败' })
    reader.readAsArrayBuffer(file)
  })
}
```

- [ ] **Step 4: Verify TypeScript compiles**

```bash
pnpm exec tsc --noEmit
```

Expected: No errors.

---

### Task 4: Zustand Stores

**Files:**
- Create: `src/stores/setupStore.ts`
- Create: `src/stores/gameStore.ts`

- [ ] **Step 1: Write src/stores/setupStore.ts**

```ts
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
```

- [ ] **Step 2: Write src/stores/gameStore.ts**

```ts
import { create } from 'zustand'
import type { GameStatus, PlayerState, Block } from '@/types'
import { pickWords, buildBlocks, checkMatch, remainingBlocks, rankPlayers } from '@/lib/gameLogic'

const PLAYER_COLORS: Record<number, string> = { 1: '#4A90D9', 2: '#FF9500', 3: '#34C759' }

interface SelectedBlock {
  playerId: number
  block: Block
}

interface GameStore {
  status: GameStatus
  players: PlayerState[]
  selected: SelectedBlock | null
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
  selected: null,
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
    set({ players, status: 'idle', countdownValue: 3, selected: null, flashWrong: null })
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

    const prev = st.selected

    // Clicking the already-selected block: deselect
    if (prev && prev.playerId === playerId && prev.block.id === block.id) {
      set((s) => ({
        selected: null,
        players: s.players.map((p) =>
          p.id === playerId
            ? { ...p, blocks: p.blocks.map((b) => (b.id === block.id ? { ...b, status: 'normal' as const } : b)) }
            : p
        ),
      }))
      return
    }

    // First selection — highlight it
    if (!prev) {
      set((s) => ({
        selected: { playerId, block: { ...block, status: 'selected' } },
        players: s.players.map((p) =>
          p.id === playerId
            ? { ...p, blocks: p.blocks.map((b) => (b.id === block.id ? { ...b, status: 'selected' as const } : b)) }
            : p
        ),
      }))
      return
    }

    // Second selection — must be in same player area
    if (prev.playerId !== playerId) return

    const result = checkMatch(prev.block, block)

    if (result === 'correct') {
      // Match! Mark both as matched
      set((s) => ({
        selected: null,
        players: s.players.map((p) => {
          if (p.id !== playerId) return p
          const updated = p.blocks.map((b) => {
            if (b.id === prev.block.id || b.id === block.id) return { ...b, status: 'matched' as const }
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
        selected: null,
        flashWrong: { playerId, blockIds: [prev.block.id, block.id] },
        players: s.players.map((p) => {
          if (p.id !== playerId) return p
          return {
            ...p,
            blocks: p.blocks.map((b) => {
              if (b.id === prev.block.id || b.id === block.id) return { ...b, status: 'wrong' as const }
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

  reset: () => set({ status: 'idle', players: [], selected: null, countdownValue: 3, flashWrong: null }),
}))
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
pnpm exec tsc --noEmit
```

Expected: No errors.

---

### Task 5: Common UI Components

**Files:**
- Create: `src/components/ui/Button.tsx`
- Create: `src/components/ui/Modal.tsx`
- Create: `src/components/ui/Countdown.tsx`

- [ ] **Step 1: Write src/components/ui/Button.tsx**

```tsx
import { type ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'danger' | 'warning' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}

const variantClasses: Record<string, string> = {
  primary: 'bg-primary-500 hover:bg-primary-700 text-white',
  danger: 'bg-danger-500 hover:bg-danger-700 text-white',
  warning: 'bg-warning-500 hover:bg-warning-700 text-white',
  ghost: 'bg-transparent hover:bg-gray-200 text-text-main border border-gray-300',
}

const sizeClasses: Record<string, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-base',
  lg: 'px-8 py-4 text-lg',
}

export default function Button({ variant = 'primary', size = 'md', className = '', disabled, ...props }: ButtonProps) {
  return (
    <button
      className={`rounded-xl font-semibold transition-colors min-w-[44px] min-h-[44px] ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
      } ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      disabled={disabled}
      {...props}
    />
  )
}
```

- [ ] **Step 2: Write src/components/ui/Modal.tsx**

```tsx
import { useEffect } from 'react'
import Button from './Button'

interface ModalProps {
  open: boolean
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  variant?: 'primary' | 'danger'
  onConfirm: () => void
  onCancel: () => void
}

export default function Modal({
  open, title, message, confirmText = '确认', cancelText = '取消',
  variant = 'primary', onConfirm, onCancel,
}: ModalProps) {
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onCancel() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, onCancel])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl p-8 max-w-sm w-full mx-4 shadow-xl animate-pop-in">
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-text-muted mb-6">{message}</p>
        <div className="flex gap-3 justify-end">
          <Button variant="ghost" onClick={onCancel}>{cancelText}</Button>
          <Button variant={variant === 'danger' ? 'danger' : 'primary'} onClick={onConfirm}>
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Write src/components/ui/Countdown.tsx**

```tsx
'use client'

import { useEffect, useState } from 'react'

interface CountdownProps {
  from?: number
  onFinish: () => void
}

export default function Countdown({ from = 3, onFinish }: CountdownProps) {
  const [value, setValue] = useState(from)
  const [show, setShow] = useState(true)

  useEffect(() => {
    if (value <= 0) {
      setShow(false)
      onFinish()
      return
    }
    const timer = setTimeout(() => setValue((v) => v - 1), 1000)
    return () => clearTimeout(timer)
  }, [value, onFinish])

  if (!show) return null

  const display = value === 0 ? 'GO!' : String(value)

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50">
      <span
        key={value}
        className={`text-[120px] font-extrabold animate-pop-in ${
          value === 0 ? 'text-success-500' : 'text-white'
        }`}
      >
        {display}
      </span>
    </div>
  )
}
```

- [ ] **Step 4: Verify TypeScript compiles**

```bash
pnpm exec tsc --noEmit
```

Expected: No errors.

---

### Task 6: Setup Page Components

**Files:**
- Create: `src/components/setup/PlayerCountSelector.tsx`
- Create: `src/components/setup/WordCountInput.tsx`
- Create: `src/components/setup/ExcelUploader.tsx`
- Create: `src/app/setup/page.tsx`

- [ ] **Step 1: Write src/components/setup/PlayerCountSelector.tsx**

```tsx
'use client'

interface PlayerCountSelectorProps {
  value: number
  onChange: (n: number) => void
}

export default function PlayerCountSelector({ value, onChange }: PlayerCountSelectorProps) {
  return (
    <div>
      <label className="block text-sm font-semibold mb-2">比赛人数</label>
      <div className="flex gap-2">
        {[1, 2, 3].map((n) => (
          <button
            key={n}
            onClick={() => onChange(n)}
            className={`w-16 h-16 rounded-xl text-2xl font-bold transition-colors ${
              value === n
                ? 'bg-primary-500 text-white shadow-md'
                : 'bg-white border-2 border-gray-200 hover:border-primary-300'
            }`}
          >
            {n}
          </button>
        ))}
      </div>
      <p className="text-xs text-text-muted mt-1">{value} 人比赛</p>
    </div>
  )
}
```

- [ ] **Step 2: Write src/components/setup/WordCountInput.tsx**

```tsx
'use client'

interface WordCountInputProps {
  value: number
  max: number
  onChange: (n: number) => void
}

export default function WordCountInput({ value, max, onChange }: WordCountInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const n = parseInt(e.target.value, 10)
    if (!isNaN(n) && n >= 10) onChange(n)
  }

  return (
    <div>
      <label className="block text-sm font-semibold mb-2">每人单词数（≥10）</label>
      <input
        type="number"
        min={10}
        max={max || 100}
        value={value}
        onChange={handleChange}
        className="w-32 h-14 text-center text-xl font-bold border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none"
      />
      {max > 0 && value > max && (
        <p className="text-danger-500 text-xs mt-1">单词表仅有 {max} 个单词，请设置为 {max} 或以下</p>
      )}
    </div>
  )
}
```

- [ ] **Step 3: Write src/components/setup/ExcelUploader.tsx**

```tsx
'use client'

import { useRef, useState } from 'react'
import { parseExcelFile } from '@/lib/wordParser'
import type { WordPair } from '@/types'
import type { ParseError } from '@/lib/wordParser'

interface ExcelUploaderProps {
  onParsed: (pairs: WordPair[], fileName: string) => void
}

export default function ExcelUploader({ onParsed }: ExcelUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [fileName, setFileName] = useState('')
  const [total, setTotal] = useState(0)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setError('')
    setLoading(true)
    try {
      const result = await parseExcelFile(file)
      setFileName(file.name)
      setTotal(result.total)
      onParsed(result.pairs, file.name)
    } catch (err) {
      const pe = err as ParseError
      setError(pe.error || '解析失败')
      setFileName('')
      setTotal(0)
    }
    setLoading(false)
  }

  return (
    <div>
      <label className="block text-sm font-semibold mb-2">导入单词表 (Excel)</label>
      <input
        ref={inputRef}
        type="file"
        accept=".xlsx,.xls"
        onChange={handleFile}
        className="hidden"
      />
      <button
        onClick={() => inputRef.current?.click()}
        className="px-6 py-4 border-2 border-dashed border-primary-300 rounded-xl text-primary-500 hover:bg-primary-100 transition-colors font-semibold min-w-[44px] min-h-[44px]"
      >
        {loading ? '解析中...' : fileName ? `📄 ${fileName}` : '📁 点击上传 Excel 文件'}
      </button>
      {total > 0 && <p className="text-success-500 text-xs mt-1">✅ 已导入 {total} 个单词</p>}
      {error && <p className="text-danger-500 text-xs mt-1">❌ {error}</p>}
    </div>
  )
}
```

- [ ] **Step 4: Write src/app/setup/page.tsx**

```tsx
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
          <p><span className="text-text-muted">比赛人数：</span><strong>{playerCount} 人</strong></p>
          <p><span className="text-text-muted">每人单词数：</span><strong>{wordCount} 个</strong></p>
          <p><span className="text-text-muted">单词表：</span><strong>{sourceFileName || '未导入'}</strong>（共 {wordPairs.length} 词）</p>
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
          <p className="text-text-muted text-xs text-center">请先导入单词表</p>
        )}
      </div>
    </main>
  )
}
```

- [ ] **Step 5: Verify TypeScript compiles**

```bash
pnpm exec tsc --noEmit
```

Expected: No errors.

---

### Task 7: Start Page

**Files:**
- Create: `src/app/page.tsx`

- [ ] **Step 1: Write src/app/page.tsx** — splash/start page

```tsx
'use client'

import Link from 'next/link'
import Button from '@/components/ui/Button'

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
        <span className="absolute top-[10%] left-[10%] text-6xl text-primary-100 font-bold rotate-[-15deg]">A</span>
        <span className="absolute top-[20%] right-[15%] text-5xl text-primary-100 font-bold rotate-[10deg]">B</span>
        <span className="absolute bottom-[15%] left-[20%] text-5xl text-primary-100 font-bold rotate-[5deg]">C</span>
        <span className="absolute bottom-[20%] right-[10%] text-6xl text-primary-100 font-bold rotate-[-10deg]">D</span>
      </div>

      <div className="relative z-10 text-center space-y-8">
        <div>
          <h1 className="text-5xl font-extrabold text-primary-500 mb-2">英文单词消消乐</h1>
          <p className="text-xl text-text-muted">Word Match</p>
        </div>

        <p className="text-text-muted max-w-xs mx-auto">
          课堂互动单词竞赛游戏 · 教师导入单词表 · 学生同屏竞技
        </p>

        <Link href="/setup">
          <Button size="lg" className="text-xl px-12 py-5 rounded-2xl shadow-lg">
            开始游戏
          </Button>
        </Link>
      </div>
    </main>
  )
}
```

- [ ] **Step 2: Verify TypeScript and dev server**

```bash
pnpm exec tsc --noEmit
pnpm dev
```

Visit http://localhost:3000 — should show the start page with title and "开始游戏" button.
Click "开始游戏" — should navigate to /setup.
Stop dev server.

---

### Task 8: Game Page Components

**Files:**
- Create: `src/components/game/WordBlock.tsx`
- Create: `src/components/game/BlockGrid.tsx`
- Create: `src/components/game/PlayerTimer.tsx`
- Create: `src/components/game/PlayerArea.tsx`
- Create: `src/components/game/RefereeToolbar.tsx`
- Create: `src/components/game/GameLayout.tsx`

- [ ] **Step 1: Write src/components/game/WordBlock.tsx**

```tsx
'use client'

import type { Block } from '@/types'

interface WordBlockProps {
  block: Block
  color: string
  onClick: () => void
  disabled: boolean
}

export default function WordBlock({ block, color, onClick, disabled }: WordBlockProps) {
  const isMatched = block.status === 'matched'
  const isSelected = block.status === 'selected'
  const isWrong = block.status === 'wrong'

  // Color coding: english blocks get primary border tint, chinese get lighter tint
  const borderColor = block.type === 'english' ? color : `${color}80`

  return (
    <button
      onClick={onClick}
      disabled={disabled || isMatched}
      className={`
        relative w-full aspect-[3/2] rounded-xl font-bold
        flex items-center justify-center text-center px-2
        transition-all duration-200
        min-w-[44px] min-h-[44px]
        ${isMatched ? 'scale-0 opacity-0 pointer-events-none' : ''}
        ${isSelected ? 'scale-105 shadow-lg z-10 -translate-y-0.5' : ''}
        ${isWrong ? 'animate-shake ring-2 ring-danger-500' : ''}
        ${!isSelected && !isWrong ? 'hover:shadow-md hover:-translate-y-0.5' : ''}
      `}
      style={{
        backgroundColor: isSelected ? color : '#FFFFFF',
        borderColor: isSelected ? color : borderColor,
        borderWidth: '2px',
        color: isSelected ? '#FFFFFF' : '#1A1A2E',
        boxShadow: isSelected ? `0 4px 16px ${color}40` : undefined,
      }}
    >
      <span className="text-sm sm:text-base leading-tight">{block.text}</span>
      {/* Small type indicator */}
      <span
        className="absolute top-1 right-1.5 text-[10px] opacity-40"
        style={{ color: isSelected ? 'rgba(255,255,255,0.7)' : undefined }}
      >
        {block.type === 'english' ? 'EN' : '中'}
      </span>
    </button>
  )
}
```

- [ ] **Step 2: Write src/components/game/BlockGrid.tsx**

```tsx
'use client'

import type { Block } from '@/types'
import { gridCols } from '@/lib/gameLogic'
import WordBlock from './WordBlock'

interface BlockGridProps {
  blocks: Block[]
  playerId: number
  playerColor: string
  disabled: boolean
  onBlockClick: (block: Block) => void
}

export default function BlockGrid({ blocks, playerId, playerColor, disabled, onBlockClick }: BlockGridProps) {
  const cols = gridCols(blocks.length)

  return (
    <div
      className="grid gap-2 p-2"
      style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
    >
      {blocks.map((block) => (
        <WordBlock
          key={block.id}
          block={block}
          color={playerColor}
          disabled={disabled}
          onClick={() => onBlockClick(block)}
        />
      ))}
    </div>
  )
}
```

- [ ] **Step 3: Write src/components/game/PlayerTimer.tsx**

```tsx
'use client'

import { formatTime } from '@/lib/gameLogic'

interface PlayerTimerProps {
  name: string
  color: string
  elapsed: number
  finished: boolean
  quit: boolean
}

export default function PlayerTimer({ name, color, elapsed, finished, quit }: PlayerTimerProps) {
  return (
    <div className="flex items-center gap-2 px-2 py-1">
      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
      <span className="font-bold text-sm">{name}</span>
      <span
        className={`ml-auto font-mono text-lg font-bold tabular-nums ${
          finished && !quit ? 'text-success-500' : quit ? 'text-danger-500 line-through' : ''
        }`}
      >
        {formatTime(elapsed)}
      </span>
      {finished && !quit && <span className="text-success-500 text-xs">✓</span>}
      {quit && <span className="text-danger-500 text-xs">弃权</span>}
    </div>
  )
}
```

- [ ] **Step 4: Write src/components/game/PlayerArea.tsx**

```tsx
'use client'

import type { PlayerState, Block } from '@/types'
import PlayerTimer from './PlayerTimer'
import BlockGrid from './BlockGrid'

interface PlayerAreaProps {
  player: PlayerState
  disabled: boolean
  onBlockClick: (playerId: number, block: Block) => void
}

export default function PlayerArea({ player, disabled, onBlockClick }: PlayerAreaProps) {
  return (
    <div
      className="flex-1 flex flex-col min-w-0"
      style={{ borderRight: player.id < 3 ? '2px dashed #e5e7eb' : 'none' }}
    >
      <PlayerTimer
        name={player.name}
        color={player.color}
        elapsed={player.elapsed}
        finished={player.finished}
        quit={player.quit}
      />
      <div className={`flex-1 ${player.quit ? 'opacity-40 pointer-events-none' : ''}`}>
        {player.quit && (
          <div className="flex items-center justify-center h-full">
            <span className="text-danger-500 font-bold text-lg">已弃权</span>
          </div>
        )}
        {!player.quit && (
          <BlockGrid
            blocks={player.blocks}
            playerId={player.id}
            playerColor={player.color}
            disabled={disabled || player.finished}
            onBlockClick={(block) => onBlockClick(player.id, block)}
          />
        )}
        {player.finished && !player.quit && (
          <div className="flex items-center justify-center py-4">
            <span className="text-success-500 font-bold text-lg">✅ 完成!</span>
          </div>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 5: Write src/components/game/RefereeToolbar.tsx**

```tsx
'use client'

import { useState } from 'react'
import type { PlayerState, GameStatus } from '@/types'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'

interface RefereeToolbarProps {
  status: GameStatus
  players: PlayerState[]
  onPause: () => void
  onResume: () => void
  onQuitPlayer: (playerId: number) => void
  onReturn: () => void
}

export default function RefereeToolbar({ status, players, onPause, onResume, onQuitPlayer, onReturn }: RefereeToolbarProps) {
  const [quitTarget, setQuitTarget] = useState<number | null>(null)
  const [showReturnModal, setShowReturnModal] = useState(false)
  const isPlaying = status === 'playing'
  const isPaused = status === 'paused'
  const canAct = isPlaying || isPaused

  return (
    <>
      <div className="bg-gray-800 text-white px-4 py-2 flex items-center gap-2 flex-wrap rounded-b-xl">
        {/* Pause / Resume */}
        {canAct && (
          isPaused
            ? <Button variant="warning" size="sm" onClick={onResume}>▶ 继续</Button>
            : <Button variant="warning" size="sm" onClick={onPause}>⏸ 暂停</Button>
        )}

        {/* Quit player buttons */}
        {players.map((p) => (
          <Button
            key={p.id}
            variant="ghost"
            size="sm"
            className="text-white border-gray-500 hover:bg-gray-700"
            disabled={!canAct || p.finished}
            onClick={() => setQuitTarget(p.id)}
          >
            🏳 {p.name}放弃
          </Button>
        ))}

        <div className="flex-1" />

        <Button variant="ghost" size="sm" className="text-white border-gray-500 hover:bg-gray-700" onClick={() => setShowReturnModal(true)}>
          ↩ 返回
        </Button>
      </div>

      {/* Quit confirmation */}
      <Modal
        open={quitTarget !== null}
        title={`${players.find(p => p.id === quitTarget)?.name ?? ''} 放弃比赛`}
        message={`确定要让${players.find(p => p.id === quitTarget)?.name ?? ''}放弃吗？其成绩将不计入排名。`}
        confirmText="确认放弃"
        variant="danger"
        onConfirm={() => { if (quitTarget !== null) { onQuitPlayer(quitTarget); setQuitTarget(null) } }}
        onCancel={() => setQuitTarget(null)}
      />

      {/* Return confirmation */}
      <Modal
        open={showReturnModal}
        title="返回设置"
        message="比赛进行中，确定要退出吗？当前比赛数据将不会保存。"
        confirmText="确认退出"
        variant="danger"
        onConfirm={() => { setShowReturnModal(false); onReturn() }}
        onCancel={() => setShowReturnModal(false)}
      />
    </>
  )
}
```

- [ ] **Step 6: Write src/components/game/GameLayout.tsx**

```tsx
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
    status, players, selected, countdownValue,
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
```

- [ ] **Step 7: Write src/app/game/page.tsx** — thin page, delegates to GameLayout

```tsx
'use client'

import dynamic from 'next/dynamic'

const GameLayout = dynamic(() => import('@/components/game/GameLayout'), { ssr: false })

export default function GamePage() {
  return <GameLayout />
}
```

- [ ] **Step 8: Verify TypeScript compiles**

```bash
pnpm exec tsc --noEmit
```

Expected: No errors.

---

### Task 9: Result Page

**Files:**
- Create: `src/components/result/Podium.tsx`
- Create: `src/components/result/RankCard.tsx`
- Create: `src/app/result/page.tsx`

- [ ] **Step 1: Write src/components/result/RankCard.tsx**

```tsx
'use client'

import type { PlayerState } from '@/types'
import { formatTime } from '@/lib/gameLogic'

interface RankCardProps {
  player: PlayerState
  rank: number
}

const MEDAL_EMOJI: Record<number, string> = { 1: '🥇', 2: '🥈', 3: '🥉' }

export default function RankCard({ player, rank }: RankCardProps) {
  return (
    <div
      className={`flex items-center gap-4 bg-white rounded-xl p-4 ${
        rank === 1 ? 'ring-2 ring-warning-500 shadow-lg scale-105' : 'shadow'
      }`}
    >
      <span className="text-3xl">{MEDAL_EMOJI[rank] || `#${rank}`}</span>
      <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: player.color }} />
      <div className="flex-1">
        <p className="font-bold">{player.name}</p>
        {player.quit ? (
          <p className="text-danger-500 text-sm">弃权</p>
        ) : (
          <p className="text-text-muted text-sm">{formatTime(player.elapsed)}</p>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Write src/components/result/Podium.tsx** — champion spotlight

```tsx
'use client'

import type { PlayerState } from '@/types'
import { formatTime } from '@/lib/gameLogic'

interface PodiumProps {
  champion: PlayerState
}

export default function Podium({ champion }: PodiumProps) {
  return (
    <div className="text-center space-y-2 animate-pop-in">
      <p className="text-6xl">🏆</p>
      <div className="w-4 h-4 rounded-full mx-auto" style={{ backgroundColor: champion.color }} />
      <p className="text-2xl font-extrabold">{champion.name}</p>
      <p className="text-3xl font-mono font-bold text-warning-500">{formatTime(champion.elapsed)}</p>
    </div>
  )
}
```

- [ ] **Step 3: Write src/app/result/page.tsx**

```tsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useGameStore } from '@/stores/gameStore'
import { useSetupStore } from '@/stores/setupStore'
import { rankPlayers } from '@/lib/gameLogic'
import type { PlayerState } from '@/types'
import Button from '@/components/ui/Button'
import Podium from '@/components/result/Podium'
import RankCard from '@/components/result/RankCard'

export default function ResultPage() {
  const router = useRouter()
  const players = useGameStore((s) => s.players)
  const reset = useGameStore((s) => s.reset)
  const wordPairs = useSetupStore((s) => s.wordPairs)
  const playerCount = useSetupStore((s) => s.playerCount)
  const wordCount = useSetupStore((s) => s.wordCount)
  const [ranked, setRanked] = useState<PlayerState[]>([])

  useEffect(() => {
    if (players.length === 0) {
      router.replace('/')
      return
    }
    setRanked(rankPlayers(players))
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
        <p className="text-text-muted text-lg">所有选手均已弃权</p>
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
```

- [ ] **Step 4: Verify TypeScript compiles**

```bash
pnpm exec tsc --noEmit
```

Expected: No errors.

---

### Task 10: API Route Scaffolding

**Files:**
- Create: `src/app/api/words/route.ts`

- [ ] **Step 1: Write src/app/api/words/route.ts** — scaffold for future backend

```ts
import { NextResponse } from 'next/server'

// POST /api/words - Parse uploaded Excel file (server-side fallback for future use)
export async function POST(request: Request) {
  // v1: Not implemented — parsing is done client-side.
  // v2: Move xlsx parsing here for server-side processing.
  return NextResponse.json({ message: 'Not implemented in v1' }, { status: 501 })
}

// GET /api/words - List available word sets (scaffold for future DB)
export async function GET() {
  // v1: Not implemented — words are cached in localStorage.
  // v2: Return word sets from database.
  return NextResponse.json({ message: 'Not implemented in v1' }, { status: 501 })
}
```

- [ ] **Step 2: Full TypeScript check**

```bash
pnpm exec tsc --noEmit
```

Expected: No errors across entire project.

---

### Task 11: Integration Verification

- [ ] **Step 1: Start dev server**

```bash
pnpm dev
```

- [ ] **Step 2: Manual smoke test checklist**

| # | Test | Expected |
|---|------|----------|
| 1 | Open http://localhost:3000 | Start page with title and "开始游戏" button |
| 2 | Click "开始游戏" | Navigates to /setup |
| 3 | Select 2 players, upload Excel, set word count to 10 | All settings show correctly in summary |
| 4 | Click "开始比赛" | Navigates to /game, countdown 3-2-1-GO! |
| 5 | Click two matching blocks | Both disappear with animation |
| 6 | Click two non-matching blocks | Shake animation, blocks remain |
| 7 | Click same block twice | Deselects |
| 8 | Click "暂停" | Overlay appears, blocks not clickable |
| 9 | Click "继续" | Overlay disappears, blocks clickable |
| 10 | Click "选手N放弃" → confirm | Player area greyed out with "已弃权" |
| 11 | Complete all blocks | Timer stops, navigates to /result |
| 12 | Result page | Shows rankings, champion highlighted |
| 13 | Click "再来一局" | New game with same settings, different random words |
| 14 | Click "返回设置" | Back to /setup |

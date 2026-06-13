# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

英文单词消消乐 (Word Match) — a classroom English word matching game. A teacher uploads an Excel word list, and 1–3 students compete side-by-side on the same screen to match English words with their Chinese definitions by tapping blocks.

- **Stack:** Next.js 14 (Pages Router), React 18, TypeScript 5, Tailwind CSS 3, Zustand 5
- **Package manager:** `pnpm` (v10)
- **PRD:** `docs/PRD-英文单词消消乐.md`

## Commands

```bash
pnpm dev          # Start dev server (Next.js on localhost:3000)
pnpm build        # Production build
pnpm start        # Start production server
pnpm lint         # Run ESLint
```

There is no test runner configured yet.

## Architecture

### Routing (Pages Router)

| Route | File | Notes |
|-------|------|-------|
| `/` | `src/app/page.tsx` | Start/home page |
| `/setup` | `src/app/setup/page.tsx` | Teacher configures player count, word count, uploads Excel |
| `/game` | `src/app/game/page.tsx` | Thin wrapper that `dynamic()`-imports `GameLayout` with `ssr: false` (browser-only) |
| `/result` | `src/app/result/page.tsx` | Rankings after game ends |
| `/api/words` | `src/app/api/words/route.ts` | Scaffold only — returns 501 in v1 |

### State management (Zustand)

- **`src/stores/setupStore.ts`** — player count, word count, parsed WordPair[], source file name. Persists to `localStorage` keys `words-game-setup` and `words-game-words`.
- **`src/stores/gameStore.ts`** — the entire game state machine: `initGame()`, `startCountdown()`, `selectBlock()`, `tickPlayer()`, `quitPlayer()`, etc. Status transitions: `idle → countdown → playing → finished` (with optional `paused`).

### Data flow

1. Teacher uploads Excel → `src/lib/wordParser.ts` parses it **client-side** via the `xlsx` library → WordPair[] stored in `setupStore`
2. On `/game` mount, `GameLayout` reads `setupStore`, calls `gameStore.initGame()` which: picks `wordCount` random WordPairs per player → builds shuffled Block[] (each word becomes an english block + chinese block)
3. Game timer runs via `requestAnimationFrame` loop in `GameLayout`, ticking `gameStore.tickPlayer()` each frame
4. Block selection flows through `gameStore.selectBlock()`: first tap selects, second tap on same-player block checks match via `gameLogic.checkMatch()`, wrong matches flash red for 400ms then reset
5. When all players finish → auto-navigate to `/result` → `gameLogic.rankPlayers()` computes ranking (finished by time, then quitters by quit time)

### Component tree

```
GameLayout (orchestrator — timer loop, status effects)
├── Countdown (full-screen 3→2→1→GO overlay)
├── RefereeToolbar (pause/resume, per-player quit, return — with confirmation Modals)
├── PlayerArea × N (vertical lane per player)
│   ├── PlayerTimer (colored dot, name, elapsed time)
│   └── BlockGrid (CSS grid of WordBlocks)
│       └── WordBlock (button with selected/matched/wrong states)
```

### Pure logic library (`src/lib/gameLogic.ts`)

All game rules live here as pure functions with no React dependency:
- `shuffle()` — Fisher-Yates
- `pickWords()` / `buildBlocks()` — generate per-player block sets
- `checkMatch()` — same `wordPairId` + different types = correct
- `gridCols()` — compute column count for roughly-square grid
- `rankPlayers()` / `formatTime()` / `remainingBlocks()`

### Custom theme

`tailwind.config.ts` defines project-specific tokens: `primary`, `success`, `danger`, `warning` (each with 100/300/500/700), `player.1/.2/.3` colors, `surface.page`/`surface.card`, `text.main`/`text.muted`. Two custom CSS animations in `globals.css`: `animate-shake` and `animate-pop-in`.

### Key constraints

- **Client-side only:** Excel parsing and the entire game page are browser-only. The API route is a v2 scaffold.
- **No database:** Word lists are cached in `localStorage`.
- **Touch-friendly:** All interactive elements ≥ 44×44px (WCAG). Critical actions (quit, return) require confirmation via Modal.
- **Player max:** 3 players max, hardcoded in `PlayerCountSelector` and `PLAYER_COLORS`.

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

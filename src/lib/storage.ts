const KEYS = {
  SETUP: 'words-game-setup',
  WORDS: 'words-game-words',
  WORDS_FILE_NAME: 'words-game-words-filename',
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

export function saveWordPairs(pairs: { english: string; chinese: string }[], fileName?: string): void {
  try {
    localStorage.setItem(KEYS.WORDS, JSON.stringify(pairs))
    if (fileName !== undefined) {
      localStorage.setItem(KEYS.WORDS_FILE_NAME, fileName)
    }
  } catch { /* quota exceeded */ }
}

export function loadWordPairs(): { pairs: { english: string; chinese: string }[]; fileName: string } | null {
  try {
    const raw = localStorage.getItem(KEYS.WORDS)
    const fileName = localStorage.getItem(KEYS.WORDS_FILE_NAME) || ''
    return raw ? { pairs: JSON.parse(raw), fileName } : null
  } catch {
    return null
  }
}

export function clearWordPairsStorage(): void {
  try {
    localStorage.removeItem(KEYS.WORDS)
    localStorage.removeItem(KEYS.WORDS_FILE_NAME)
  } catch { /* ignore */ }
}

import { useCallback } from 'react'
import { playClickSound } from './sound'

/** Reusable hook — returns click sound handler for any button */
export function useButtonSound() {
  const playClick = useCallback(() => {
    playClickSound()
  }, [])

  return { playClick }
}

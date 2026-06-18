import { PixelIconMono } from './PixelIcon'
import { MEDAL } from './patterns'

// Extract 0/1 mask from multi-color grid for rank-based coloring
const MEDAL_MASK: number[][] = MEDAL.map(row => row.map(cell => (cell ? 1 : 0)))

const MEDAL_COLORS: Record<number, string> = { 1: '#F5A623', 2: '#9996B0', 3: '#C47F3A' }
interface IconProps { size?: number; className?: string }

export function PixelMedal({ rank = 1, size, className }: { rank?: 1 | 2 | 3 } & IconProps) {
  return <PixelIconMono grid={MEDAL_MASK} color={MEDAL_COLORS[rank]} size={size} className={className} />
}

import { PixelIconMono } from './PixelIcon'
import { MEDAL } from './patterns'

const MEDAL_COLORS: Record<number, string> = { 1: '#F5A623', 2: '#9996B0', 3: '#C47F3A' }
interface IconProps { color?: string; size?: number; className?: string }

export function PixelMedal({ rank = 1, color, size, className }: { rank?: 1 | 2 | 3 } & IconProps) {
  return <PixelIconMono grid={MEDAL} color={color ?? MEDAL_COLORS[rank]} size={size} className={className} />
}

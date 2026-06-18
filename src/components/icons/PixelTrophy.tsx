import { PixelIconMono } from './PixelIcon'
import { TROPHY } from './patterns'
interface IconProps { color?: string; size?: number; className?: string }
export function PixelTrophy({ color, size, className }: IconProps) {
  return <PixelIconMono grid={TROPHY} color={color} size={size} className={className} />
}

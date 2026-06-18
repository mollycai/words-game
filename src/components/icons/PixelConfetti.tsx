import { PixelIconMono } from './PixelIcon'
import { CONFETTI } from './patterns'
interface IconProps { color?: string; size?: number; className?: string }
export function PixelConfetti({ color, size, className }: IconProps) {
  return <PixelIconMono grid={CONFETTI} color={color} size={size} className={className} />
}

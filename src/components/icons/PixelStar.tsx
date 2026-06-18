import { PixelIconMono } from './PixelIcon'
import { STAR } from './patterns'
interface IconProps { color?: string; size?: number; className?: string }
export function PixelStar({ color, size, className }: IconProps) {
  return <PixelIconMono grid={STAR} color={color} size={size} className={className} />
}

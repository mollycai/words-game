import { PixelIconMono } from './PixelIcon'
import { ROCKET } from './patterns'
interface IconProps { color?: string; size?: number; className?: string }
export function PixelRocket({ color, size, className }: IconProps) {
  return <PixelIconMono grid={ROCKET} color={color} size={size} className={className} />
}

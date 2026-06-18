import { PixelIconMono } from './PixelIcon'
import { CHECK } from './patterns'
interface IconProps { color?: string; size?: number; className?: string }
export function PixelCheck({ color, size, className }: IconProps) {
  return <PixelIconMono grid={CHECK} color={color} size={size} className={className} />
}

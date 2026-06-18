import { PixelIconMono } from './PixelIcon'
import { TICK } from './patterns'
interface IconProps { color?: string; size?: number; className?: string }
export function PixelTick({ color, size, className }: IconProps) {
  return <PixelIconMono grid={TICK} color={color} size={size} className={className} />
}

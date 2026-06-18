import { PixelIconMono } from './PixelIcon'
import { PLAY } from './patterns'
interface IconProps { color?: string; size?: number; className?: string }
export function PixelPlay({ color, size, className }: IconProps) {
  return <PixelIconMono grid={PLAY} color={color} size={size} className={className} />
}

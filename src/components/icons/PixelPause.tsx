import { PixelIconMono } from './PixelIcon'
import { PAUSE } from './patterns'
interface IconProps { color?: string; size?: number; className?: string }
export function PixelPause({ color, size, className }: IconProps) {
  return <PixelIconMono grid={PAUSE} color={color} size={size} className={className} />
}

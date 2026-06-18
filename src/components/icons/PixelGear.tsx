import { PixelIconMono } from './PixelIcon'
import { GEAR } from './patterns'
interface IconProps { color?: string; size?: number; className?: string }
export function PixelGear({ color, size, className }: IconProps) {
  return <PixelIconMono grid={GEAR} color={color} size={size} className={className} />
}

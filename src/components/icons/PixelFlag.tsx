import { PixelIconMono } from './PixelIcon'
import { FLAG } from './patterns'
interface IconProps { color?: string; size?: number; className?: string }
export function PixelFlag({ color, size, className }: IconProps) {
  return <PixelIconMono grid={FLAG} color={color} size={size} className={className} />
}

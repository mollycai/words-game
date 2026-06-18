import { PixelIconMono } from './PixelIcon'
import { DOC } from './patterns'
interface IconProps { color?: string; size?: number; className?: string }
export function PixelDoc({ color, size, className }: IconProps) {
  return <PixelIconMono grid={DOC} color={color} size={size} className={className} />
}

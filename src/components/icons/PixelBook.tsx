import { PixelIconMono } from './PixelIcon'
import { BOOK } from './patterns'
interface IconProps { color?: string; size?: number; className?: string }
export function PixelBook({ color, size, className }: IconProps) {
  return <PixelIconMono grid={BOOK} color={color} size={size} className={className} />
}

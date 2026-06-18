import { PixelIconMono } from './PixelIcon'
import { ARROW_BACK } from './patterns'
interface IconProps { color?: string; size?: number; className?: string }
export function PixelArrowBack({ color, size, className }: IconProps) {
  return <PixelIconMono grid={ARROW_BACK} color={color} size={size} className={className} />
}

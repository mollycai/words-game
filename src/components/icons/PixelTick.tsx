import { PixelIcon } from './PixelIcon'
import { TICK } from './patterns'
interface IconProps { size?: number; className?: string }
export function PixelTick({ size, className }: IconProps) {
  return <PixelIcon grid={TICK} size={size} className={className} />
}

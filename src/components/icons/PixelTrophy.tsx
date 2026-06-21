import { PixelIcon } from './PixelIcon'
import { TROPHY } from './patterns'
interface IconProps { size?: number; className?: string }
export function PixelTrophy({ size, className }: IconProps) {
  return <PixelIcon grid={TROPHY} size={size} className={className} />
}

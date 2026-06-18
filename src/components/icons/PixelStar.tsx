import { PixelIcon } from './PixelIcon'
import { STAR } from './patterns'
interface IconProps { size?: number; className?: string }
export function PixelStar({ size, className }: IconProps) {
  return <PixelIcon grid={STAR} size={size} className={className} />
}

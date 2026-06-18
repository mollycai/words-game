import { PixelIcon } from './PixelIcon'
import { CHECK } from './patterns'
interface IconProps { size?: number; className?: string }
export function PixelCheck({ size, className }: IconProps) {
  return <PixelIcon grid={CHECK} size={size} className={className} />
}

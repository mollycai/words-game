import { PixelIcon } from './PixelIcon'
import { PAUSE } from './patterns'
interface IconProps { size?: number; className?: string }
export function PixelPause({ size, className }: IconProps) {
  return <PixelIcon grid={PAUSE} size={size} className={className} />
}

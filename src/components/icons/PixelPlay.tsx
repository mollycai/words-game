import { PixelIcon } from './PixelIcon'
import { PLAY } from './patterns'
interface IconProps { size?: number; className?: string }
export function PixelPlay({ size, className }: IconProps) {
  return <PixelIcon grid={PLAY} size={size} className={className} />
}

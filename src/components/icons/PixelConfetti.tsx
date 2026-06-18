import { PixelIcon } from './PixelIcon'
import { CONFETTI } from './patterns'
interface IconProps { size?: number; className?: string }
export function PixelConfetti({ size, className }: IconProps) {
  return <PixelIcon grid={CONFETTI} size={size} className={className} />
}

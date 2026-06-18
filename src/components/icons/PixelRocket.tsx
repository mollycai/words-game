import { PixelIcon } from './PixelIcon'
import { ROCKET } from './patterns'
interface IconProps { size?: number; className?: string }
export function PixelRocket({ size, className }: IconProps) {
  return <PixelIcon grid={ROCKET} size={size} className={className} />
}

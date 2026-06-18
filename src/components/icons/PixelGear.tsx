import { PixelIcon } from './PixelIcon'
import { GEAR } from './patterns'
interface IconProps { size?: number; className?: string }
export function PixelGear({ size, className }: IconProps) {
  return <PixelIcon grid={GEAR} size={size} className={className} />
}

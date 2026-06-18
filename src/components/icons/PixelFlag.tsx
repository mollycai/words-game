import { PixelIcon } from './PixelIcon'
import { FLAG } from './patterns'
interface IconProps { size?: number; className?: string }
export function PixelFlag({ size, className }: IconProps) {
  return <PixelIcon grid={FLAG} size={size} className={className} />
}

import { PixelIcon } from './PixelIcon'
import { DOC } from './patterns'
interface IconProps { size?: number; className?: string }
export function PixelDoc({ size, className }: IconProps) {
  return <PixelIcon grid={DOC} size={size} className={className} />
}

import { PixelIcon } from './PixelIcon'
import { ARROW_BACK } from './patterns'
interface IconProps { size?: number; className?: string }
export function PixelArrowBack({ size, className }: IconProps) {
  return <PixelIcon grid={ARROW_BACK} size={size} className={className} />
}

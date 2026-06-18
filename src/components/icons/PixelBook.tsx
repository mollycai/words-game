import { PixelIcon } from './PixelIcon'
import { BOOK } from './patterns'
interface IconProps { size?: number; className?: string }
export function PixelBook({ size, className }: IconProps) {
  return <PixelIcon grid={BOOK} size={size} className={className} />
}

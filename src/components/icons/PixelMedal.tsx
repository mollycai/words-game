import { PixelIcon } from './PixelIcon'
import { MEDAL_1, MEDAL_2, MEDAL_3 } from './patterns'

const MEDALS: Record<number, string[][]> = { 1: MEDAL_1, 2: MEDAL_2, 3: MEDAL_3 }
interface IconProps { size?: number; className?: string }

export function PixelMedal({ rank = 1, size, className }: { rank?: 1 | 2 | 3 } & IconProps) {
  return <PixelIcon grid={MEDALS[rank]} size={size} className={className} />
}

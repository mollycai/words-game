import { PixelIcon } from './PixelIcon'
import { JOYSTICK } from './patterns'
interface IconProps { size?: number; className?: string }
export function PixelJoystick({ size, className }: IconProps) {
  return <PixelIcon grid={JOYSTICK} size={size} className={className} />
}

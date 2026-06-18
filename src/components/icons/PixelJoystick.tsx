import { PixelIconMono } from './PixelIcon'
import { JOYSTICK } from './patterns'
interface IconProps { color?: string; size?: number; className?: string }
export function PixelJoystick({ color, size, className }: IconProps) {
  return <PixelIconMono grid={JOYSTICK} color={color} size={size} className={className} />
}

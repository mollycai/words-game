'use client'

import Link from 'next/link'
import { PixelText } from '@/components/ui/PixelText'
import { PixelGear, PixelDoc, PixelPlay, PixelRocket, PixelJoystick } from '@/components/icons'
import { useButtonSound } from '@/lib/useButtonSound'

const FLOATING_CHARS = [
  { char: 'A', top: '8%',  left: '8%',  rotate: '-12deg', size: 'text-7xl', glow: 'rgba(75,63,217,0.4)' },
  { char: 'e', top: '15%', right: '12%', rotate: '8deg',   size: 'text-6xl', glow: 'rgba(255,73,48,0.3)' },
  { char: 'W', top: '25%', left: '5%',   rotate: '6deg',   size: 'text-5xl', glow: 'rgba(6,214,160,0.3)' },
  { char: 'o', top: '35%', right: '8%',  rotate: '-5deg',  size: 'text-6xl', glow: 'rgba(245,166,35,0.35)' },
  { char: 'r', top: '55%', left: '10%',  rotate: '15deg',  size: 'text-5xl', glow: 'rgba(75,63,217,0.35)' },
  { char: 'd', top: '65%', right: '6%',  rotate: '-8deg',  size: 'text-7xl', glow: 'rgba(255,73,48,0.4)' },
  { char: 'M', top: '75%', left: '15%',  rotate: '-3deg',  size: 'text-6xl', glow: 'rgba(6,214,160,0.3)' },
  { char: 't', top: '80%', right: '15%', rotate: '10deg',  size: 'text-5xl', glow: 'rgba(245,166,35,0.3)' },
  { char: 'c', top: '12%', left: '82%',  rotate: '-10deg', size: 'text-4xl', glow: 'rgba(75,63,217,0.3)' },
  { char: 'h', top: '45%', left: '88%',  rotate: '7deg',   size: 'text-5xl', glow: 'rgba(255,73,48,0.25)' },
]

const FEATURES = [
  { Icon: PixelGear, label: '设置规则', desc: '选择比赛人数与每人单词数量', step: '01', color: '#8B83F0' },
  { Icon: PixelDoc, label: '导入词汇', desc: '上传 Excel 单词表即可开始', step: '02', color: '#FCC364' },
  { Icon: PixelPlay, label: '开始比赛', desc: '三人同屏竞技，看谁先完成', step: '03', color: '#4FE8BA' },
]

export default function HomePage() {
  const { playClick } = useButtonSound()

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative floating letters — very dim */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
        {FLOATING_CHARS.map((item, i) => (
          <span
            key={i}
            className={`absolute ${item.size} font-bold animate-neon-flicker`}
            style={{
              top: item.top,
              [item.left ? 'left' : 'right']: item.left || item.right,
              transform: `rotate(${item.rotate})`,
              color: 'rgba(255,255,255,0.06)',
              textShadow: `0 0 8px ${item.glow}, 0 0 16px ${item.glow}`,
              fontFamily: 'var(--font-press-start), monospace',
            }}
          >
            {item.char}
          </span>
        ))}
      </div>

      <div className="relative z-10 text-center max-w-lg mx-auto">
        {/* Logo / Title with neon glow */}
        <div className="mb-12">
          <div className="flex items-center justify-center gap-3 mb-3">
            <PixelJoystick size={56} />
            <PixelText
              text="英文单词消消乐"
              charSize={20}
              // rainbow: 红 橙 黄 绿 蓝 靛 紫
              color={['#FF3B30','#FF9500','#FFD700','#06D6A0','#4B3FD9','#5856D6','#AF52DE']}
              glowColor={['#FF3B30','#FF9500','#FFD700','#06D6A0','#4B3FD9','#5856D6','#AF52DE']}
              cellSize={3}
              gap={1}
              className="animate-neon-flicker"
            />
            <PixelJoystick size={56} />
          </div>
          <p
            className="text-lg tracking-[0.3em] uppercase animate-neon-flicker"
            style={{
              color: '#06D6A0',
              textShadow: '0 0 10px rgba(6,214,160,0.6), 0 0 30px rgba(6,214,160,0.3)',
              fontFamily: 'var(--font-press-start), monospace',
              fontSize: '14px',
            }}
          >
            Word Match
          </p>
        </div>

        {/* Feature cards — CRT Scanline Game Dialog style */}
        <div className="flex gap-4 justify-center mb-12 flex-wrap">
          {FEATURES.map((step) => (
            <div
              key={step.step}
              className="relative flex-1 min-w-[160px] max-w-[230px]"
              style={{
                background: '#0a0a14',
                border: `2px solid ${step.color}45`,
                boxShadow: `inset 0 0 30px rgba(0,0,0,0.5), 0 0 16px ${step.color}08`,
                overflow: 'hidden',
              }}
            >
              {/* CRT scanlines overlay */}
              <div style={{
                position: 'absolute', inset: 0,
                background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.1) 0px, transparent 2px, rgba(0,0,0,0.1) 4px)',
                pointerEvents: 'none', zIndex: 2,
              }} />

              {/* Header bar */}
              <div style={{
                background: `${step.color}15`, padding: '8px 12px',
                borderBottom: `1px solid ${step.color}30`,
                display: 'flex', alignItems: 'center', gap: 8,
                position: 'relative', zIndex: 1,
              }}>
                <span style={{ width: 6, height: 6, background: step.color, display: 'inline-block', boxShadow: `0 0 6px ${step.color}` }} />
                <span style={{ fontFamily: '"Courier New",monospace', fontSize: 11, fontWeight: 700, color: step.color, letterSpacing: 1 }}>
                  STEP_{step.step}
                </span>
              </div>

              {/* Body */}
              <div style={{ padding: '22px 18px 18px', textAlign: 'center', position: 'relative', zIndex: 1 }}>
                <div className="flex justify-center mb-3">
                  <step.Icon size={38} />
                </div>
                <div style={{
                  fontFamily: '"Courier New",monospace', fontWeight: 700, fontSize: 13,
                  color: step.color, margin: '0 0 4px', letterSpacing: 1,
                  textShadow: `0 0 6px ${step.color}60`,
                }}>
                  {step.label}
                </div>
                <div style={{ fontSize: 11, color: '#888', fontFamily: 'monospace', lineHeight: 1.5 }}>
                  {step.desc}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Button — CRT Scanline style */}
        <Link href="/setup">
          <button
            className="animate-neon-flicker"
            onClick={() => playClick()}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              padding: '16px 48px',
              background: 'transparent',
              color: '#FFF',
              fontFamily: '"Courier New", monospace',
              fontSize: 15, fontWeight: 700, letterSpacing: 2,
              border: '2px solid #8B83F0',
              boxShadow: 'inset 0 0 20px rgba(75,63,217,0.2), 0 0 16px rgba(75,63,217,0.4), 0 0 2px #8B83F0',
              cursor: 'pointer', position: 'relative', overflow: 'hidden',
            }}
          >
            <span style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.1) 0px, transparent 1px, rgba(0,0,0,0.1) 2px)', pointerEvents: 'none' }} />
            <PixelRocket size={20} />
            <span style={{ position: 'relative', zIndex: 1 }}>START</span>
          </button>
        </Link>

        {/* Footer */}
        <p className="mt-8 text-xs" style={{ color: 'rgba(153,150,176,0.5)' }}>
          适用于课堂教学 · 互动白板 · 触屏设备
        </p>
      </div>
    </main>
  )
}

'use client'

import Link from 'next/link'
import Button from '@/components/ui/Button'
import { PixelText } from '@/components/ui/PixelText'
import { PixelGear, PixelDoc, PixelPlay, PixelRocket, PixelJoystick } from '@/components/icons'

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
  { Icon: PixelGear, label: '设置规则', desc: '人数 & 单词数', step: '01', color: '#8B83F0' },
  { Icon: PixelDoc, label: '导入词汇', desc: '上传 Excel 表', step: '02', color: '#FCC364' },
  { Icon: PixelPlay, label: '开始比赛', desc: '同屏竞技 PK', step: '03', color: '#4FE8BA' },
]

export default function HomePage() {
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

        {/* Feature cards — Pixel Panel style */}
        <div className="flex gap-3 justify-center mb-12 flex-wrap">
          {FEATURES.map((step) => (
            <div
              key={step.step}
              className="relative flex-1 min-w-[150px] max-w-[220px]"
              style={{
                background: 'linear-gradient(180deg, rgba(15,13,46,0.9), rgba(20,18,54,0.9))',
                border: `2px solid ${step.color}30`,
                padding: '28px 18px 22px',
                textAlign: 'center',
                boxShadow: `3px 3px 0 ${step.color}18, 0 0 20px ${step.color}10`,
              }}
            >
              {/* Pixel corner accents */}
              <span style={{ position: 'absolute', top: -2, left: -2, width: 8, height: 8, background: step.color, display: 'block' }} />
              <span style={{ position: 'absolute', top: -2, right: -2, width: 8, height: 8, background: step.color, display: 'block' }} />
              <span style={{ position: 'absolute', bottom: -2, right: -2, width: 8, height: 8, background: step.color, display: 'block' }} />

              {/* Step number — pixel style */}
              <div style={{
                fontFamily: '"Arial Black", Impact, sans-serif',
                fontSize: 11, fontWeight: 900, color: step.color,
                letterSpacing: 2, marginBottom: 14, opacity: 0.8,
              }}>
                [{step.step}]
              </div>

              {/* Icon */}
              <div className="flex justify-center mb-3">
                <step.Icon size={38} />
              </div>

              {/* Title */}
              <div style={{
                fontFamily: '"Arial Black", Impact, sans-serif',
                fontWeight: 900, fontSize: 14, color: step.color,
                marginBottom: 6, letterSpacing: 1,
                textShadow: `0 0 10px ${step.color}40`,
              }}>
                {step.label}
              </div>

              {/* Description */}
              <div style={{ fontSize: 12, color: '#9996B0', lineHeight: 1.5 }}>
                {step.desc}
              </div>
            </div>
          ))}
        </div>

        {/* CTA Button with neon pulse */}
        <Link href="/setup">
          <Button
            size="lg"
            className="text-xl px-14 py-5 rounded-2xl transition-all hover:-translate-y-0.5 animate-neon-pulse"
            style={{
              background: 'linear-gradient(135deg, #4B3FD9, #3D32C7)',
              boxShadow: '0 4px 0 #2E25A3, 0 0 24px rgba(75,63,217,0.5), 0 0 48px rgba(75,63,217,0.2)',
              color: '#FFF',
              fontFamily: 'var(--font-press-start), monospace',
              fontSize: '16px',
            }}
          >
            <span className="flex items-center gap-2">
              <PixelRocket size={24} />
              START
            </span>
          </Button>
        </Link>

        {/* Footer */}
        <p className="mt-8 text-xs" style={{ color: 'rgba(153,150,176,0.5)' }}>
          适用于课堂教学 · 互动白板 · 触屏设备
        </p>
      </div>
    </main>
  )
}

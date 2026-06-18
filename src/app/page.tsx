'use client'

import Link from 'next/link'
import Button from '@/components/ui/Button'
import { PixelGear, PixelDoc, PixelTrophy, PixelRocket, PixelJoystick } from '@/components/icons'

const FLOATING_CHARS = [
  { char: 'A', top: '8%',  left: '8%',  rotate: '-12deg', size: 'text-7xl' },
  { char: 'e', top: '15%', right: '12%', rotate: '8deg',   size: 'text-6xl' },
  { char: 'W', top: '25%', left: '5%',   rotate: '6deg',   size: 'text-5xl' },
  { char: 'o', top: '35%', right: '8%',  rotate: '-5deg',  size: 'text-6xl' },
  { char: 'r', top: '55%', left: '10%',  rotate: '15deg',  size: 'text-5xl' },
  { char: 'd', top: '65%', right: '6%',  rotate: '-8deg',  size: 'text-7xl' },
  { char: 'M', top: '75%', left: '15%',  rotate: '-3deg',  size: 'text-6xl' },
  { char: 't', top: '80%', right: '15%', rotate: '10deg',  size: 'text-5xl' },
  { char: 'c', top: '12%', left: '82%',  rotate: '-10deg', size: 'text-4xl' },
  { char: 'h', top: '45%', left: '88%',  rotate: '7deg',   size: 'text-5xl' },
]

const FEATURES = [
  { icon: PixelGear, label: '设置规则', desc: '人数 & 单词数', color: '#9996B0' },
  { icon: PixelDoc, label: '导入词汇', desc: '上传 Excel 表', color: '#FCC364' },
  { icon: PixelTrophy, label: '开始比赛', desc: '同屏竞技 PK', color: '#F5A623' },
]

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative floating letters — dim neon */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
        {FLOATING_CHARS.map((item, i) => (
          <span
            key={i}
            className={`absolute ${item.size} font-extrabold`}
            style={{
              top: item.top,
              [item.left ? 'left' : 'right']: item.left || item.right,
              transform: `rotate(${item.rotate})`,
              color: 'rgba(255,255,255,0.04)',
            }}
          >
            {item.char}
          </span>
        ))}
      </div>

      <div className="relative z-10 text-center max-w-lg mx-auto">
        {/* Logo / Title */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-3 mb-3">
            <PixelJoystick size={40} color="#F5A623" />
            <h1
              className="text-5xl font-extrabold tracking-tight"
              style={{
                color: '#F0EEFF',
                textShadow: '0 0 24px rgba(75,63,217,0.4)',
              }}
            >
              英文单词消消乐
            </h1>
            <PixelJoystick size={40} color="#E8382A" />
          </div>
          <p className="text-lg tracking-widest uppercase" style={{ color: '#9996B0' }}>
            Word Match
          </p>
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-3 gap-4 mb-12">
          {FEATURES.map((step, i) => (
            <div
              key={i}
              className="rounded-2xl p-4"
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                backdropFilter: 'blur(8px)',
              }}
            >
              <div className="mb-2 flex justify-center">
                <step.icon size={32} color={step.color} />
              </div>
              <div className="text-sm font-bold mb-0.5" style={{ color: '#F0EEFF' }}>
                {step.label}
              </div>
              <div className="text-xs" style={{ color: '#9996B0' }}>
                {step.desc}
              </div>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <Link href="/setup">
          <Button
            size="lg"
            className="text-xl px-14 py-5 rounded-2xl transition-all hover:-translate-y-0.5"
            style={{
              background: 'linear-gradient(135deg, #4B3FD9, #3D32C7)',
              boxShadow: '0 4px 0 #2E25A3, 0 0 24px rgba(75,63,217,0.5), 0 0 48px rgba(75,63,217,0.2)',
              color: '#FFF',
            }}
          >
            <span className="flex items-center gap-2">
              <PixelRocket size={24} color="#FFF" />
              开始游戏
            </span>
          </Button>
        </Link>

        {/* Footer */}
        <p className="mt-8 text-xs" style={{ color: 'rgba(153,150,176,0.6)' }}>
          适用于课堂教学 · 互动白板 · 触屏设备
        </p>
      </div>
    </main>
  )
}

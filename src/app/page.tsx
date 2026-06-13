'use client'

import Link from 'next/link'
import Button from '@/components/ui/Button'

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

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-b from-surface-page via-white to-primary-100/20">
      {/* Decorative floating letters */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
        {FLOATING_CHARS.map((item, i) => (
          <span
            key={i}
            className={`absolute ${item.size} text-primary-100/60 font-extrabold`}
            style={{
              top: item.top,
              [item.left ? 'left' : 'right']: item.left || item.right,
              transform: `rotate(${item.rotate})`,
            }}
          >
            {item.char}
          </span>
        ))}
      </div>

      <div className="relative z-10 text-center max-w-lg mx-auto">
        {/* Logo / Title Section */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-3 mb-3">
            <span className="text-4xl">📚</span>
            <h1 className="text-5xl font-extrabold text-primary-500 tracking-tight">
              英文单词消消乐
            </h1>
            <span className="text-4xl">✨</span>
          </div>
          <p className="text-lg text-muted tracking-widest uppercase">Word Match</p>
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-3 gap-4 mb-12">
          {[
            { icon: '⚙️', label: '设置规则', desc: '人数 & 单词数' },
            { icon: '📄', label: '导入词汇', desc: '上传 Excel 表' },
            { icon: '🏆', label: '开始比赛', desc: '同屏竞技 PK' },
          ].map((step, i) => (
            <div
              key={i}
              className="bg-white/80 backdrop-blur rounded-2xl p-4 shadow-sm border border-primary-100/50"
            >
              <div className="text-2xl mb-2">{step.icon}</div>
              <div className="text-sm font-bold text-text-main mb-0.5">{step.label}</div>
              <div className="text-xs text-muted">{step.desc}</div>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <Link href="/setup">
          <Button
            size="lg"
            className="text-xl px-14 py-5 rounded-2xl shadow-lg shadow-primary-300/30 hover:shadow-xl hover:shadow-primary-300/40 hover:-translate-y-0.5 transition-all"
          >
            🚀 开始游戏
          </Button>
        </Link>

        {/* Footer */}
        <p className="mt-8 text-xs text-muted/60">
          适用于课堂教学 · 互动白板 · 触屏设备
        </p>
      </div>
    </main>
  )
}

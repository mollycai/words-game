'use client'

import {
  PixelBook, PixelStar, PixelTrophy, PixelMedal, PixelConfetti,
  PixelGear, PixelDoc, PixelRocket, PixelFlag, PixelArrowBack,
  PixelPause, PixelPlay, PixelCheck, PixelTick, PixelJoystick,
} from '@/components/icons'

const ICONS = [
  { emoji: '📚', name: 'Book', Component: PixelBook, color: '#8B83F0' },
  { emoji: '✨', name: 'Star', Component: PixelStar, color: '#FCC364' },
  { emoji: '🏆', name: 'Trophy', Component: PixelTrophy, color: '#F5A623' },
  { emoji: '🥇', name: 'Gold', render: () => <PixelMedal rank={1} size={40} /> },
  { emoji: '🥈', name: 'Silver', render: () => <PixelMedal rank={2} size={40} /> },
  { emoji: '🥉', name: 'Bronze', render: () => <PixelMedal rank={3} size={40} /> },
  { emoji: '🎉', name: 'Confetti', Component: PixelConfetti, color: '#FF4930' },
  { emoji: '⚙️', name: 'Gear', Component: PixelGear, color: '#9996B0' },
  { emoji: '📄', name: 'Doc', Component: PixelDoc, color: '#FCC364' },
  { emoji: '🚀', name: 'Rocket', Component: PixelRocket, color: '#FF4930' },
  { emoji: '🏳️', name: 'Flag', Component: PixelFlag, color: '#FF8A7A' },
  { emoji: '↩️', name: 'ArrowBack', Component: PixelArrowBack, color: '#9996B0' },
  { emoji: '⏸️', name: 'Pause', Component: PixelPause, color: '#FCC364' },
  { emoji: '▶️', name: 'Play', Component: PixelPlay, color: '#4FE8BA' },
  { emoji: '✅', name: 'Check', Component: PixelCheck, color: '#4FE8BA' },
  { emoji: '✓', name: 'Tick', Component: PixelTick, color: '#4FE8BA' },
  { emoji: '🕹️', name: 'Joystick', Component: PixelJoystick, color: '#F5A623' },
]

export default function IconsPreviewPage() {
  return (
    <main style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #0F0D2E 0%, #141236 50%, #1A1548 100%)',
      padding: '32px 24px',
      color: '#F0EEFF',
    }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <h1 style={{
          fontFamily: 'Arial Black, Impact, sans-serif',
          fontSize: '28px', fontWeight: 900,
          marginBottom: '8px', textAlign: 'center',
        }}>
          像素图标预览 · Pixel Icons
        </h1>
        <p style={{ color: '#9996B0', fontSize: '14px', textAlign: 'center', marginBottom: '32px' }}>
          16×16 像素网格 · 左侧 Emoji 对照 · 右侧像素版
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))',
          gap: '14px',
        }}>
          {ICONS.map((item) => (
            <div
              key={item.name}
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '12px',
                padding: '18px 14px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '10px',
                transition: 'all 0.15s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.1)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '26px' }}>{item.emoji}</span>
                <span style={{ color: '#666' }}>→</span>
                {'Component' in item && item.Component
                  ? <item.Component size={40} color={item.color} />
                  : 'render' in item && item.render
                    ? item.render()
                    : null
                }
              </div>
              <span style={{ color: '#9996B0', fontSize: '12px' }}>{item.name}</span>
            </div>
          ))}
        </div>

        {/* Size variants */}
        <h2 style={{
          fontFamily: 'Arial Black, sans-serif', fontSize: '20px', fontWeight: 900,
          marginTop: '40px', marginBottom: '16px', textAlign: 'center',
        }}>
          尺寸变体
        </h2>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: '24px', flexWrap: 'wrap',
          padding: '24px', background: 'rgba(255,255,255,0.04)',
          borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)',
        }}>
          {[16, 24, 32, 48, 64].map((s) => (
            <div key={s} style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
              <PixelTrophy size={s} color="#F5A623" />
              <span style={{ color: '#666', fontSize: '11px' }}>{s}px</span>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}

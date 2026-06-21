import { useEffect } from 'react'

interface ModalProps {
  open: boolean
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  variant?: 'primary' | 'danger'
  onConfirm: () => void
  onCancel: () => void
}

export default function Modal({
  open, title, message, confirmText = '确认', cancelText = '取消',
  variant = 'primary', onConfirm, onCancel,
}: ModalProps) {
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onCancel() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, onCancel])

  if (!open) return null

  const confirmColor = variant === 'danger' ? '#FF3B30' : '#8B83F0'

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 50,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(0,0,0,0.6)',
    }}>
      <div
        className="animate-pop-in"
        style={{
          background: '#0d0d1a',
          border: '2px solid rgba(139,131,240,0.27)',
          boxShadow: 'inset 0 0 30px rgba(0,0,0,0.5), 0 0 20px rgba(75,63,217,0.1)',
          padding: '28px 32px',
          maxWidth: 400,
          width: 'calc(100% - 32px)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* CRT scanlines */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.08) 0px, transparent 2px, rgba(0,0,0,0.08) 4px)',
          pointerEvents: 'none', zIndex: 10,
        }} />

        {/* Header bar */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '8px 12px',
          margin: '-28px -32px 20px',
          borderBottom: '1px solid rgba(139,131,240,0.18)',
          background: 'rgba(75,63,217,0.08)',
          position: 'relative', zIndex: 1,
        }}>
          <span style={{
            width: 7, height: 7,
            background: variant === 'danger' ? '#FF3B30' : '#8B83F0',
            boxShadow: variant === 'danger' ? '0 0 8px #FF3B30' : '0 0 8px #8B83F0',
          }} />
          <span style={{
            fontFamily: '"Courier New", monospace',
            fontSize: 11, fontWeight: 700,
            color: variant === 'danger' ? '#FF3B30' : '#8B83F0',
            letterSpacing: 1,
            textShadow: variant === 'danger'
              ? '0 0 6px rgba(255,59,48,0.4)'
              : '0 0 6px rgba(139,131,240,0.4)',
          }}>
            {variant === 'danger' ? 'WARNING' : 'CONFIRM'}
          </span>
        </div>

        <div style={{ position: 'relative', zIndex: 1 }}>
          <h3 style={{
            fontFamily: '"Courier New", monospace',
            fontSize: 14, fontWeight: 700,
            color: '#ddd',
            marginBottom: 8,
            letterSpacing: 1,
          }}>
            {title}
          </h3>
          <p style={{
            fontFamily: 'monospace',
            fontSize: 11,
            color: '#888',
            marginBottom: 24,
            lineHeight: 1.6,
          }}>
            {message}
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
            <button
              onClick={onCancel}
              style={{
                padding: '10px 20px',
                fontFamily: '"Courier New", monospace',
                fontSize: 11, fontWeight: 700,
                letterSpacing: 1,
                color: '#888',
                background: 'transparent',
                border: '1px solid #2a2a3a',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#555'
                e.currentTarget.style.color = '#aaa'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#2a2a3a'
                e.currentTarget.style.color = '#888'
              }}
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              style={{
                padding: '10px 20px',
                fontFamily: '"Courier New", monospace',
                fontSize: 11, fontWeight: 700,
                letterSpacing: 1,
                color: '#fff',
                background: 'transparent',
                border: `2px solid ${confirmColor}`,
                boxShadow: `inset 0 0 16px ${confirmColor}20, 0 0 10px ${confirmColor}30`,
                cursor: 'pointer',
                transition: 'all 0.15s',
                position: 'relative',
                overflow: 'hidden',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = `inset 0 0 24px ${confirmColor}30, 0 0 16px ${confirmColor}50`
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = `inset 0 0 16px ${confirmColor}20, 0 0 10px ${confirmColor}30`
              }}
            >
              {/* scanline on confirm button */}
              <span style={{
                position: 'absolute', inset: 0,
                background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.1) 0px, transparent 1px, rgba(0,0,0,0.1) 2px)',
                pointerEvents: 'none',
              }} />
              <span style={{ position: 'relative', zIndex: 1 }}>{confirmText}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

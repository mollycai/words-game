import { useEffect } from 'react'
import Button from './Button'

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl p-8 max-w-sm w-full mx-4 shadow-xl animate-pop-in">
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-muted mb-6">{message}</p>
        <div className="flex gap-3 justify-end">
          <Button variant="ghost" onClick={onCancel}>{cancelText}</Button>
          <Button variant={variant === 'danger' ? 'danger' : 'primary'} onClick={onConfirm}>
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  )
}

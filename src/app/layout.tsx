import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '英文单词消消乐 - Word Match',
  description: '课堂互动单词竞赛游戏',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className="bg-arcade text-main min-h-screen">
        {children}
      </body>
    </html>
  )
}

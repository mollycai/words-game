import type { Metadata } from 'next'
import { Press_Start_2P } from 'next/font/google'
import './globals.css'

const pressStart = Press_Start_2P({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-press-start',
})

export const metadata: Metadata = {
  title: '英文单词消消乐 - Word Match',
  description: '课堂互动单词竞赛游戏',
  icons: { icon: '/game_icon.ico' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" className={pressStart.variable}>
      <body className="bg-arcade text-main min-h-screen">
        {children}
      </body>
    </html>
  )
}

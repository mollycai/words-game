import type { Metadata } from 'next'
import { Press_Start_2P, ZCOOL_QingKe_HuangYou } from 'next/font/google'
import './globals.css'

const pressStart = Press_Start_2P({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-press-start',
})

const zcoolPixel = ZCOOL_QingKe_HuangYou({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-zcool-pixel',
})

export const metadata: Metadata = {
  title: '英文单词消消乐 - Word Match',
  description: '课堂互动单词竞赛游戏',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" className={`${pressStart.variable} ${zcoolPixel.variable}`}>
      <body className="bg-arcade text-main min-h-screen">
        {children}
      </body>
    </html>
  )
}

'use client'

import Link from 'next/link'
import Button from '@/components/ui/Button'

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
        <span className="absolute top-[10%] left-[10%] text-6xl text-primary-100 font-bold rotate-[-15deg]">A</span>
        <span className="absolute top-[20%] right-[15%] text-5xl text-primary-100 font-bold rotate-[10deg]">B</span>
        <span className="absolute bottom-[15%] left-[20%] text-5xl text-primary-100 font-bold rotate-[5deg]">C</span>
        <span className="absolute bottom-[20%] right-[10%] text-6xl text-primary-100 font-bold rotate-[-10deg]">D</span>
      </div>

      <div className="relative z-10 text-center space-y-8">
        <div>
          <h1 className="text-5xl font-extrabold text-primary-500 mb-2">英文单词消消乐</h1>
          <p className="text-xl text-muted">Word Match</p>
        </div>

        <p className="text-muted max-w-xs mx-auto">
          课堂互动单词竞赛游戏 · 教师导入单词表 · 学生同屏竞技
        </p>

        <Link href="/setup">
          <Button size="lg" className="text-xl px-12 py-5 rounded-2xl shadow-lg">
            开始游戏
          </Button>
        </Link>
      </div>
    </main>
  )
}

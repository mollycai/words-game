<p align="center">
  <img src="https://img.shields.io/badge/Next.js-14-blue?logo=next.js" alt="Next.js">
  <img src="https://img.shields.io/badge/React-18-61DAFB?logo=react" alt="React">
  <img src="https://img.shields.io/badge/Tailwind-3.4-38B2AC?logo=tailwind-css" alt="Tailwind">
  <img src="https://img.shields.io/badge/Zustand-5-764ABC" alt="Zustand">
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript" alt="TypeScript">
  <img src="https://img.shields.io/badge/pnpm-10-F69220?logo=pnpm" alt="pnpm">
</p>

<h1 align="center">📚 英文单词消消乐</h1>
<p align="center"><strong>Word Match</strong> — 课堂互动单词竞赛游戏</p>

<p align="center">
  教师导入单词表 · 学生同屏竞技 · 趣味消除玩法
</p>

<p align="center">
  <a href="https://mollycai.dpdns.org"><strong>🔗 在线体验</strong></a>
</p>

---

## ✨ 特性

- 🎮 **同屏多人竞技** — 支持 1-3 人在同一设备上比赛，无需联机，适合课堂大屏/互动白板
- 📄 **Excel 一键导入** — 上传 .xlsx/.xls 单词表即可生成比赛，支持中考词汇等任意词库
- ⚡ **即时反馈** — 点击英文块 → 点击中文释义，配对正确消除、错误抖动提示
- ⏱️ **独立计时** — 每位选手独立计时，毫秒级精度，先完成先排名
- 🎯 **裁判模式** — 教师可暂停比赛、让选手弃权，课堂秩序完全可控
- 🏆 **排名展示** — 金银铜牌 + 用时排名，冠军特别展示
- 💾 **本地缓存** — 设置和单词表自动保存到浏览器，刷新不丢失

## 🚀 快速开始

```bash
# 1. 克隆项目
git clone <repo-url> words-game
cd words-game

# 2. 安装依赖（需要 pnpm）
pnpm install

# 3. 启动开发服务器
pnpm dev

# 4. 打开浏览器
open http://localhost:3000
```

### 准备单词表

准备一份 Excel 文件（.xlsx / .xls），格式如下：

| 英文 (列A) | 中文释义 (列B) |
|-----------|--------------|
| apple | n. 苹果 |
| abandon | v. 放弃 |
| book | n. 书 |
| ... | ... |

> 项目中包含示例词汇表：`docs/中考英语词汇100.xlsx`

## 🎯 使用流程

```
🟢 开始界面          →  点击「开始游戏」
⚙️ 比赛设置          →  选择人数(1-3) → 上传 Excel → 设置单词数(≥10)
3️⃣ 倒计时 3-2-1-GO!
🎮 比赛进行中        →  选手点击英文块 → 点击对应中文块 → 消除!
📊 排名展示          →  金银铜牌 → 用时 → 再来一局
```

## 🛠️ 技术栈

| 类别 | 技术 | 说明 |
|------|------|------|
| 框架 | Next.js 14 (App Router) | 全栈框架，API Routes 预留后端扩展 |
| UI | React 18 + Tailwind CSS 3.4 | 原子化 CSS，自定义语义色 Design Token |
| 状态管理 | Zustand 5 | 轻量、支持多选手独立状态高频更新 |
| 类型 | TypeScript 5 | 严格模式 |
| Excel 解析 | SheetJS (xlsx) | 客户端解析，无需上传服务器 |
| 存储 | localStorage | 设置偏好 + 单词表缓存 |
| 包管理 | pnpm | 快速、节省磁盘空间 |

## 📁 项目结构

```
src/
├── app/                      # Next.js App Router 页面
│   ├── page.tsx              # 首页（开始界面）
│   ├── layout.tsx            # 根布局
│   ├── globals.css           # 全局样式 + 动画 keyframes
│   ├── setup/page.tsx        # 比赛设置页
│   ├── game/page.tsx         # 比赛进行页
│   ├── result/page.tsx       # 排名结果页
│   └── api/words/route.ts    # API 脚手架（v2 扩展用）
├── components/
│   ├── ui/                   # 通用 UI 组件
│   │   ├── Button.tsx        # 按钮（5 种 variant、3 种 size）
│   │   ├── Modal.tsx         # 模态对话框（Escape 关闭）
│   │   └── Countdown.tsx     # 全屏倒计时（3-2-1-GO!）
│   ├── game/                 # 比赛相关组件
│   │   ├── GameLayout.tsx    # 比赛主控制器（状态机 + 计时循环）
│   │   ├── RefereeToolbar.tsx # 裁判工具栏（暂停/放弃/返回）
│   │   ├── PlayerArea.tsx    # 选手答题区容器
│   │   ├── PlayerTimer.tsx   # 选手计时器
│   │   ├── BlockGrid.tsx     # 单词块网格布局
│   │   └── WordBlock.tsx     # 单词卡片（选中/消除/抖动）
│   ├── setup/                # 设置相关组件
│   │   ├── PlayerCountSelector.tsx
│   │   ├── WordCountInput.tsx
│   │   └── ExcelUploader.tsx
│   └── result/               # 结果相关组件
│       ├── Podium.tsx        # 冠军领奖台
│       └── RankCard.tsx      # 排名卡片
├── stores/
│   ├── setupStore.ts         # 设置状态（含 localStorage 持久化）
│   └── gameStore.ts          # 比赛核心状态（状态机 + 消除逻辑）
├── lib/
│   ├── gameLogic.ts          # 洗牌/抽词/匹配/排名/格式化
│   ├── wordParser.ts         # Excel 文件解析
│   └── storage.ts            # localStorage 读写工具
└── types/
    └── index.ts              # WordPair / Block / PlayerState 等类型
```

## 🎨 配色方案

| Token | 色值 | 用途 |
|-------|------|------|
| Primary | `#4A90D9` | 主色、按钮、选中态 |
| Success | `#34C759` | 消除成功、完成态 |
| Danger | `#FF3B30` | 匹配失败、弃权、错误 |
| Warning | `#FF9500` | 暂停、倒计时 |
| 选手 1 | `#4A90D9` | 蓝色 |
| 选手 2 | `#FF9500` | 橙色 |
| 选手 3 | `#34C759` | 绿色 |

## 📝 开发命令

```bash
pnpm dev          # 启动开发服务器 (localhost:3000)
pnpm build        # 生产构建
pnpm start        # 启动生产服务器
pnpm lint         # 代码检查
pnpm exec tsc --noEmit  # TypeScript 类型检查
```

## 🗺️ 路线图

- [x] v1.0 — 核心可用：比赛设置、同屏竞技、裁判控制、排名展示
- [ ] v1.1 — 体验增强：音效开关、比赛历史、主题切换、选手名称自定义
- [ ] v1.2 — 教学功能：错词统计、成绩单导出、车轮战模式

## 📄 License

MIT

---

<p align="center">Made for the Classroom ❤️</p>

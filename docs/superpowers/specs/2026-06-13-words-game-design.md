# 英文单词消消乐 — 技术设计文档

---

## 文档信息

| 字段 | 内容 |
|------|------|
| 版本 | v1.1 |
| 日期 | 2026-06-13 |
| 关联 PRD | PRD-英文单词消消乐.md |
| 范围 | v1 核心可用版本 + 自测修复 |

---

## 1. 技术选型

| 类别 | 选择 | 说明 |
|------|------|------|
| 框架 | Next.js (App Router) | 全栈框架，API Routes 为后续扩展预留后端能力 |
| UI 库 | React 18 | 用户指定版本 |
| 样式 | Tailwind CSS | 原子化 CSS，快速开发 |
| 包管理 | pnpm | 用户指定 |
| 状态管理 | Zustand | 轻量，适合多选手独立状态和高频更新 |
| 客户端存储 | localStorage + IndexedDB 预留 | v1 比赛数据全程内存，设置偏好落 localStorage |
| 类型检查 | TypeScript | 类型安全 |

### 版本约束

```json
{
  "next": "14.x",
  "react": "^18.3.0",
  "react-dom": "^18.3.0",
  "tailwindcss": "^3.4.0",
  "zustand": "^5.0.0",
  "typescript": "^5.0.0"
}
```

---

## 2. 配色方案

基于「清新教育风」，语义化 Design Token，直接映射到 Tailwind Config。

### 2.1 语义色

| Token | 色值 | 用途 |
|-------|------|------|
| `primary.500` | `#4A90D9` | 主按钮、链接、选中态 |
| `primary.100` | `#D6E8FA` | 浅色背景 |
| `success.500` | `#34C759` | 消除成功、完成态 |
| `danger.500` | `#FF3B30` | 匹配失败、弃权、错误 |
| `warning.500` | `#FF9500` | 倒计时、暂停态、确认框 |

### 2.2 选手标识色

| 选手 | 色值 | 色名 |
|------|------|------|
| 选手 1 | `#4A90D9` | Blue |
| 选手 2 | `#FF9500` | Orange |
| 选手 3 | `#34C759` | Green |

### 2.3 中性色

| Token | 色值 | 用途 |
|-------|------|------|
| `surface.page` | `#F8F9FA` | 页面背景 |
| `surface.card` | `#FFFFFF` | 卡片/块背景 |
| `text.main` | `#1A1A2E` | 主文字 |
| `text.muted` | `#6B7280` | 次要文字 |

### 2.4 Tailwind Config

```ts
// tailwind.config.ts
colors: {
  primary:   { 100: '#D6E8FA', 300: '#6BA5E3', 500: '#4A90D9', 700: '#3A7BC8' },
  success:   { 100: '#D4F5DD', 300: '#6DD98A', 500: '#34C759', 700: '#2DB84D' },
  danger:    { 100: '#FFD6D4', 300: '#FF6B63', 500: '#FF3B30', 700: '#E0352B' },
  warning:   { 100: '#FFEACC', 300: '#FFB84D', 500: '#FF9500', 700: '#E08500' },
  player:    { 1: '#4A90D9', 2: '#FF9500', 3: '#34C759' },
  surface:   { page: '#F8F9FA', card: '#FFFFFF' },
  text:      { main: '#1A1A2E', muted: '#6B7280' },
}
```

---

## 3. 项目结构

```
words-game/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # 根布局（字体、全局样式）
│   │   ├── page.tsx                # 开始界面 /
│   │   ├── setup/
│   │   │   └── page.tsx            # 比赛设置 /setup
│   │   ├── game/
│   │   │   └── page.tsx            # 比赛界面 /game
│   │   ├── result/
│   │   │   └── page.tsx            # 排名结果 /result
│   │   └── api/
│   │       └── words/
│   │           └── route.ts        # POST 解析 Excel (脚手架)
│   │
│   ├── components/
│   │   ├── ui/                     # 通用 UI 组件
│   │   │   ├── Button.tsx
│   │   │   ├── Modal.tsx
│   │   │   └── Countdown.tsx
│   │   ├── game/                   # 比赛相关组件
│   │   │   ├── GameLayout.tsx      # 多人水平布局容器
│   │   │   ├── PlayerArea.tsx      # 单个选手答题区
│   │   │   ├── WordBlock.tsx       # 单词卡片块
│   │   │   ├── BlockGrid.tsx       # 块网格排列
│   │   │   ├── PlayerTimer.tsx     # 选手计时器
│   │   │   └── RefereeToolbar.tsx  # 裁判工具栏
│   │   ├── setup/                  # 设置相关组件
│   │   │   ├── PlayerCountSelector.tsx
│   │   │   ├── WordCountInput.tsx
│   │   │   └── ExcelUploader.tsx
│   │   └── result/                 # 结果相关组件
│   │       ├── RankCard.tsx
│   │       └── Podium.tsx
│   │
│   ├── stores/
│   │   ├── setupStore.ts           # 设置状态 (Zustand)
│   │   └── gameStore.ts            # 比赛核心状态 (Zustand)
│   │
│   ├── lib/
│   │   ├── wordParser.ts           # Excel 解析（前端 xlsx 库）
│   │   ├── gameLogic.ts            # 抽词、打乱、匹配判断
│   │   └── storage.ts              # localStorage/IndexedDB 工具
│   │
│   └── types/
│       └── index.ts                # WordPair, Block, Player 等类型
│
├── public/
│   └── sounds/                     # 音效文件（可选）
│
├── tailwind.config.ts
├── tsconfig.json
├── next.config.js
└── package.json
```

---

## 4. 核心类型定义

```ts
// src/types/index.ts

interface WordPair {
  id: string;
  english: string;
  chinese: string;  // 含词性，如 "n. 苹果"
}

interface Block {
  id: string;
  wordPairId: string;
  type: 'english' | 'chinese';
  text: string;
  status: 'normal' | 'selected' | 'matched';
}

interface PlayerState {
  id: number;           // 1 | 2 | 3
  name: string;         // "选手 1"
  color: string;        // player color token
  blocks: Block[];      // 该选手的块数组
  elapsed: number;      // 已用时间 (ms)
  finished: boolean;    // 是否完成
  quit: boolean;        // 是否弃权
  quitTime: number | null;
}

type GameStatus = 'idle' | 'countdown' | 'playing' | 'paused' | 'finished';

interface SetupState {
  playerCount: number;       // 1-3
  wordCount: number;         // >= 10
  wordPairs: WordPair[];     // 导入的全部单词
  sourceFileName: string;    // Excel 文件名
}
```

---

## 5. 状态管理设计

### 5.1 setupStore (Zustand)

```ts
// src/stores/setupStore.ts
interface SetupStore extends SetupState {
  setPlayerCount: (n: number) => void;
  setWordCount: (n: number) => void;
  setWordPairs: (pairs: WordPair[]) => void;
  setSourceFileName: (name: string) => void;
  reset: () => void;
}
```

- 设置页操作，导入 Excel 后写入
- 进入比赛时，gameStore 从此 store 读取配置初始化

### 5.2 gameStore (Zustand)

```ts
// src/stores/gameStore.ts
interface GameStore {
  status: GameStatus;
  players: PlayerState[];
  selectedBlock: { playerId: number; blockId: string } | null;

  // 生命周期
  initGame: (setup: SetupState) => void;
  startCountdown: () => void;
  startGame: () => void;

  // 裁判操作
  pauseGame: () => void;
  resumeGame: () => void;
  quitPlayer: (playerId: number) => void;

  // 选手操作
  selectBlock: (playerId: number, blockId: string) => void;
  checkMatch: (playerId: number, blockId: string) => MatchResult;

  // 计时
  tick: (playerId: number, delta: number) => void;
  finishPlayer: (playerId: number) => void;
}
```

### 5.3 消除交互流程

```
选手点击块A → selectBlock() → 块A 变为 selected
选手点击块B → checkMatch() →
  ├─ 匹配成功 → 块A + 块B 变为 matched（消除动画后移除）
  │   └─ 检查是否全部消除 → 是 → finishPlayer()
  └─ 匹配失败 → 块A + 块B 短暂 wrong 反馈 → 恢复 normal
```

---

## 6. 页面路由与数据传递

| 路由 | 页面 | 数据来源 |
|------|------|---------|
| `/` | 开始界面 | 无 |
| `/setup` | 比赛设置 | setupStore |
| `/game` | 比赛进行中 | setupStore → gameStore.initGame() |
| `/result` | 排名结果 | gameStore.players (通过 router 或 store 传递) |

- 页面间导航使用 `next/navigation` 的 `useRouter`
- result 页面从 gameStore 读取最终排名（gameStore 在比赛结束后不清空，直到返回设置页）

---

## 7. 比赛状态机

```
idle ──→ countdown ──→ playing ──→ finished
              ↑            │
              │            ↓
              │      paused (可切换)
              │            │
              └── 返回 ────┘ (返回设置页，回到 idle)
```

| 状态 | 允许的操作 |
|------|-----------|
| `idle` | 无（在设置页） |
| `countdown` | 返回（回到设置页） |
| `playing` | 选手点击消除、暂停、放弃、返回 |
| `paused` | 继续、放弃、返回 |
| `finished` | 仅查看结果，跳转至 /result |

---

## 8. 存储策略

### v1 实现

| 数据 | 存储位置 | 生命周期 |
|------|---------|---------|
| 设置偏好 | `localStorage` | 持久化，下次打开恢复 |
| 导入的单词表 | `localStorage` (JSON) | 持久化缓存，下次可复用 |
| 比赛状态 | Zustand (内存) | 比赛期间，刷新即丢失 |
| 比赛结果 | Zustand (内存) | 跳转至结果页期间 |

### IndexedDB 预留

在 `src/lib/storage.ts` 中封装 `wordDB` 工具，提供 `saveWords` / `loadWords` / `listWordSets` 接口。v1 实际调用 localStorage 实现，v1.1+ 切换到 IndexedDB，接口不变。

---

## 9. 关键交互细节

### 9.1 倒计时

- 全屏居中，大字显示 3 → 2 → 1 → GO!
- 每步 1 秒，使用 `setInterval` 或 `requestAnimationFrame`
- 期间选手可看到自己的单词块但不能交互
- GO! 后进入 `playing` 状态

### 9.2 计时器

- 精度：十分之一秒（显示 `00:00.0`）
- 实现：每个选手独立计时，使用 `requestAnimationFrame` 累加 delta
- 暂停时停止累加

### 9.3 单词块网格

- N 个单词 → 2N 个块（N 个英文 + N 个中文）
- 网格排列：用 CSS Grid，尽量接近正方形（如 20 个块 → 4×5 或 5×4）
- 英文块和中文块有轻微视觉区分（英文块白底蓝边框，中文块白底橙边框），但差异细微

### 9.4 匹配判断

- 不限制先点英文还是中文，任意两个块比较
- 同一类型的两个块（英文+英文 或 中文+中文）→ 匹配失败
- 不同类型但 wordPairId 不同 → 匹配失败
- 不同类型且 wordPairId 相同 → 匹配成功

### 9.5 动画

- 选中：轻微上浮 (translateY -2px) + 边框高亮 + 阴影
- 消除成功：scale(0) + opacity(0)，300ms，CSS transition
- 匹配失败：水平抖动 (translateX ±5px × 3)，400ms，CSS keyframe

---

## 10. 异常与边界处理

| 场景 | 处理 |
|------|------|
| Excel 解析失败 | Toast 提示，不更新 setupStore |
| 单词数不足 | 「开始比赛」按钮置灰 + 提示文案 |
| 比赛中刷新页面 | 比赛状态丢失，回到首页（v1 不做恢复） |
| 选手全部弃权 | 直接结束，结果页显示全部弃权 |
| 单词块已被消除后再被某种方式引用 | 匹配判断时过滤 status === 'matched' 的块 |

---

## 11. 不做（Out of Scope for v1）

- 联机/网络对战
- 数据库持久化
- 音效系统（保留接口，不实现）
- 比赛历史记录
- 选手名称自定义
- 错词统计
- 多套主题切换
- beforeunload 拦截

---

## 12. 自审清单

- [x] 无 TBD/TODO 占位符
- [x] 类型定义覆盖所有核心实体
- [x] 状态机覆盖所有合法转换
- [x] 存储策略明确 v1 范围
- [x] 异常场景有对应处理
- [x] Out of Scope 明确边界
- [x] 与 PRD 保持一致

---

## 13. v1.1 自测修复记录

### 13.1 设置页 SSR Hydration 错误

**问题**: `setupStore` 在模块初始化时调用 `loadSetupPrefs()` 读取 localStorage。SSR 时服务端无 localStorage 返回 null，客户端有值，导致 React hydration mismatch。

**修复**: setupStore 默认值始终为初始值，新增 `hydrate()` 方法在客户端 `useEffect` 中调用，读取 localStorage 并更新 store。`hydrated` 标志防止重复 hydrate。

### 13.2 单词表持久化与删除

**问题**: 上传的 Excel 文件在刷新后丢失，无法删除已导入的单词表。

**修复**: 
- `setupStore.hydrate()` 同时从 localStorage 恢复缓存的 wordPairs
- 新增 `clearWordPairs()` action，同时清除内存和 localStorage
- `ExcelUploader` 新增 `onClear` 回调，显示删除按钮（🗑），点击后清除文件可重新上传

### 13.3 比赛界面 UI 重构 + 暂停修复

**问题**: 比赛界面设计简陋；暂停后无法恢复（暂停遮罩层覆盖了工具栏的「继续」按钮）。

**修复**:
- **z-index 层级**: 倒计时 z-50 > 工具栏 z-40 > 暂停遮罩 z-30（`pointer-events-none`）。工具栏始终在暂停遮罩上方可点击
- **WordBlock 重设计**: 卡片渐变背景（英文蓝底/中文橙底）、类型飘带角标（EN/中）、选中态上浮+阴影、匹配成功缩放消失
- **PlayerTimer 重设计**: 选手色渐变背景卡片、完成/弃权独立状态样式
- **PlayerArea 重设计**: 弃权区虚线边框+选手色、完成区色块提示
- **RefereeToolbar 重设计**: 白底毛玻璃+状态指示灯、分隔线、按钮样式优化
- **Button 组件**: 新增 `success` variant（绿色）

### 13.4 结果页返回设置导航错误

**问题**: 点击「返回设置」实际跳转到首页 `/`。原因是 `reset()` 将 `players` 清空，触发 `useEffect` 中 `players.length === 0` 的 `/` 重定向，覆盖了 `router.push('/setup')`。

**修复**: 使用 `useRef` 记录是否已加载过有效结果数据。只有首次挂载且无数据时才重定向到 `/`。

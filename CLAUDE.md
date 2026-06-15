# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 语言偏好

- 与本 CLI 的所有交互文字一律使用中文。

## 项目概述

紫微斗数 AI 命理 Web 应用。面向普通消费者的在线算命平台，AI 大模型解读 + 按次付费模式，部署在 Vercel。

## 构建与开发命令

```bash
# 开发服务器
npm run dev

# 构建
npm run build

# 运行所有测试
npx vitest run

# 运行单个测试文件
npx vitest run src/__tests__/engine.test.ts

# 监听模式运行测试
npx vitest

# 类型检查
npx tsc --noEmit

# 数据库迁移生成
npx drizzle-kit generate

# 数据库迁移执行
npx drizzle-kit push

# Lint
npm run lint
```

## 技术栈

- **全栈框架**: Next.js 14 App Router + TypeScript
- **样式**: TailwindCSS + shadcn/ui
- **数据库**: Vercel Postgres (Neon) + Drizzle ORM
- **缓存**: Upstash Redis
- **认证**: Auth.js v5
- **AI**: Vercel AI SDK + Claude API
- **支付**: PayJS 聚合支付（微信+支付宝）
- **测试**: Vitest

## 代码架构

```
src/
├── engine/           # 紫微斗数排盘引擎（纯逻辑，无外部依赖）
│   ├── types.ts      # 核心类型：天干地支、十二宫、十四主星、命盘等
│   ├── calendar.ts   # 公历↔农历互转（封装 lunar-typescript）
│   ├── palaces.ts    # 命宫/身宫/十二宫/五行局/紫微星定位
│   ├── stars.ts      # 十四主星 + 辅星安放算法
│   ├── sihua.ts      # 四化（禄权科忌）计算
│   ├── chart.ts      # 排盘主流程入口：calculateChart()
│   ├── daxian.ts     # 大限推算
│   └── liunian.ts    # 流年/流月/流日推算
├── ai/               # AI 解读模块
├── db/               # 数据库 Schema + 连接
├── lib/              # 工具库（Auth、支付、短信）
├── app/api/          # Next.js API Routes
└── components/       # React 组件
```

## 核心排盘流程

1. `calculateChart(solarYear, solarMonth, solarDay, hour, gender)` → 返回完整 `ChartData`
2. 内部调用链：公历→农历 → 安命宫/身宫 → 定十二宫 → 五行局 → 安紫微 → 安十四主星 → 安辅星 → 安四化 → 起大限 → 格局识别
3. 排盘引擎是纯函数，不依赖数据库或外部 API

## 关键设计原则

- 排盘引擎 `src/engine/` 是纯计算逻辑，可独立测试
- API Routes 仅做参数校验 + 调用引擎，不包含业务逻辑
- 命盘数据以 JSON 格式存储，方便 AI Prompt 注入

# 普京总统足迹地图 (1999–2025)

## 项目简介

一个交互式地图应用，展示俄罗斯总统普京从1999年至2025年的重要足迹、国际访问路径和权力轨迹。采用俄罗斯风格的沉浸式设计，融合了历史数据、实时动画和多媒体交互。

**Slogan:** От Кремля до Тихого океана — одна воля, одна Россия
（从克里姆林宫到太平洋——同一个意志，同一个俄罗斯）

## 核心功能

### 🗺️ 交互式地图
- **Leaflet地图集成** - 支持缩放、平移、点击交互
- **事件标记系统** - 按类型显示不同颜色的事件标记
- **实时路径动画** - GSAP驱动的飞行轨迹连线
- **克里米亚路线** - 金色高亮显示特殊路线

### 📅 时间轴导航
- **年份选择器** - 1999-2025年完整覆盖
- **核按钮手提箱进度条** - 跟随时间轴移动的动画指示器
- **事件列表** - 按年份显示的历史事件

### 🎤 多媒体系统
- **音频控制** - 循环播放俄罗斯国歌，支持暂停/音量调节
- **多语言弹幕** - 中文/俄语/英语评论实时滚动
- **快捷键支持** - Space(播放)、←→(导航)、K(统计)

### 📊 数据可视化
- **飞行距离图表** - 展示历年飞行里程趋势
- **访问国家统计** - 国家数量和类型分布
- **握手次数统计** - 外交活动数据
- **演讲统计** - 重要讲话数量

## 技术栈

| 层级 | 技术 | 说明 |
|------|------|------|
| **前端框架** | React 19 + Vite | 现代化UI框架 |
| **地图库** | Leaflet 1.9 | 开源地图引擎 |
| **动画库** | GSAP 3.14 | 高性能动画 |
| **数据可视化** | ECharts 6.0 | 交互式图表 |
| **样式** | Tailwind CSS 4 | 原子化CSS框架 |
| **后端** | Express 4 + tRPC 11 | 类型安全API |
| **数据库** | MySQL/TiDB | 关系型数据库 |
| **认证** | Manus OAuth | 用户认证系统 |

## 项目结构

```
putin-map/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── PutinMap.tsx          # 主地图组件
│   │   │   ├── Timeline.tsx          # 时间轴组件
│   │   │   ├── BulletScreen.tsx      # 弹幕系统
│   │   │   ├── AudioControl.tsx      # 音频控制
│   │   │   ├── Statistics.tsx        # 数据可视化
│   │   │   ├── PathAnimation.tsx     # 路径动画
│   │   │   └── CrimeaRoute.tsx       # 克里米亚路线
│   │   ├── pages/
│   │   │   └── Home.tsx              # 主页面
│   │   ├── App.tsx                   # 应用入口
│   │   └── index.css                 # 俄式美学样式
│   └── public/
├── server/
│   ├── routers.ts                    # tRPC路由定义
│   ├── db.ts                         # 数据库查询
│   └── events.test.ts                # 单元测试
├── drizzle/
│   ├── schema.ts                     # 数据库模式
│   └── migrations/                   # 数据库迁移
├── scripts/
│   └── seed-events.mjs               # 数据种子脚本
└── todo.md                           # 项目待办清单
```

## 快速开始

### 环境要求
- Node.js 22+
- pnpm 10+
- MySQL/TiDB 数据库

### 安装依赖
```bash
pnpm install
```

### 数据库初始化
```bash
# 推送数据库模式
pnpm db:push

# 种子数据（可选）
node scripts/seed-events.mjs
```

### 开发服务器
```bash
pnpm dev
```

访问 `http://localhost:3000` 查看应用。

### 构建生产版本
```bash
pnpm build
pnpm start
```

### 运行测试
```bash
pnpm test
```

## 数据模式

### Events 表
存储普京的历史足迹和访问记录。

| 字段 | 类型 | 说明 |
|------|------|------|
| id | INT | 主键 |
| date | TIMESTAMP | 事件日期 |
| year | INT | 年份 |
| title | TEXT | 事件标题 |
| description | TEXT | 事件描述 |
| type | ENUM | 事件类型 |
| latitude | VARCHAR | 纬度 |
| longitude | VARCHAR | 经度 |
| location | VARCHAR | 地点 |
| country | VARCHAR | 国家 |
| significance | INT | 重要程度(1-10) |
| verified | BOOLEAN | 是否验证 |

### Statistics 表
存储按年份的统计数据。

| 字段 | 类型 | 说明 |
|------|------|------|
| year | INT | 年份 |
| totalFlightDistance | INT | 飞行总里程(km) |
| countriesVisited | INT | 访问国家数 |
| domesticVisits | INT | 国内访问数 |
| internationalVisits | INT | 国际访问数 |
| handshakesCount | INT | 握手次数 |
| speechesCount | INT | 演讲次数 |

## API 端点

所有API通过tRPC提供，路径为 `/api/trpc/*`

### Events
- `events.all()` - 获取所有事件
- `events.byYear(year)` - 按年份获取事件
- `events.byId(id)` - 按ID获取事件

### Statistics
- `statistics.all()` - 获取所有统计
- `statistics.byYear(year)` - 按年份获取统计

### Bullet Comments
- `bulletComments.byEvent(eventId)` - 获取事件的评论

## 俄式美学设计

### 配色方案
- **克里姆林宫红** (#8B0000) - 主色调
- **俄罗斯国旗蓝** (#0039A6) - 次色调
- **东正金** (#D4AF37) - 强调色
- **深灰黑** (#0F0F0F) - 背景色

### 字体
- **Playfair Display** - 标题（西里尔书法风格）
- **Crimson Text** - 正文（优雅衬线体）

### 特效
- **脉冲光晕** - 克里姆林宫红光效
- **浮动动画** - 元素轻微上下浮动
- **渐变背景** - 俄罗斯国旗三色渐变

## 快捷键

| 快捷键 | 功能 |
|--------|------|
| `Space` | 播放/暂停音频 |
| `←` | 上一年 |
| `→` | 下一年 |
| `K` | 显示/隐藏统计面板 |

## 浏览器兼容性

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- 移动浏览器（iOS Safari, Chrome Mobile）

## 性能优化

- 地图瓦片使用 CartoDB Dark 暗色主题
- 动画使用 GSAP 高性能库
- 数据可视化使用 ECharts 优化渲染
- 图表响应式设计，自适应屏幕大小

## 部署

### GitHub Pages
```bash
pnpm build
# 部署 dist 文件夹到 GitHub Pages
```

### Docker
```bash
docker build -t putin-map .
docker run -p 3000:3000 putin-map
```

### Cloudflare Pages
连接 GitHub 仓库，自动部署。

## 贡献指南

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 开启 Pull Request

## 许可证

MIT License - 详见 LICENSE 文件

## 致谢

- Leaflet 地图库
- GSAP 动画库
- ECharts 数据可视化
- Tailwind CSS 框架
- Manus 平台

## 联系方式

如有问题或建议，请提交 Issue 或 Pull Request。

---

**最后更新:** 2025年12月
**项目状态:** 🚀 生产就绪

# duan (Raycast 扩展)

基于 Cloudflare Workers 和 D1 数据库的 URL 短链接服务

## 项目结构

```
src/
├── components/
│   ├── LinkDetail.tsx     # 链接详情视图组件
│   └── LinkItem.tsx       # 链接列表项组件
├── hooks/
│   └── useLinks.ts       # 链接列表获取和缓存 hook
├── services/
│   ├── api/
│   │   ├── endpoints/
│   │   │   └── links.ts   # 链接相关的 API 端点
│   │   ├── client.ts      # HTTP 客户端实现
│   │   ├── config.ts      # API 配置
│   │   ├── types.ts       # API 类型定义
│   │   └── index.ts       # API 导出
│   └── validation/
│       ├── slug/
│       │   ├── cache.ts   # Slug 缓存实现
│       │   ├── index.ts   # Slug 验证逻辑
│       │   └── types.ts   # Slug 验证类型
│       └── url/
│           ├── index.ts   # URL 验证逻辑
│           └── types.ts   # URL 验证类型
├── list-links.tsx        # 列出短链接命令
└── shorten-link.tsx      # 创建短链接命令
```

## 缓存机制

Raycast 提供了三种不同的缓存机制，每种都适用于特定场景：

### Cache (底层 API)
- **特点：**
  - 基础的键值存储
  - 同步操作
  - 完全可控的缓存管理
  - 可在非 React 环境使用
- **最适合：**
  - 在非 React 代码中使用缓存
  - 需要精确控制缓存的读写操作
  - 实现自定义缓存策略
  - 表单验证缓存

### useCachedState (React Hook)
- **特点：**
  - 类似 useState 但会持久化
  - 适合存储 UI 状态
  - 可在组件间共享
- **最适合：**
  - 在应用重启后保持 UI 状态
  - 在多个组件间共享持久化状态
  - 存储用户偏好设置
  - UI 配置持久化

### useCachedPromise (React Hook)
- **特点：**
  - 实现了 stale-while-revalidate 策略
  - 自动处理加载状态
  - 内置错误处理
  - 针对异步数据获取优化
- **最适合：**
  - 缓存 API 调用结果
  - 实现数据后台刷新
  - 优化数据加载体验
  - 列表数据缓存

### 实现案例

以下是两个具体的使用案例，展示如何选择合适的缓存机制：

#### 链接列表缓存
- **使用场景：** 缓存所有短链接列表
- **选用方案：** `useCachedPromise`
- **原因：**
  - 涉及异步 API 调用获取数据
  - 需要自动后台刷新
  - 需要处理加载状态
  - 受益于 stale-while-revalidate 策略
  - 在显示缓存内容的同时保持数据新鲜度

#### Slug 可用性验证
- **使用场景：** 缓存 slug 可用性检查结果
- **选用方案：** `Cache` (底层 API)
- **实现细节：**
  1. 在 "Shorten Link" 命令加载时：
     - 通过 API 获取所有已使用的 slugs
     - 同步存储到 Cache 中
     - 使用 requestIdleCallback 避免阻塞 UI
     - 包含超时和清理机制
  2. 在表单验证时：
     - 同步读取 Cache
     - 执行格式验证
     - 检查是否与已缓存的 slugs 重复
  3. 优势：
     - 即时的验证反馈
     - 表单验证过程中无异步操作
     - 高效的资源利用
     - 不阻塞命令启动

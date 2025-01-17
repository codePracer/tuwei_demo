
---

# 游戏激活码兑换系统

## 项目简介

该项目是一个用于游戏激活码兑换的系统，支持用户通过输入单个或批量激活码进行兑换。系统包括激活码验证、兑换流程、兑换记录等核心功能，并且支持离线缓存，确保在没有网络的情况下也能继续使用应用。使用React和Node.js实现，并且集成了Service Worker以支持PWA（Progressive Web App）功能。

## 功能实现情况

### 核心功能

1. **激活码处理**：
   - 支持单个激活码输入和批量激活码粘贴（最多10个）。
   - 激活码输入框支持3组4位字符的格式（例如：ABCD-EFGH-IJKL）。
   - 自动去除重复的激活码。
   - 实时格式校验，确保用户输入的激活码符合规定的格式。

2. **兑换流程**：
   - 显示待兑换内容的预览。
   - 支持批量兑换，展示兑换进度（使用Lottie动画）。
   - 兑换结果汇总，包括成功、失败的兑换数量。
   - 提供失败原因分析，支持重试失败的兑换。

3. **兑换记录**：
   - 支持本地历史记录的查看。
   - 支持批次记录管理，用户可以查看兑换的批次记录。
   - 支持兑换结果的筛选和展示。

### 进阶功能（选做）

- **交互优化**：
   - 支持扫码输入功能，简化用户输入。
   - 兑换过程中提供动画效果，提升用户体验。
   - 批量处理时，使用进度条展示当前处理的状态。
   - 提供键盘快捷操作，优化用户体验。
   - 支持失败后的重试机制。

### 离线功能

- **Service Worker**：
   - 实现了离线缓存功能，用户可以在没有网络的情况下继续访问已缓存的静态资源。
   - 使用 `workbox-webpack-plugin` 插件自动生成Service Worker并配置缓存策略。
   - 确保在首次加载时，静态资源会被缓存，后续请求可以直接从缓存获取，提升加载速度。

## 技术选型及理由

1. **前端**：React + Webpack
   - **React**：作为现代前端开发的流行框架，React提供了组件化的开发模式，能够有效管理复杂的UI交互。
   - **Webpack**：用于打包前端资源，支持模块化、代码分割等特性，并且通过插件支持热重载和优化打包过程。

2. **后端**：Node.js + Express
   - **Node.js**：基于JavaScript的高性能服务端框架，适合I/O密集型应用，能够与前端React很好的结合，支持高并发请求处理。
   - **Express**：轻量级、灵活的Node.js框架，用于快速搭建API服务。

3. **离线缓存**：
   - **Service Worker**：通过使用Service Worker实现离线缓存，利用Workbox插件进行缓存管理，确保应用在网络不稳定或离线时依然可用。

4. **动画**：
   - **Lottie**：用于渲染JSON格式的动画。通过Lottie-Web，可以在React组件中高效地渲染动态动画，提升用户体验。

5. **状态管理**：
   - **React Hooks**：简化了组件内的状态管理，提升代码可读性和复用性。

## 遇到的问题和解决方案

1. **激活码格式校验**：
   - 问题：激活码格式校验是一个常见的需求，需要确保用户输入符合特定格式（例如：3组4位字符）。
   - 解决方案：使用正则表达式来进行实时格式校验，在用户输入时动态检查格式是否符合要求。

2. **Service Worker缓存冲突**：
   - 问题：初期在实现Service Worker时，由于静态资源版本的更新，导致缓存的资源过时，需要手动清理缓存。
   - 解决方案：使用 `Workbox` 插件的 `skipWaiting` 和 `clientsClaim` 配置，自动清理旧缓存并更新新版本的资源。

3. **离线功能的实现复杂度**：
   - 问题：离线功能的实现涉及到缓存策略、更新机制等多个方面，比较复杂。
   - 解决方案：选择了 `workbox-webpack-plugin` 来自动生成Service Worker，并采用了合适的缓存策略（如 `CacheFirst` 和 `StaleWhileRevalidate`），减少了手动配置的复杂度。

4. **批量兑换进度展示**：
   - 问题：如何优雅地展示批量兑换的进度，同时避免页面卡顿。
   - 解决方案：使用 `Lottie` 动画来展示兑换过程中的进度，确保页面流畅。并且通过Web Workers进行后台处理，避免UI线程被阻塞。

## 限制与权衡决策

### 有限时间内的权衡决策

- **离线功能**：虽然在项目初期，我们希望实现更复杂的离线功能（例如，缓存动态数据），但由于时间限制，我们目前只实现了静态资源的缓存。动态数据缓存（如兑换记录、用户数据等）可能会被放在未来优化的计划中。
  
- **批量处理的进度条**：批量处理进度展示部分采用了简单的Lottie动画代替复杂的进度条实现。虽然可以更细粒度地展示进度（如每个兑换任务的状态），但由于时间限制，目前仅采用了整体进度的展示。

- **交互体验优化**：在功能实现的过程中，注重了基本的用户交互（如输入验证和进度展示）。但更高阶的优化（例如，更复杂的失败重试机制、更多的用户引导等）未能在本周期内完成。

### 如果获得更多时间，未来可做的功能或优化点

1. **动态数据缓存**：
   - 在未来的版本中，可以进一步优化离线功能，支持缓存动态数据（如兑换记录、用户信息等），使得用户在没有网络的情况下能够进行更多的操作。

2. **更完善的错误处理和重试机制**：
   - 目前的失败重试机制较为简单，未来可以进一步优化，比如增加更细致的错误类型分析，并提供不同类型的重试策略。

3. **更流畅的动画和进度展示**：
   - 为了进一步提升用户体验，可以优化Lottie动画的细节，并根据不同的兑换任务动态展示更多信息（例如：每个激活码的兑换进度、成功或失败的原因等）。

4. **跨平台优化**：
   - 目前的系统主要是面向Web端的，未来可以进一步优化为PWA（Progressive Web App）支持，提升在移动端的用户体验，并实现更好的离线功能。

5. **用户登录和账户管理**：
   - 可以增加用户登录和账户管理功能，以便跟踪用户的兑换记录、奖励等。
  
6. **异常、性能、用户行为监控上报完善**：
   - 完善监控上报功能。

7. **动画降级方案（中低端机）**：
   - 动画降级方案

## 安装与运行

### 1. 克隆仓库

```bash

```

### 2. 安装依赖

```bash
npm install
```

### 3. 开发模式运行

```bash
npm run dev
```

### 4. 打包生产版本

```bash
npm run build
```

### 5. 启动服务端

```bash
npm start
```

---

## 结语

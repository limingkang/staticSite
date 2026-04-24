# vue2-pc

这个项目已经切换为 Vite 启动和打包，现有业务代码逻辑保持不变。

## 安装依赖

```bash
npm install
```

## 启动开发环境

```bash
npm run dev
```

如果需要 `uat` 环境变量：

```bash
npm run dev:uat
```

## 打包

```bash
npm run build
npm run build:uat
```

## 环境变量

项目中的环境变量已经统一为 Vite 原生形式：

- `VITE_BASE_API`

## 代理配置

Vite 代理读取 `.env.development` 和 `.env.uat` 中的配置。

如果需要把请求代理到其他服务器，直接修改对应的 target 即可。

# Nx 设置

## 设置一个新的 Nx 工作区

运行以下命令创建一个新的工作区。

```bash
# pass @latest in case npx cached an older version of create-nx-workspace
npx create-nx-workspace@latest
```

在创建工作空间时，您必须选择一个预设，它将为您预配置一些东西。

```bash
# create an empty workspace set up for building applications
npx create-nx-workspace --preset=empty

# create an empty workspace set up for building packages
npx create-nx-workspace --preset=core

# create an empty workspace set up for building packages with the @nrwl/js plugin installed
npx create-nx-workspace --preset=ts
```

一些预设设置了应用程序、端到端测试等。

```bash
npx create-nx-workspace --preset=react
npx create-nx-workspace --preset=react-native
npx create-nx-workspace --preset=angular
```

## 将 Nx 添加到现有的项目中

如果你有一个已经存在的 Lerna 或 Yarn monorepo，你可以在不修改文件结构的情况下获得 Nx 的计算缓存和分布式任务执行的好处:

```bash
npx add-nx-to-monorepo
```

如果你有一个已经存在的 Create React App 项目，你可以通过运行这个命令获得 Nx 的计算缓存和分布式任务执行的好处，而不需要修改文件结构:

```bash
npx cra-to-nx
```

有关将 Nx 添加到现有存储库的更多信息，请参见[迁移指南](/migration/migration-cra)。

## Nx CLI 安装

为了让开发人员的体验更好，您可能希望全局地安装 Nx CLI。

```bash
npm install -g nx
```

## 文件夹结构

Nx 可以添加到任何工作空间，因此没有固定的文件夹结构。然而，如果你使用一个现有的预设值，你可能会看到这样的结果:

```treeview
myorg/
├── apps/
├── libs/
├── tools/
├── workspace.json
├── nx.json
├── package.json
└── tsconfig.base.json
```

`/apps/` 包含应用程序项目。这是可运行应用程序的主要入口点。我们建议尽可能保持应用程序的轻量级，所有繁重的工作都由每个应用程序导入的库来完成。

`/libs/` 包含库项目。库有很多种，每个库都定义了自己的外部 API，以便库之间的边界保持清晰。

`/tools/` 包含作用于代码库的脚本。这可能是数据库脚本，[自定义执行程序](/executors/creating-custom-builders)，或[工作空间生成器](/generators/workspace-generators).

`/workspace.json` 列出工作空间中的每个项目。(这个文件是可选的)

`/nx.json` 配置 Nx CLI 本身。它告诉 Nx 什么需要被缓存，如何运行任务等等。

`/tsconfig.base.json` 设置全局 TypeScript 设置，并为每个库创建别名，以便在创建 TS/JS 导入时提供帮助。

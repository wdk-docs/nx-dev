# 分析和可视化工作空间

为了能够支持 monorepo 风格的开发，这些工具必须知道工作区中不同项目之间的相互依赖程度。
Nx 使用高级代码分析来构建这个项目图。
它给了你一种探索的方式:

## 项目图是如何构建的

Nx 使用两个信息源来创建工作空间中所有项目之间的依赖关系图:

1. Typescript `import` 语句引用了特定项目的路径别名

   例如，如果`my-app`中的一个文件有以下代码:

   ```typescript
   import { something } from '@myorg/awesome-library';
   ```

   然后`my-app`依赖于`awesome-library`

2. 在`nx`文件中手动创建`implicitDependencies`。

   如果你的`nx.json`有这个内容:

   ```json
   {
     "projects": {
       "my-app": {
         "tags": [],
         "implicitDependencies": ["my-api"]
       }
     }
   }
   ```

   `my-app` 依赖 `my-api`

## 循环依赖

循环依赖关系是指项目在传递过程中依赖于自身。
这可能会导致软件设计出现问题，也会降低 Nx 受影响算法的有效性。

如果创建了任何循环依赖，并确保任何跨越项目的`import`语句只从项目的根`index`文件中定义的公共 api 中`import`，那么 lint 规则`nx-enforce-module-boundaries`就会产生错误。
当将一个新的代码库迁移到 nx 工作空间时，您可能会开始发现现有的循环依赖关系。
让我们看看最简单的循环依赖，其中`projectA`依赖于`projectB`，反之亦然。

**要解决循环依赖关系:**

首先，确定导致依赖的`import`语句。
在`projectA`的源文件夹中搜索`@myorg/projectB`的引用，在`projectB`的源文件夹中搜索`@myorg/projectA`的引用。

你可以使用以下三种策略:

1. 寻找可以从一个项目转移到另一个项目的小段代码。
2. 寻找两个库都依赖的代码，并将该代码移动到一个新的共享库中。
3. 将`projectA`和`projectB`合并到一个库中。

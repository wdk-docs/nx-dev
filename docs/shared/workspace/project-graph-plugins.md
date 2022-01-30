# 扩展 Nx 的项目图

> 这个 API 是实验性的，可能会改变。

项目图是源代码在 repo 中的表示。
项目可以有与之关联的文件。项目可以相互依赖。

Nx 最好的特性之一是能够通过分析源代码自动构建项目图。
目前，这在 JavaScript 生态系统中工作得最好，但它可以通过插件扩展到其他语言和技术。

## 添加插件到工作区

你可以通过将插件添加到 `nx.json` 中的 `plugins` 数组中来注册插件:

```json
{
  ...,
  "plugins": [
    "awesome-plugin"
  ]
}
```

## 实现一个项目图形处理器

项目图处理器，接受项目图并返回一个新的项目图。
它可以添加/删除节点和边。

插件应该导出一个名为`processProjectGraph`的函数，用于使用新的节点和边来更新项目图。
这个函数接收两个东西:

- 一个 `ProjectGraph`

  - `graph.nodes` lists all the projects currently known to Nx. `node.data.files` lists the files belonging to a particular project.
  - `graph.dependencies` lists the dependencies between projects.

- 一个 `Context`
  - `context.workspace` contains the combined configuration for the workspace.
  - `files` contains all the files found in the workspace.
  - `filesToProcess` contains all the files that have changed since the last invocation and need to be reanalyzed.

`processProjectGraph`函数应该返回一个更新后的`ProjectGraph`。
这是最容易做到的使用`ProjectGraphBuilder`。
构建器的存在是为了方便，所以您不必使用它。

```typescript
import {
  ProjectGraph,
  ProjectGraphBuilder,
  ProjectGraphProcessorContext,
  DependencyType,
} from '@nrwl/devkit';

export function processProjectGraph(
  graph: ProjectGraph,
  context: ProjectGraphProcessorContext
): ProjectGraph {
  const builder = new ProjectGraphBuilder(graph);
  // We will see how this is used below.
  return builder.getUpdatedProjectGraph();
}
```

## 向项目图中添加新节点

You can add nodes to the project graph. Since first-party code is added to the graph automatically, this is most commonly used for third-party packages.

A Project Graph Plugin can add them to the project graph. After these packages are added as nodes to the project graph, dependencies can then be drawn from the workspace projects to the third party packages as well as between the third party packages.

```typescript
// Add a new node
builder.addNode({
  name: 'new-project',
  type: 'npm',
  data: {
    files: [],
  },
});
```

> Note: You can designate any type for the node. This differentiates third party projects from projects in the workspace. If you are writing a plugin for a different language, it's common to use IPC to get the list of nodes which you can then add using the builder.

## 向项目图中添加新的依赖项

It's more common for plugins to create new dependencies. First-party code contained in the workspace is registered in `workspace.json` and is added to the project graph automatically. Whether your project contains TypeScript or say Java, both projects will be created in the same way. However, Nx does not know how to analyze Java sources, and that's what plugins can do.

You can create 2 types of dependencies.

### 隐式依赖关系

An implicit dependency is not associated with any file, and can be crated as follows:

```typescript
import { DependencyType } from '@nrwl/devkit';

// Add a new edge
builder.addImplicitDependency('existing-project', 'new-project');
```

> Note: Even though the plugin is written in JavaScript, resolving dependencies of different languages will probably be more easily written in their native language. Therefore, a common approach is to spawn a new process and communicate via IPC or `stdout`.
> .

Because an implicit dependency is not associated with any file, Nx doesn't know when it might change, so it will be recomputed every time.

## 显式的依赖关系

Nx knows what files have changed since the last invocation. Only those files will be present in the provided `filesToProcess`. You can associate a dependency with a particular file (e.g., if that file contains an import).

```typescript
import { DependencyType } from '@nrwl/devkit';

// Add a new edge
builder.addExplicitDependency(
  'existing-project',
  'libs/existing-project/src/index.ts',
  'new-project'
);
```

If a file hasn't changed since the last invocation, it doesn't need to be reanalyzed. Nx knows what dependencies are associated with what files, so it will reuse this information for the files that haven't changed.

## 可视化项目图

You can then visualize the project graph as described [here](/structure/dependency-graph). However, there is a cache that Nx uses to avoid recalculating the project graph as much as possible. As you develop your project graph plugin, it might be a good idea to set the following environment variable to disable the project graph cache: `NX_CACHE_PROJECT_GRAPH=false`.

## 示例项目图形插件

The [nrwl/nx-go-project-graph-plugin](https://github.com/nrwl/nx-go-project-graph-plugin) repo contains an example project graph plugin which adds [Go](https://golang.org/) dependencies to the Nx Project Graph! A similar approach can be used for other languages.

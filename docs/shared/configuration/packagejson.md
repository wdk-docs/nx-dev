# 配置: package.json 和 nx.json

每个 Nx 工作区中有两种主要的配置类型: [项目配置](#project-configuration) 和 [Nx CLI 全局配置](#cli-configuration).

项目可以在`package.json`(如果你使用 npm 脚本而不是 Nx executor)和`project.json`(如果你使用 Nx executor)中配置。
`package.json`和`project.json`文件都位于每个项目的文件夹中。
Nx 合并这两个文件以获得每个项目的配置。
本指南介绍了`package.json`的情况。

## 项目配置

在`package.json`中定义的每个 npm 脚本都是你可以通过 Nx 调用的目标。
例如，如果你的项目有以下`package.json`:

```jsonc
{
  "name": "mylib",
  "scripts": {
    "test: "jest",
    "build": "tsc -p tsconfig.lib.json" // the actual command here is arbitrary
  }
}
```

你可以调用`nx build mylib`或`nx test mylib`，而不需要任何额外的配置。

可以通过如下方式添加 nx 相关的配置:

```jsonc
{
  "name": "mylib",
  "scripts": {
    "test: "jest",
    "build": "tsc -p tsconfig.lib.json" // the actual command here is arbitrary
  },
  "nx": {
    "targets": {
      "build": {
        "outputs": ["dist/libs/mylib"],
        "dependsOn": [
          {
            "target": "build",
            "projects": "dependencies"
          }
        ]
      },
      "test": {
        "outputs": [],
        "dependsOn": [
          "target": "build",
          "projects": "self"
        ]
      }
    }
  }
}
```

### 输出

`"outputs": ["dist/libs/mylib"]`告诉 Nx `build`目标将在哪里创建文件构件。
所提供的值实际上是默认值，因此在本例中可以省略它。
`"outputs":[]`告诉 Nx `test`目标不会在磁盘上创建任何工件。

通常不需要这种配置。
Nx 提供了合理的默认值(在`nx.json`中导入)，实现了上面的配置。

### dependsOn

目标可以依赖于其他目标。

一个常见的场景是在构建项目之前必须首先构建项目的依赖项。
这就是`build`目标配置的`dependsOn`属性。
它告诉 Nx，在构建`mylib`之前，它需要确保`mylib`的依赖项也被构建。
这并不意味着 Nx 将重新运行这些构建。
如果正确的工件已经在正确的位置，Nx 将什么都不做。
如果它们不在正确的位置，但在缓存中可用，Nx 将从缓存中检索它们。

另一个常见的场景是目标依赖于同一项目的另一个目标。
例如，`test`目标的`dependsOn`告诉 Nx，在测试`mylib`之前，它需要确保`mylib`已经构建好，这将
结果 mylib 的依赖也被构建了。

通常不需要这种配置。
Nx 提供了合理的默认值(在`nx.json`中导入)，实现了上面的配置。

### 标签

你可以用`tags`来注释你的项目，如下所示:

```jsonc
{
  "name": "mylib",
  "nx": {
    "tags": ["scope:myteam"]
  }
}
```

例如，你可以[使用这些标签配置 lint 规则](/structure/monorepo-tags)来确保属于`myteam`的库不依赖于属于`theirteam`的库。

### implicitDependencies

Nx 使用强大的源代码分析来找出工作空间的项目图。
有些依赖项不能被静态地推导出来，所以你可以像这样手动设置它们:

```jsonc
{
  "name": "mylib",
  "nx": {
    "implicitDependencies": ["anotherlib"]
  }
}
```

你也可以移除依赖如下:

```jsonc
{
  "name": "mylib",
  "nx": {
    "implicitDependencies": ["!anotherlib"] # regardless of what Nx thinks, "mylib" doesn't depend on "anotherlib"
  }
}
```

### 忽略项目

Nx 会将每个带有`package.json`文件的项目添加到项目图中。
如果你想忽略一个特定的项目，在它的`package.json`中添加以下内容:

```jsonc
{
  "name": "mylib",
  "nx": {
    "ignore": true
  }
}
```

### 工作空间 json

根目录中的`workspace.json`文件是可选的。
如果你想在你的工作空间中显式地列出项目，而不是 Nx 扫描所有的`project.json`和`package.json`文件树，以匹配在根`package.json`的`workspace`属性中指定的 globs。

```json
{
  "version": 2,
  "projects": {
    "myapp": "apps/myapp"
  }
}
```

- `"version": 2`告诉 Nx 我们正在使用 Nx 的格式来创建 `workspace.json` 文件。
- `projects`是一个项目名称到其位置的映射。

## CLI 配置

`nx.json`文件用于配置 Nx 命令行和项目默认值。

下面是显示所有选项的扩展版本。
您的`nx.json`可能会短得多。

```json
{
  "npmScope": "happyorg",
  "affected": {
    "defaultBase": "main"
  },
  "workspaceLayout": {
    "appsDir": "demos",
    "libsDir": "packages"
  },
  "implicitDependencies": {
    "workspace.json": "*",
    "package.json": {
      "dependencies": "*",
      "devDependencies": "*"
    },
    "tsconfig.base.json": "*",
    "nx.json": "*"
  },
  "targetDependencies": {
    "build": [
      {
        "target": "build",
        "projects": "dependencies"
      }
    ]
  },
  "cli": {
    "defaultCollection": "@nrwl/js"
  },
  "generators": {
    "@nrwl/js:library": {
      "buildable": true
    }
  },
  "tasksRunnerOptions": {
    "default": {
      "runner": "@nrwl/workspace/tasks-runners",
      "options": {
        "cacheableOperations": ["build", "lint", "test", "e2e"]
      }
    }
  }
}
```

### NPM Scope

告诉 Nx 在生成库导入时使用什么前缀。

### 影响

告诉 Nx 在计算受影响的项目时使用哪个分支和 HEAD。

- `defaultBase`定义了默认的基本分支，默认为`main`。

### 工作空间布局

你可以添加一个`workspaceLayout`属性来修改库和应用程序的位置。

```json
{
  "workspaceLayout": {
    "appsDir": "demos",
    "libsDir": "packages"
  }
}
```

这些设置会将应用存储在`/demos/`中，而将库存储在`/packages/`中。
指定的路径是相对于工作区根的。

### 文件和隐式依赖关系

Nx 执行高级的源代码分析，以找出工作空间的项目图。
因此，当您进行更改时，Nx 可以推断出该更改会破坏什么。
项目和共享文件之间的一些依赖关系不能被静态推断。
你可以使用`implicitDependencies`来配置它们。

```json
{
  "implicitDependencies": {
    "workspace.json": "*",
    "package.json": {
      "dependencies": "*",
      "devDependencies": {
        "mypackage": ["mylib"]
      },
      "scripts": {
        "check:*": "*"
      }
    },
    "globalFile": ["myapp"],
    "styles/**/*.css": ["myapp"]
  }
}
```

在上面的例子中:

- 更改`workspace.json`会影响到每个项目。
- 改变`package.json`中的`dependencies`属性会影响到每个项目。
- 更改`package.json`中的`mypackage`属性只会影响`mylib`。
- 更改`package.json`中的任何自定义检查'脚本'都会影响到每个项目。
- 更改`globalFile`只影响`myapp`。
- 更改`styles`目录中的任何 CSS 文件只会影响`myapp`。

### 目标的依赖关系

目标可以依赖于其他目标。
一个常见的场景是在构建项目之前必须首先构建项目的依赖项。
`package.json`中的`dependsOn`属性可以用来定义单个目标的依赖项列表。

通常在 repo 中，每个项目都必须定义相同的 dependsOn 配置，这就是在`nx.json`中定义`targetDependencies`是有帮助的。

```json
{
  "targetDependencies": {
    "build": [
      {
        "target": "build",
        "projects": "dependencies"
      }
    ]
  }
}
```

上面的配置类似于向每个项目的每个构建目标添加`{"dependsOn": [{"target": "build", "projects": "dependencies"]}`。

### CLI 项目

使用如下命令生成一个新的库:`nx g @nrwl/js:lib mylib`。
在设置了`defaultCollection`属性后，lib 会在没有提及插件名的情况下生成:`nx g lib mylib`。

```json
{
  "cli": {
    "defaultCollection": "@nrwl/js"
  }
}
```

### 生成器

默认的生成器选项也在`nx.json`中配置。
例如，下面的代码告诉 Nx 在创建新库时总是传递`--buildable=true`。

```json
{
  "generators": {
    "@nrwl/js:library": {
      "buildable": true
    }
  }
}
```

### 运行任务选项

> 任务是对目标的调用。

当你运行`nx test`, `nx build`, `nx run-many`, `nx affected`,等等时，会调用任务运行器。
默认情况下使用名为`default`的任务运行器。
指定一个不同的`nx run-many --target=build --all --runner=another`。

任务运行程序可以接受不同的选项。
以下是`"@nrwl/workspace/tasks-runners"` and `"@nrwl/nx-cloud"`支持的选项。

- `cacheableOperations` 定义了 Nx 缓存的目标/操作列表。
- `parallel` 定义了并行运行的最大目标数(在旧版本的 Nx 中，你必须传递`--parallel --maxParallel=3`而不是`--parallel=3`)。
- `captureStderr` 定义缓存是捕获 stderr 还是 stdout。
- `skipNxCache` 定义是否应该跳过 Nx 缓存。默认为 `false`.
- `cacheDirectory` 定义本地缓存的存储位置，默认 `node_modules/.cache/nx`。
- `encryptionKey` (当只使用`"@nrwl/nx-cloud"`时)定义了一个加密密钥来支持云缓存的端到端加密。
  您还可以提供一个带有密钥`NX_CLOUD_ENCRYPTION_KEY`的环境变量，该密钥包含一个加密密钥作为其值。
  Nx Cloud 任务运行程序对密钥长度进行规范化，因此任何密钥长度都是可以接受的。
- `runtimeCacheInputs` 定义运行程序要包含到计算哈希值中运行的命令列表。
- `selectivelyHashTsConfig` 只在`tsconfig.base.json`中散列活动项目的路径映射(例如，添加/删除项目不会影响现有项目的散列)。默认为 `false`

`runtimeCacheInputs` 设置如下:

```json
{
  "tasksRunnerOptions": {
    "default": {
      "runner": "@nrwl/workspace/tasks-runners",
      "options": {
        "cacheableOperations": ["build", "lint", "test", "e2e"],
        "runtimeCacheInputs": ["node -v"]
      }
    }
  }
}
```

你可以在`nx.json`中配置`parallel`，但你也可以在终端中传递它们 `nx run-many --target=test --parallel=5`.

## .nxignore

你可以选择在根目录中添加一个`.nxignore`文件。
这个文件用于指定工作空间中应该被 Nx 完全忽略的文件。

语法与[`.gitignore`文件](https://git-scm.com/book/en/v2/Git-Basics-Recording-Changes-to-the-Repository#_ignoring)相同。

**当一个文件被指定在`.nxignore`文件:**

1.  对该文件的更改不会在`affected`计算中被考虑在内。
2.  即使文件在应用程序或库之外，`nx workspace-lint`也不会发出警告。

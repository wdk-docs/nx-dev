# 影响

> 在阅读本指南之前，请阅读[mental model guide](/using-nx/mental-model)。它将帮助您理解计算缓存如何适应 Nx 的其余部分。

## 概述

当你运行`nx test app1`时，你是在告诉 nx 运行 app1:test task 加上它所依赖的所有任务。

当你运行`nx run-many --target=test --projects=app1,lib`时，你是在告诉 nx 对两个任务 app1:test 和 lib:test 做同样的事情。

当你运行 `nx run-many --target=test --all`时，你是在告诉 nx 对所有的项目都这样做。

随着工作空间的增长，重新测试所有项目变得非常缓慢。
为了解决这个问题，Nx 实现了代码变更分析，以获得需要重新测试的最小项目集。
它是如何工作的?

当你运行 `nx affected --target=test`时，nx 会查看你在 PR 中更改的文件，它会查看更改的本质(你在那些文件中到底更新了什么)，它会使用这个来计算工作区中可能受此更改影响的项目列表。
然后，它运行`run-many` 命令与该列表。

例如，如果我的 PR 改变了 `lib`，然后我运行`nx affected --target=test`，nx 发现`app1` 和 `app2`依赖于`lib`，所以它会调用`nx run-many --target=test --projects=app1,app2,lib`。

![affected](/shared/mental-model/affected.png)

Nx 分析了这些变化的性质。
例如，如果你在 package.json 中更改了 Next.js 的版本，Nx 知道`app2`不会受到它的影响，所以它只会重新测试`app1`。

## 工程图

要查看受影响的内容，请运行:

```bash
nx affected:graph
```

## CI

你传递的 sha 必须在 git 仓库中定义。
`main` 和 `HEAD` SHAs 是您在开发时通常使用的。
您很可能希望在 CI 环境中提供其他 sha。

```bash
nx affected:build --base= origin/main --head=$PR_BRANCH_NAME # where PR_BRANCH_NAME is defined by your CI system
nx affected:build --base= origin/main~1 --head= origin/main # rerun what is affected by the last commit in main
```

你也可以将 base 和 head SHAs 设置为 env 变量:

```bash
NX_BASE=origin/main~1
NX_HEAD=origin/main
```

## 忽略来自受影响命令的文件

Nx 提供了两个方法来从`affected:*`命令中排除 glob 模式(文件和文件夹)。

- `.gitignore` 文件中定义的 Glob 模式将被忽略。
- 在可选文件`.nxignore`中定义的 Glob 模式将被忽略。

## 不使用 Git

如果你不使用 Git，你可以将 `--files` 传递给任何受影响的命令，以指示哪些文件被更改了。

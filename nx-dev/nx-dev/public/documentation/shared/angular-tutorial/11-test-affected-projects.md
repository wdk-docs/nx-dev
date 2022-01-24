# Angular Nx 教程 - 第 11 步:测试受影响的项目

因为 Nx 理解你工作空间的项目图，所以 Nx 在重新测试和重建你的项目时非常有效。

**提交 repo 中的所有更改**:

```bash
git add .
git commit -am 'init'
git checkout -b testbranch
```

**打开 `libs/ui/src/lib/todos/todos.component.html` 然后改变模板:**

```html
<ul>
  <li *ngFor="let t of todos" class="todo">{{ t.title }}!</li>
</ul>
```

运行该命令查看受影响的应用程序。

```sh
npx nx affected:apps
```

你应该看到 `todos` 打印出来。
`affected:apps` 会查看你改变了什么，并使用项目图表来找出哪些应用程序会受到这种改变的影响。

运行该命令查看受影响的库

```sh
npx nx affected:libs
```

你应该会看到 `ui` 打印出来。这个命令的工作原理与此类似，但它不是打印受影响的应用程序，而是打印受影响的库。

## 影响测试项目

打印受影响的项目可能很方便，但通常您想要用它们做一些事情。例如，您可能想要测试所有受到影响的内容。

运行此命令只重新测试受更改影响的项目:

```sh
npx nx affected:test
```

您将看到以下内容:

```bash
>  NX  Running target test for projects:

  - ui
  - todos

...

  Failed projects:

  - todos
  - ui
```

注意，Nx 只尝试重新测试`ui`和`todos`。
它没有重新测试 `api` 或 `data`，因为它不可能受到这个分支的变化的影响。

运行该命令重新测试失败的项目。

```sh
npx nx affected:test -- --only-failed
```

## 影响:

你可以像这样对图中受影响的项目运行任何目标:

```bash
# The following are equivalent
npx nx affected --target=build
npx nx affected:build
```

## 接下来是什么

- 继续[步骤 12:总结](/angular-tutorial/12-summary)

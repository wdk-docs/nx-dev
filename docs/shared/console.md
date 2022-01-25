# Nx 编辑器插件

**花更少的时间查找命令行参数，花更多的时间交付令人难以置信的产品。**

有了 Nx，你可以在几分钟内启动并运行一个全栈的应用程序，而不需要弄清楚源程序、webpack 或测试运行程序。
这一切都是现成的。
Nx 还可以通过生成组件、服务和状态管理模块来帮助您执行一致的开发实践。

## 为什么使用 Nx 编辑器插件?

开发人员同时使用命令行工具和用户界面。
它们在终端中提交，但在 VSCode 或 WebStorm 中解决冲突。
他们使用正确的工具来完成工作。

Nx 是一个命令行工具，当你想要提供一个应用程序或生成一个简单的组件时，它可以很好地工作。
但一旦你开始做高级的事情，它就会失效。

例如:

- 在终端中探索自定义生成器集合很困难，但是使用 Nx Console 很容易。
- 使用很少使用的标志是一项挑战。传递绝对路径还是相对路径? 你不需要记住任何标志，名称或路径- Nx Console 将帮助你提供自动完成和验证你的输入。
- 找到合适的 Nx 扩展可能需要很长时间。当使用 Nx Console 时，您可以在几分钟内找到并安装一个扩展。

Nx Console 做了所有这些，甚至更多!

## 下载

### VSCode

如果你正在使用[VSCode](https://code.visualstudio.com/)，你可以从市场安装[Nx 控制台 VSCode 插件](https://marketplace.visualstudio.com/items?itemName=nrwl.angular-console)。
Nx Console VSCode Plugin 是**由 Nx 团队构建和维护的**。

### WebStorm

如果你正在使用[WebStorm](https://www.jetbrains.com/webstorm/)，你可以安装其中一个可用的插件:
[nx-webstorm](https://plugins.jetbrains.com/plugin/15000-nx-webstorm)
[Nx Console Idea](https://plugins.jetbrains.com/plugin/15101-nx-console-idea)

这些插件不是由 Nx 团队构建或维护的。它们由独立的社区贡献者维护。

## 用于 VSCode 的 Nx 控制台

![Nx Console logo](/shared/nx-console-logo.png)

- [从 VSCode 市场安装](https://marketplace.visualstudio.com/items?itemName=nrwl.angular-console)
- [GitHub 上的贡献](https://github.com/nrwl/nx-console)

![Nx控制台屏幕截图](/shared/nx-console-screenshot.png)

### Nx 的真正 UI

Nx Console 是 Nx 的 UI。
它适用于任何生成器或任何架构师命令。
Nx Console 没有特定的 UI 来生成组件。
相反，Nx Console 做了 Nx 命令行版本所做的事情——它分析相同的元信息来创建所需的 UI。
这意味着任何你可以用 Nx 做的事情，你都可以用 Nx 控制台做。毕竟，Nx Console 是 Nx 的 UI。

### 对专家和初学者都有用

尽管我们最初是将 Nx Console 作为一种面向专家的工具来开发的，但我们也希望让 Nx Console 成为一种适合于开发新手或 Nx 开发者的优秀工具。
您可以创建项目，与您的编辑器交互，运行生成器和命令，并安装扩展，而无需接触终端或必须全局安装任何节点包。
此外，Nx Console 突出显示了您可能用于内置生成器和命令的属性，因此，如果您没有使用 CLI，您不会感到不知所措。

### 文档

#### 生成

`Generate` 动作允许您选择一个生成器，然后打开一个列出该生成器的所有选项的表单。
当您更改表单时，生成器会在终端中以 `--dry-run` 模式执行，因此您可以实时预览运行生成器的结果。

**从命令面板**

您也可以通过选择`nx: generate (ui)`从命令面板中启动`Generate`操作(`⇧⌘P`)。

您甚至可以在完全使用命令面板的情况下构造生成器选项。
使用`⇧⌘P`打开命令面板，然后选择`nx: generate`。
选择生成器之后，选择列出的任何选项来修改生成器命令。
当您对构造的命令感到满意时，选择列表顶部的 `Execute` 命令。

#### 运行

`Run` 操作允许您选择一个执行器命令，然后打开一个列出该执行器的所有选项的表单。
常用的执行器命令 `build`, `serve`, `test`, `e2e` 和 `lint` 也有自己的专用动作。

**从命令面板**

您还可以构造执行器命令选项，同时完全保持在命令面板中。
使用 `⇧⌘P`打开命令面板，然后选择 `nx: test`。
选择项目后，选择列出的任何选项来修改执行器命令选项。
当您对构造的命令感到满意时，选择列表顶部的 `Execute` 命令。

#### 常见 Nx 命令

您还可以使用命令面板中列出的选项启动其他常见的 Nx 命令。

#### 项目

点击任何项目的名称，就会在 `workspace.json` (或 `angular.json`) 文件中找到该项目的定义。

点击任意一个 executor 命令的名称，就会导航到 `workspace.json` (或 `angular.json`) 文件中该命令的定义。

点击`PROJECTS`头旁边的![refresh-light.svg](./refresh-light.svg)图标，就可以从`workspace.json` (或 `angular.json`) 文件中重新填充 PROJECTS 窗格。

单击项目旁边的![folder-light.svg](./folder-light.svg)图标会在 VSCode Explorer 窗格中显示该项目的文件夹。

单击执行器命令旁边的![continue-light.svg](./continue-light.svg)图标将执行该命令，而不提示选项。

#### 简化

如果您发现自己多次运行同一个命令，这里有一些提示可以帮助您节省一些按键。

**最后重新运行任务**

如果你想在指定的所有选项中重新运行最后一个任务，打开命令面板 (`⇧⌘P`) 并选择 `Rerun Last Task`。

**键盘快捷键**

您还可以设置自定义任务，并为它们分配键盘快捷键。
在 `.vscode/tasks.json` 添加一个像这样的任务:

```json
{
  "label": "Test Affected",
  "type": "shell",
  "command": "nx affected --target=test"
}
```

然后在命令面板 (`⇧⌘P`) 中选择`Preferences: Open Keyboard Shortcuts (JSON)`。
然后添加以下快捷方式:

```json
{
  "key": "ctrl+cmd+t",
  "command": "workbench.action.tasks.runTask",
  "args": "Test Affected"
}
```

现在，按 `^⌘T` 就会运行 `nx affected --target=test`.

这里有更多关于[VSCode 任务](https://code.visualstudio.com/docs/editor/tasks)和[键盘快捷键](https://code.visualstudio.com/docs/getstarted/keybindings)的信息。

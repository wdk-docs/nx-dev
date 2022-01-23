# Nx 和 Angular

Nx 是一个智能、快速和可扩展的构建系统，具有一流的单 monorepo 支持和强大的集成。
它有一个强大的核心和丰富的插件生态系统。

## 使事情快速

如果你只想通过使用 Nx 的[affected:\* commands](/using-nx/affected)，[计算缓存](/using-nx/cache)和[分布式任务执行](/using-nx/dte)来提高 monorepo 的性能，那么你不需要使用任何插件。
无论你的 monorepo 有 React, Vue, Svelte，甚至 Go, Rust，或 Java 应用程序，一切都将以相同的方式工作。
Nx 是与技术无关。

看看下面的指南就可以开始了:

- [使用 Nx 不带插件](/getting-started/nx-core)
- [将 Nx 添加到现有的 monorepo 中](/migration/adding-to-monorepo)
- [将 Nx 添加到 Angular CLI 项目中](/migration/migration-angular)
- [从 AngularJS 迁移](/migration/migration-angularjs)

阅读[心智模型指南](/using-nx/mental-model)来理解 Nx 是如何工作的也是一个好主意。

## Nx 和 Angular 插件

Nx 插件可以帮助你开发[Angular](/angular/overview)应用，完全集成支持[Jest](/jest/overview)、[Cypress](/cypress/overview)、[ESLint](/linter/eslint)、Storybook、[NgRx](/angular/guides/misc-ngrx)等现代工具和库。

看看下面的内容就可以开始了:

- [Angular:交互式 Nx 教程(带视频)](/angular-tutorial/01-create-application)
- [免费 Nx 课程在 YouTube 上](https://www.youtube.com/watch?time_continue=49&v=2mYLe9Kp9VM&feature=emb_logo)

## Nx 和 Angular CLI

**如果你把 Nx 添加到 Angular CLI 项目中，`ng` 和 `nx`是可以互换的(它们会调用同一个命令)。**
**所以在任何你看到`"nx build"` 或 `"nx affected"`的地方，你也可以使用`"ng build"` 或 `"ng affected"`。**

Nx 与 Angular CLI 集成得很好:

- 它装饰了 Angular CLI。在将 Nx 添加到你的工作区后，运行`ng`将运行经过 Nx 封装的 Angular CLI。 一切都将以同样的方式工作，但更快。
- 它支持所有 Angular Devkit 构建器和原理图。
- 它支持使用`angular.json`来配置项目及其目标。
- Nx Console 与 Angular CLI 项目一起工作。

这个功能非常好用，以至于很多人甚至不知道他们使用的是 Nx。

## Angular CLI 有一些限制，Nx 解决了它们。

### angular.json

Nx 支持使用 `angular.json` 来配置项目及其目标，但它有一些限制。

我们的建议是把 `angular.json` 分解成多个 `project.json` 文件(每个项目一个)。
这就是你要做的:
例如，对于大型工作区来说，`angular.json` 可能有数千行长。

- 将 `angular.json` 中的版本号更改为 `2`
- 运行 `nx format`
- 运行 `nx generate @nrwl/workspace:convert-to-nx-project --all=true`

**但是无论你使用 `angular.json` 还是 `project.json` ，配置都是一样的。**
**所以任何关于 `project.json` 或 `workspace.json` 的内容也同样适用于 `angular.json` 。**
**例如，[project.json 和 nx.json](/configuration/projectjson)中的所有东西都以同样的方式应用于 `angular.json`。**

注意，即使配置是分割的，但所有的工作方式都是一样的。
所有需要一个`angular.json`文件的迁移和原理图，都会收到一个单独的文件。
Nx 是智能的，因此它合并内存中的所有文件，使这些迁移和原理图工作。

### `ng update` 和 `nx migrate`

如果你以前没有使用过 Nx，但使用过 Angular CLI，你可能会运行 `ng update`。
有什么区别?

`nx migrate` 是 `ng update`的改进版。它运行相同的迁移，但允许你:

- 多次重新运行相同的迁移。
- 重新排序迁移。
- 跳过迁移。
- 修复“几乎可以工作”的迁移。
- 提交部分迁移的状态。
- 更改包的版本以匹配组织的需求。

而且，一般来说，对于重要的工作区来说，它要可靠得多。为什么?

`ng update` 尝试一次自动执行迁移。这并不适用于大多数重要的工作区。

- `ng update` doesn't separate updating `package.json` from updating the source code of the repo. It all happens in a single go. This often fails for non-trivial workspaces or for organizations that have a custom npm registry, where you might want to use a different version of a package.
- `ng update` relies on `peerDependencies` to figure out what needs to be updated. Many third-party plugin don't have `peerDependencies` set correctly.
- When using `ng update` it is difficult to execute one migration at a time. Sometimes you want to patch things up after executing a migration.
- When using `ng update` it's not possible to fix almost-working migrations. We do our best but sometimes we don't account for the specifics of a particular workspace.
- When using `ng update` it's not possible to commit a partially-migrated repo. Migration can take days for a large repo.
- When using `ng update` it's not possible to rerun some of the migrations multiple times. This is required because you can rebase the branch multiple times while migrating.

The Nx core team have gained a lot of experience migrating large workspaces over the last 5 years, and `nx migrate` has been consistently a lot more reliable and easier to use. It has also been a lot easier to implement migrations that work with `nx migrate` comparing to `ng update`. As a result, folks building React and Node applications with Nx have had better experience migrating because Angular folks use `ng update` out of habit, instead of using the command that works better.

**从 Nx 11 开始, you can migrate workspaces only using `nx migrate`**. To reiterate: `nx migrate` runs the migrations written by the Angular CLI team the same way `ng update` runs them. So everything should still work. You just get more control over how it works.

If you still want to run `ng update`, you can do it as follows: `FORCE_NG_UPDATE=true nx update mypackage`.

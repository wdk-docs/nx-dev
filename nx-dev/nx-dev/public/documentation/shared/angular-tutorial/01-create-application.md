# Angular Nx 教程-第一步:创建应用

在本教程中，您将使用 Nx 构建一个使用现代技术(如 Cypress 和 Nest)的通用库的全栈应用程序。

> 本教程使用几个 Nx 插件来提供丰富的开发体验。 **所有插件都是可选的。** [阅读关于在没有插件的情况下使用 Nx Core](/getting-started/nx-core).

## 创建一个新的工作空间

**首先创建一个新的工作区。**

```bash
npx create-nx-workspace@latest
```

然后在命令行中收到以下提示:

```bash
Workspace name (e.g., org name)     myorg
What to create in the new workspace angular
Application name                    todos
Default stylesheet format           CSS
```

> 您也可以选择添加[Nx Cloud](https://nx.app)，但它不是本教程所要求的。

当被问及`preset`时，选择`angular`和`todos`作为应用程序的名称。

```treeview
myorg/
├── apps/
│   ├── todos/
│   │   ├── src/
│   │   │   ├── app/
│   │   │   ├── assets/
│   │   │   ├── environments/
│   │   │   ├── favicon.ico
│   │   │   ├── index.html
│   │   │   ├── main.ts
│   │   │   ├── polyfills.ts
│   │   │   ├── styles.scss
│   │   │   └── test-setup.ts
│   │   ├── .browserslistrc
│   │   ├── .eslintrc.json
│   │   ├── jest.config.js
│   │   ├── project.json
│   │   ├── tsconfig.app.json
│   │   ├── tsconfig.editor.json
│   │   ├── tsconfig.json
│   │   └── tsconfig.spec.json
│   └── todos-e2e/
│       ├── src/
│       │   ├── fixtures/
│       │   │   └── example.json
│       │   ├── integration/
│       │   │   └── app.spec.ts
│       │   ├── plugins/
│       │   │   └── index.ts
│       │   └── support/
│       │       ├── app.po.ts
│       │       ├── commands.ts
│       │       └── index.ts
│       ├── cypress.json
│       ├── project.json
│       └── tsconfig.json
├── libs/
├── tools/
├── .eslintrc.json
├── .prettierrc
├── angular.json
├── decorate-angular-cli.js
├── jest.config.js
├── jest.preset.js
├── nx.json
├── package.json
├── README.md
└── tsconfig.base.json
```

generate 命令向工作区添加了两个项目:

- 一个 angular 应用程序
- Angular 应用的端到端测试

## 服务于新创建的应用程序

现在，应用程序已经设置好，可以通过:

```bash
npx nx serve todos
```

## 请在 Nx 命令行中注意

如果你更喜欢使用全局安装的 Nx 运行，你可以运行:

```bash
nx serve todos
```

根据你的 dev env 是如何设置的，上面的命令可能会导致`Command 'nx' not found`。

要修复它，你可以通过运行全局安装 `nx` 命令行:

```bash
npm install -g nx
```

或者

```bash
yarn global add nx
```

或者，你可以通过在每个命令前加上 `npx` 来运行 Nx 的本地安装。:

```bash
npx nx serve todos
```

或者

```bash
yarn nx serve todos
```

## 关于`nx serve`和`ng serve`的注释

The Nx CLI syntax is intentionally similar to the Angular CLI. The `nx serve` command
produces the same result as `ng serve`, and `nx build` produces the same results as `ng build`. However, the Nx CLI
supports advanced capabilities that aren't supported by the Angular CLI. For instance, Nx's computation cache only
works when using the Nx CLI. In other words, using `nx` instead of `ng` results in the same output, but often performs
a lot better.

## 接下来是什么

- 继续[步骤 2:添加端到端测试](/angular-tutorial/02-add-e2e-test)

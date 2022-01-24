# Angular Nx 教程-第 5 步:添加实现 API 的节点应用

请求失败是因为 API 还没有创建。
使用 Nx，你可以在 Angular 应用旁边开发节点应用。
您可以使用相同的命令来运行和测试它们。
您可以在后端和前端之间共享代码。
使用此功能来实现 API 服务。

## 将 NestJS 插件添加到您的工作区

Nx 是一个可扩展的框架，包含许多现代工具和框架的插件。
**要查看一些插件，运行 `nx list`:**

```bash
>  NX  Installed plugins:

  @angular-devkit/build-angular (builders)
  @nrwl/angular (builders,generators)
  @nrwl/cypress (builders,generators)
  @nrwl/jest (builders,generators)
  @nrwl/linter (builders,generators)
  @nrwl/storybook (builders,generators)
  @nrwl/workspace (builders,generators)


>  NX  Also available:

  @nrwl/express (executors,generators)
  @nrwl/nest (executors,generators)
  @nrwl/next (executors,generators)
  @nrwl/node (executors,generators)
  @nrwl/nx-plugin (executors,generators)
  @nrwl/react (executors,generators)
  @nrwl/web (executors,generators)


>  NX  Community plugins:

  nx-plugins - Nx plugin integrations with ESBuild / Vite / Snowpack / Prisma, with derived ESBuild / Snowpack / ... plugins.
  @codebrew/nx-aws-cdk - An Nx plugin for aws cdk develop.
  @rxap/plugin-localazy - An Nx plugin for localazy.com upload and download tasks.
  ...
```

**添加依赖关系:**

```bash
npm install --save-dev @nrwl/nest
```

or

```bash
yarn add --dev @nrwl/nest
```

> `@nrwl/nest` 同时添加 `@nrwl/node`. 运行 `nx list @nrwl/nest` 和 `nx list @nrwl/node` 看看这些插件提供了什么.

## 创建一个 NestJS 应用程序

**运行以下命令生成一个新的 Nest 应用程序:**

```bash
npx nx g @nrwl/nest:app api --frontendProject=todos
```

Nx 会问你一些问题，就像 Angular 应用一样，这里的默认值工作得很好。

完成此操作后，您应该会看到如下内容:

```treeview
myorg/
├── apps/
│   ├── todos/
│   ├── todos-e2e/
│   └── api/
│       ├── src/
│       │   ├── app/
│       │   │   ├── app.controller.ts
│       │   │   ├── app.controller.spec.ts
│       │   │   ├── app.module.ts
│       │   │   ├── app.service.ts
│       │   │   └── app.service.spec.ts
│       │   ├── assets/
│       │   ├── environments/
│       │   │   ├── environment.ts
│       │   │   └── environment.prod.ts
│       │   └── main.ts
│       ├── jest.conf.js
│       ├── proxy.conf.json
│       ├── tsconfig.app.json
│       ├── tsconfig.json
│       └── tsconfig.spec.json
├── libs/
├── tools/
├── angular.json
├── nx.json
├── package.json
└── tsconfig.base.json
```

`apps` 目录是 Nx 存放任何你可以运行的东西的地方:前端应用程序、后端应用程序、端到端测试套件。
这就是为什么`api`应用程序出现在那里。

您可以运行:

- `npx nx serve api` 为应用程序提供服务
- `npx nx build api` 要构建应用程序
- `npx nx test api` 要测试应用程序

**打开 `apps/api/src/app/app.module.ts`.**

```typescript
import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

我们建议在创建节点应用程序时使用 [Nest](/nest/overview) 框架。
Nest 是一个强大的框架，可以帮助开发健壮的节点应用程序。
您还可以在 Nx 中使用 Express 或任何节点库。

在本例中，您有一个注册服务和控制器的应用程序。
Nest 中的服务负责业务逻辑，控制器负责实现 Http 端点。

**Update `apps/api/src/app/app.service.ts`:**

```typescript
import { Injectable } from '@nestjs/common';

interface Todo {
  title: string;
}

@Injectable()
export class AppService {
  todos: Todo[] = [{ title: 'Todo 1' }, { title: 'Todo 2' }];

  getData(): Todo[] {
    return this.todos;
  }

  addTodo() {
    this.todos.push({
      title: `New todo ${Math.floor(Math.random() * 1000)}`,
    });
  }
}
```

**接下来，更新控制器以调用服务:**

```typescript
import { Controller, Get, Post } from '@nestjs/common';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('todos')
  getData() {
    return this.appService.getData();
  }

  @Post('addTodo')
  addTodo() {
    return this.appService.addTodo();
  }
}
```

在一个新的终端窗口中，提供 API。

```bash
npx nx serve api
```

API 开始在端口`3333`上运行。

## 接下来是什么

- 继续[步骤 6:代理](/angular-tutorial/06-proxy)

# Angular Nx 教程-第 7 步:共享代码

太棒了!应用程序是端到端工作!然而，有一个问题。
后端和前端都定义了 `Todo` 接口。
接口现在是同步的，但在实际的应用程序中，随着时间的推移，它会出现分歧，从而导致运行时错误。
您应该在后端和前端之间共享这个接口。
在 Nx 中，可以通过创建一个库来实现这一点。

**运行如下命令创建库:**

```bash
npx nx g @nrwl/workspace:lib data
```

结果应该是这样的:

```treeview
myorg/
├── apps/
│   ├── todos/
│   ├── todos-e2e/
│   └── api/
├── libs/
│   └── data/
│       ├── src/
│       │   ├── lib/
│       │   │   ├── data.spec.ts
│       │   │   └── data.ts
│       │   └── index.ts
│       ├── .babelrc
│       ├── .eslintrc.json
│       ├── jest.config.js
│       ├── project.json
│       ├── README.md
│       ├── tsconfig.json
│       ├── tsconfig.lib.json
│       └── tsconfig.spec.json
├── tools/
├── angular.json
├── nx.json
├── package.json
└── tsconfig.base.json
```

**将接口复制到 `libs/data/src/lib/data.ts`.**

```typescript
export interface Todo {
  title: string;
}
```

### 关于 VS Code 的一个说明:

如果你正在使用[VS Code](https://code.visualstudio.com/)，在这一点上可能需要重启 TS 服务器，以便识别新的“@myorg/data”包。
这可能需要在**每次添加新的工作空间库时**进行。
如果你安装了 [Nx Console](/using-nx/console) 扩展，你不需要采取这个步骤。

## 重构的 API

**现在更新的应用程序 `apps/api/src/app/app.service.ts` 用于导入接口:**

```typescript
import { Injectable } from '@nestjs/common';
import { Todo } from '@myorg/data';

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

## 更新 Angular 应用

**接下来将接口导入 `apps/todos/src/app/app.component.ts`:**

```typescript
import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Todo } from '@myorg/data';

@Component({
  selector: 'myorg-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  todos: Todo[] = [];

  constructor(private http: HttpClient) {
    this.fetch();
  }

  fetch() {
    this.http.get<Todo[]>('/api/todos').subscribe((t) => (this.todos = t));
  }

  addTodo() {
    this.http.post('/api/addTodo', {}).subscribe(() => {
      this.fetch();
    });
  }
}
```

> 每次添加新库时，都必须重新启动 `npx nx serve`.

在单独的终端窗口中重新启动 api 和应用程序

```bash
npx nx serve api
```

```bash
npx nx serve todos
```

您应该会看到应用程序正在运行。

## 接下来是什么

- 继续[步骤 8:创建库](/angular-tutorial/08-create-libs)

# Angular Nx 教程 - 第 8 步:创建库

库不仅仅是 Nx 中共享代码的一种方式。
在使用定义良好的公共 API 将代码分解成小单元时，它们也很有用。

## 公共 API

每个库都有一个`index.ts`文件，它定义了它的公共 API。
其他应用程序和库应该只访问`index.ts`导出的内容。
图书馆里的其他东西都是私人的。

## UI 库

为了说明库是多么有用，创建一个 Angular 组件库。
使用 generate 构建一个新的库:

```sh
npx nx g @nrwl/angular:lib ui
```

您应该会看到以下内容:

```treeview
myorg/
├── apps/
│   ├── todos/
│   ├── todos-e2e/
│   └── api/
├── libs/
│   ├── data/
│   └── ui/
│       ├── src/
│       │   ├── lib/
│       │   │   └── ui.module.ts
│       │   ├── index.ts
│       │   └── test-setup.ts
│       ├── .eslintrc.json
│       ├── jest.config.js
│       ├── project.json
│       ├── tsconfig.json
│       ├── tsconfig.lib.json
│       └── tsconfig.spec.json
├── tools/
├── .eslintrc.json
├── nx.json
├── package.json
└── tsconfig.base.json
```

`libs/ui/src/lib/ui.module.ts` 的文件是这样的:

```typescript
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [CommonModule],
})
export class UiModule {}
```

## 添加一个组件

**通过运行向新创建的 ui 库添加一个组件:**

```bash
npx nx g component todos --project=ui --export
```

```treeview
myorg/
├── apps/
│   ├── todos/
│   ├── todos-e2e/
│   └── api/
├── libs/
│   ├── data/
│   └── ui/
│       ├── src/
│       │   ├── lib/
│       │   │   ├── todos/
│       │   │   │   ├── todos.component.css
│       │   │   │   ├── todos.component.html
│       │   │   │   ├── todos.component.spec.ts
│       │   │   │   └── todos.component.ts
│       │   │   └── ui.module.ts
│       │   └── index.ts
│       ├── .eslintrc.json
│       ├── jest.config.js
│       ├── tsconfig.json
│       ├── tsconfig.lib.json
│       └── tsconfig.spec.json
├── tools/
├── nx.json
├── package.json
└── tsconfig.base.json
```

**添加一个 `todos` 输入到 `libs/ui/src/lib/todos/todos.component.ts`.**

```typescript
import { Component, OnInit, Input } from '@angular/core';
import { Todo } from '@myorg/data';

@Component({
  selector: 'myorg-todos',
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.css'],
})
export class TodosComponent implements OnInit {
  @Input() todos: Todo[] = [];

  constructor() {}

  ngOnInit() {}
}
```

**并 `todos.component.html` 显示给定的待办事项:**

```html
<ul>
  <li *ngFor="let t of todos" class="todo">{{ t.title }}</li>
</ul>
```

## 使用 UI 库

**现在导入 `UiModule` 到 `apps/todos/src/app/app.module.ts`.**

```typescript
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { UiModule } from '@myorg/ui';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, HttpClientModule, UiModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

**和更新 `app.component.html`:**

```html
<h1>Todos</h1>

<myorg-todos [todos]="todos"></myorg-todos>

<button (click)="addTodo()">Add Todo</button>
```

在单独的终端窗口中重新启动 api 和应用程序

```bash
npx nx serve api
```

```bash
npx nx serve todos
```

## 接下来是什么

- 继续[步骤 9:使用项目图](/angular-tutorial/09-dep-graph)

# Angular Nx 教程-第三步:显示待办事项

太棒了!您有一个失败的端到端测试。现在你可以让它通过了!

使用 Cypress 的最佳方法是在开发应用程序时继续运行失败的端到端测试。
这有助于你看到你正在取得的进步。

## 显示 todos

**打开 `apps/todos`.** 如果你使用过 Angular CLI，这看起来应该很熟悉: 相同的布局，相同的模块和组件文件. 唯一的区别是 Nx 使用 Jest 而不是 Karma.

要通过 e2e 测试的第一个断言，请进行更新 `apps/todos/src/app/app.component.ts`:

```typescript
import { Component } from '@angular/core';

interface Todo {
  title: string;
}

@Component({
  selector: 'myorg-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  todos: Todo[] = [{ title: 'Todo 1' }, { title: 'Todo 2' }];
}
```

添加 `apps/todos/src/app/app.component.html`:

```html
<h1>Todos</h1>

<ul>
  <li *ngFor="let t of todos" class="todo">{{ t.title }}</li>
</ul>
```

**单击左侧窗格右上角的按钮重新运行规范。**
现在，在试图找到添加 todo 按钮时，测试会失败。

## 添加 todos

**使用相应的点击处理程序添加`add-todo`按钮。**

```typescript
import { Component } from '@angular/core';

interface Todo {
  title: string;
}

@Component({
  selector: 'myorg-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  todos: Todo[] = [{ title: 'Todo 1' }, { title: 'Todo 2' }];

  addTodo() {
    this.todos.push({
      title: `New todo ${Math.floor(Math.random() * 1000)}`,
    });
  }
}
```

```html
<h1>Todos</h1>

<ul>
  <li *ngFor="let t of todos" class="todo">{{ t.title }}</li>
</ul>

<button id="add-todo" (click)="addTodo()">Add Todo</button>
```

测试现在应该通过了。

## 接下来是什么

- 继续[步骤 4:连接到 API](/angular-tutorial/04-connect-to-api)

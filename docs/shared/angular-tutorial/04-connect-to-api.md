# Angular Nx 教程-第四步:连接到一个 API

现实世界的应用程序并不是孤立存在的——它们需要与 api 进行通信。
设置你的应用程序与 API 对话。

**打开 `apps/todos/src/app/app.module.ts` 导入 `HttpClientModule`.**

```typescript
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, HttpClientModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

**现在，在组件中使用`HttpClient`从 api 获取数据。**

```typescript
import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface Todo {
  title: string;
}

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

## 接下来是什么

- 继续[步骤 5:添加实现 API 的节点应用程序](/angular-tutorial/05-add-node-app)

# Angular Nx 教程-第六步:代理

您在创建节点应用程序时传递了`--frontendProject=todos`。这个论点做了什么?
它创建了一个代理配置，允许 Angular 应用在开发过程中与 API 对话。

**要查看它是如何工作的，请打开`apps/todos/project.json`，并找到 todos 应用程序的 `serve` 目标。**

```json
{
  "serve": {
    "executor": "@angular-devkit/build-angular:dev-server",
    "configurations": {
      "production": {
        "browserTarget": "todos:build:production"
      },
      "development": {
        "browserTarget": "todos:build:development"
      }
    },
    "defaultConfiguration": "development",
    "options": {
      "proxyConfig": "apps/todos/proxy.conf.json"
    }
  }
}
```

**注意`proxyConfig`属性。**

**现在打开 `apps/todos/proxy.conf.json`:**

```json
{
  "/api": {
    "target": "http://localhost:3333",
    "secure": false
  }
}
```

这个配置告诉 `nx serve` 将所有以 `/api` 开头的请求转发给监听端口 `3333`的进程。

## 接下来是什么

- 继续[步骤 7:共享代码](/angular-tutorial/07-share-code)

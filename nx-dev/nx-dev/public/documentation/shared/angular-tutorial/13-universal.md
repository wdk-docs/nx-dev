# ng-universal

## 描述

用于[Nest](https://github.com/nestjs/nest)的 Angular[Universal](https://github.com/angular/universal)模块

## 安装

使用 Angular CLI:

```bash
ng add @nestjs/ng-universal
```

或手动:

```bash
npm i @nestjs/ng-universal
```

## 示例

参见完整示例[此处](https://github.com/kamilmysliwiec/universal-nest).

## 使用

如果你手动安装了这个模块，你需要在你的 Nest 应用中导入`AngularUniversalModule`。

```typescript
import { Module } from '@nestjs/common';
import { join } from 'path';
import { AngularUniversalModule } from '@nestjs/ng-universal';

@Module({
  imports: [
    AngularUniversalModule.forRoot({
      bootstrap: AppServerModule,
      viewsPath: join(process.cwd(), 'dist/{APP_NAME}/browser'),
    }),
  ],
})
export class ApplicationModule {}
```

## API Spec

`forRoot()` 方法接受一个带有一些有用属性的选项对象。

| 属性                | 类型                | 描述                                                 |
| ------------------- | ------------------- | ---------------------------------------------------- |
| `viewsPath`         | string              | 模块应该查找客户端包的目录(Angular 应用)             |
| `bootstrap`         | Function            | Angular 服务器模块参考 (`AppServerModule`).          |
| `templatePath`      | string?             | 索引文件的路径 (default: `{viewsPaths}/index.html`)  |
| `rootStaticPath`    | string?             | 静态文件根目录 (default: `*.*`)                      |
| `renderPath`        | string?             | 渲染 Angular 应用的路径 (default: `*`)               |
| `extraProviders`    | StaticProvider[]?   | 当前呈现请求的平台级提供程序                         |
| `inlineCriticalCss` | boolean?            | 通过内联关键的 CSS 减少渲染阻塞请求。(默认值是 true) |
| `cache`             | boolean? \| object? | 缓存选项，描述如下 (default: `true`)                 |
| `errorHandler`      | Function?           | 在呈现错误时要调用的回调                             |

### 缓存

| 属性           | 类型               | 描述                                            |
| -------------- | ------------------ | ----------------------------------------------- |
| `expiresIn`    | number?            | 缓存过期(毫秒)(默认值:' 60000 ')                |
| `storage`      | CacheStorage?      | 实现自定义缓存存储的接口(默认:在内存中)         |
| `keyGenerator` | CacheKeyGenerator? | 实现自定义缓存密钥生成逻辑的接口(默认:通过 url) |

```typescript
AngularUniversalModule.forRoot({
  bootstrap: AppServerModule,
  viewsPath: join(process.cwd(), 'dist/{APP_NAME}/browser'),
  cache: {
    storage: new InMemoryCacheStorage(),
    expiresIn: DEFAULT_CACHE_EXPIRATION_TIME,
    keyGenerator: new CustomCacheKeyGenerator(),
  },
});
```

### CacheKeyGenerator 的例子:

```typescript
export class CustomCacheKeyGenerator implements CacheKeyGenerator {
  generateCacheKey(request: Request): string {
    const md = new MobileDetect(request.headers['user-agent']);
    const isMobile = md.mobile() ? 'mobile' : 'desktop';
    return (request.hostname + request.originalUrl + isMobile).toLowerCase();
  }
}
```

## 请求和响应提供程序

这个工具使用了`@nguniversal/express-engine`，它会正确地提供对 Angular 组件中 Express Request 和 Response 对象的访问。
注意，token 必须从 `@nestjs/ng-universal/tokens`中导入，而不是`@nguniversal/express-engine/tokens`中导入。

当你的 Angular 路由器找不到页面(比如在路由中的`path: '**'` )时，把响应代码设置为 404 是很有用的:

```ts
import { Response } from 'express';
import { Component, Inject, Optional, PLATFORM_ID } from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { RESPONSE } from '@nestjs/ng-universal/tokens';

@Component({
  selector: 'my-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss'],
})
export class NotFoundComponent {
  constructor(
    @Inject(PLATFORM_ID)
    private readonly platformId: any,
    @Optional()
    @Inject(RESPONSE)
    res: Response
  ) {
    // `res` is the express response, only available on the server
    if (isPlatformServer(this.platformId)) {
      res.status(404);
    }
  }
}
```

## 自定义 Webpack

在某些情况下，使用`@nestjs/ng-universal`时，可能需要定制`webpack`构建，特别是当包含了额外的依赖(依赖于原生 Node.js 代码)时。

要在你的项目中添加一个可定制的`webpack`配置，建议在项目中安装[@angular-builders/custom-webpack](https://www.npmjs.com/package/@angular-builders/custom-webpack)，并适当地设置你的构建器。

### 自定义 Webpack 示例

```typescript
// webpack.config.ts
import { Configuration, IgnorePlugin } from 'webpack'
import {
  CustomWebpackBrowserSchema,
  TargetOptions
} from '@angular-builders/custom-webpack'
import nodeExternals from 'webpack-node-externals'

export default (
  config: Configuration
  _options: CustomWebpackBrowserSchema,
  targetOptions: TargetOptions
) => {
  if (targetOptions.target === 'server') {
    config.resolve?.extensions?.push('.mjs', '.graphql', '.gql')

    config.module?.rules?.push({
      test: /\.mjs$/,
      include: /node_modules/,
      type: 'javascript/auto'
    });

    config.externalsPresets = { node: true }

    (config.externals as Array<any>).push(
      nodeExternals({ allowlist: [/^(?!(livereload|concurrently|fsevents)).*/]})
    );

    config.plugins?.push(
      new IgnorePlugin({
        checkResource: (resource: string) => {
          const lazyImports = [
            '@nestjs/microservices',
            '@nestjs/microservices/microservices-module',
            '@nestjs/websockets/socket-module',
            'cache-manager',
            'class-validator',
            'class-transform',
          ];

          if (!lazyImpots.includes(resource)) {
            return false;
          }

          try {
            require.resolve(resource)
          } catch (_err: any) {
            return true;
          }
          return false;
        }
      })
    );
  }
  return config;
};

```

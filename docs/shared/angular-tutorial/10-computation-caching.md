# Angular Nx 教程 - 第 10 步:计算缓存

Nx 具有内置的计算缓存，这有助于极大地提高命令的性能。

**运行 `npx nx build todos` 查看它的运行情况:**

```bash
❯ nx build todos

> nx run todos:build:production
✔ Browser application bundle generation complete.
✔ Copying assets complete.
✔ Index html generation complete.

Initial Chunk Files           | Names         |  Raw Size | Estimated Transfer Size
main.198853e72abe040f.js      | main          | 125.05 kB |                35.88 kB
polyfills.80c46001d98dd563.js | polyfills     |  36.21 kB |                11.49 kB
runtime.db95d73b9ee480c5.js   | runtime       |   1.04 kB |               599 bytes
styles.ef46db3751d8e999.css   | styles        |   0 bytes |                       -

                              | Initial Total | 162.30 kB |                47.96 kB

Build at: 2022-01-21T20:36:14.528Z - Hash: 795c96ce5e48a766 - Time: 11596ms

———————————————————————————————————————————————

>  NX   SUCCESS  Running target "build" succeeded
```

**现在，再次运行 `npx nx build todos`，你会看到立即出现的结果:**

```bash
❯ nx build todos

> nx run todos:build:production [existing outputs match the cache, left as is]

Initial Chunk Files           | Names         |  Raw Size | Estimated Transfer Size
main.198853e72abe040f.js      | main          | 125.05 kB |                35.88 kB
polyfills.80c46001d98dd563.js | polyfills     |  36.21 kB |                11.49 kB
runtime.db95d73b9ee480c5.js   | runtime       |   1.04 kB |               599 bytes
styles.ef46db3751d8e999.css   | styles        |   0 bytes |                       -

                              | Initial Total | 162.30 kB |                47.96 kB

Build at: 2022-01-21T20:36:14.528Z - Hash: 795c96ce5e48a766 - Time: 11596ms

———————————————————————————————————————————————

>  NX   SUCCESS  Running target "build" succeeded

  Nx read the output from cache instead of running the command for 1 out of 1 tasks.
```

根据源代码和环境的状态，Nx 能够确定它已经运行了这个确切的命令。
Nx 在本地缓存中找到了工件，并重播了输出，并恢复了必要的文件。

> 缓存只适用于 Nx CLI。运行`ng build todos`每次都会运行该命令。

## 建立多个项目

使用 `run-many` 命令重新构建这两个应用程序:

```sh
npx nx run-many --target=build --projects=todos,api
```

注意输出:

```bash
Nx read the output from the cache instead of running the command for 1 out of 2 tasks.
```

Nx 构建了`api`，并从它的计算缓存中检索`todos`。点击[这里](/using-nx/caching)阅读更多关于缓存的信息.

> 将 `--parallel` 添加到任何命令中，Nx 就可以并行地完成大部分工作。

## 接下来是什么

- 继续[步骤 11:测试受影响的项目](/angular-tutorial/11-test-affected-projects)

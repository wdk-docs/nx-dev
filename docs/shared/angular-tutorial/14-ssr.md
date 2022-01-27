# Nrwl Nx 中的 Angular 通用服务器端渲染(SSR)

## 步骤 1:创建 Nx 工作区

如果您已经有了 Nx 工作区，请跳过此步骤。
这个命令将创建一个 Nx 工作区。

```sh
npx create-nx-workspace --preset=angular
```

我把我的工作区命名为“MyOrg”，把我的 Angular 应用命名为“MyApp”。

![在创建新工作区时，您将被提示的问题。](/shared/angular-tutorial/imgs/ssr_1.png)

## 步骤 2:将 Angular 应用添加到你的工作区

如果您运行了第 1 步，或者已经在您的工作空间中添加了您想要使用的应用程序，请跳过此步骤。
下一个命令将在你的“MyOrg”工作空间中生成一个新的 Angular 应用“MyApp”。这个命令需要在工作空间的根目录' my-org '中运行。

```sh
npx nx generate @nrwl/angular:app MyApp
```

![当你创建一个新的 angular 应用时，你会被提示的问题。](/shared/angular-tutorial/imgs/ssr_2.png)

## 步骤 3:添加 Angular Express 引擎

接下来，我们需要将 Angular Express 引擎添加到“my-app”中。
下面的命令就是这样做的。

```sh
npx ng add @nguniversal/express-engine --clientProject my-app
```

## 步骤 4:更新 outputPath

运行上述命令将添加 express 引擎，但它不是为 Nx 工作区设计的。
我们将不得不手动修复一些路径。
下面你可以看到“应用程序”是如何从路径中删除的。
我们现在把它加回去。

![在这里你可以看到当我们添加 express 引擎时，“apps”被从路径中删除了。](/shared/angular-tutorial/imgs/ssr_3.png)

![修正后的路径。](/shared/angular-tutorial/imgs/ssr_4.png)

## 步骤 5:更新服务器 distFolder

在生成的`server.ts`文件(apps > my-app > server.ts)中，我们需要添加“apps”到 distFolder 路径，就像我们在第 4 步中做的那样。

![我们需要在`server.ts`上做的路径改变](/shared/angular-tutorial/imgs/ssr_5.png)

## 步骤 6:构建和服务

这个命令将构建应用程序并创建 dist 文件夹。

```sh
npm run build:ssr
```

这个命令将启动服务器。

```sh
npm run serve:ssr
```

您现在可以在浏览器中查看您的应用程序 http://localhost:4000/

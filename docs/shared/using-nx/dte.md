# 分布式任务执行

> 在阅读本指南之前，请阅读[心智模型指导](/using-nx/mental-model)。它将帮助您理解计算缓存如何适应 Nx 的其余部分。

## 概述

Nx 支持在多台机器上运行命令。你可以手动设置(
参见[这里](/ci/distributed-builds))或使用 Nx Cloud。

[阅读这两种方法的比较。](https://blog.nrwl.io/distributing-ci-binning-and-distributed-task-execution-632fe31a8953?source=friends_link&sk=5120b7ff982730854ed22becfe7a640a)

当使用分布式任务执行时，Nx 可以在许多代理上运行任何任务图，而不是在本地运行。

例如，`nx affected --build`不会在本地运行构建(对于大型工作区来说，这可能需要几个小时)。
相反，它会将任务图发送到 Nx 云。然后，Nx 云代理将获取他们可以运行并执行的任务。

请注意，这是透明的。
如果一个代理构建了 `app1`，它将获取 `lib` 的输出，如果它没有这些输出。

当代理完成任务时，您调用`nx affected --build`的主要作业将开始接收创建的文件和终端输出。

完成`nx affected --build`后，机器将拥有构建文件和所有终端输出，就像它在本地运行一样。

![DTE](/shared/mental-model/dte.png)

## 例子

[这是一个 repo 示例](https://github.com/vsavkin/interstellar)，展示了设置分布式任务执行是多么容易，展示了性能收益，并与 sharding/binnig 进行了比较。

以下是在 CI 配置中启用分布式任务执行所带来的节省:

![DTE](/shared/using-nx/dte.png)

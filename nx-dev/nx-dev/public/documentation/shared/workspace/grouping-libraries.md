# 分组库

库应该按照 _scope_ 进行分组。
库的作用域要么是它所属的应用程序，要么是该应用程序中的某个部分(对于较大的应用程序)。

## 移动生成器

从一开始就不要太担心选择正确的文件夹结构。
库可以使用[`@nrwl/workspace:move` generator](/workspace/move)移动或重命名 .

例如，如果`booking`文件夹下的一个库现在被多个应用共享，你可以像这样将它移动到共享文件夹中:

```bash
nx g move --project booking-some-library shared/some-library
```

## 删除生成器

类似地，如果你不再需要一个库，你可以使用 [`@nrwl/workspace:remove` generator](/workspace/remove)删除它。

```bash
nx g remove booking-some-library
```

## 工作区例子

让我们以北方航空公司为例。
该组织有两款应用程序， `booking` and `check-in`.
在 Nx 工作空间中，与`booking`相关的库被分组在`libs/booking`文件夹下，与`check-in`相关的库被分组在`libs/check-in`文件夹下，两个应用程序中使用的库被放在`libs/shared`文件夹下。
你也可以有嵌套的分组文件夹(即 `libs/shared/seatmap`).

这些文件夹的目的是帮助按范围进行组织。
我们建议将(通常)一起更新的库分组在一起。
它有助于减少开发人员在文件夹树中寻找正确文件所花费的时间。

```text
apps/
  booking/
  check-in/
libs/
  booking/                 <---- grouping folder
    feature-shell/         <---- library

  check-in/
    feature-shell/

  shared/                  <---- grouping folder
    data-access/           <---- library

    seatmap/               <---- grouping folder
      data-access/         <---- library
      feature-seatmap/     <---- library
```

## 共享库

使用 monorepo 的主要优点之一是，可以在许多不同的应用程序之间重用代码，从而提供了更多的可见性。
共享库是一种很好的方法，可以通过重用解决常见问题的解决方案来节省开发人员的时间和精力。

让我们考虑一下我们的参考 monorepo.
`shared-data-access`库包含与后端通信所需的代码(例如，URL 前缀)。
我们知道这对所有的 libs 都是一样的;因此，我们应该将它放在共享库中，并对其进行适当的文档记录，以便所有项目都可以使用它，而不是编写自己的版本。

```text
  libs/
    booking/
      data-access/           <---- app-specific library

    shared/
      data-access/           <---- shared library

      seatmap/
        data-access/         <---- shared library
        feature-seatmap/     <---- shared library
```

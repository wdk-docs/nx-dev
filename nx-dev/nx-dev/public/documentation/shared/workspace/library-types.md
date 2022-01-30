# 库类型

工作区中有许多不同类型的库。
为了保持一定的秩序感，我们建议使用少量的类型，例如下面四(4)种类型的库。

**特征库:**

开发人员应该考虑为应用程序中的特定业务用例或页面实现智能 UI(带有对数据源的访问)的特性库。

**UI 库:**

UI 库只包含表示组件(也称为“哑”组件)。

**数据访问类库:**

数据访问库包含与后端系统交互的代码。
它还包括所有与状态管理相关的代码。

**实用工具库:**

实用程序库包含许多库和应用程序使用的低级实用程序。

---

## 特征库

**它是什么?**

特性库包含一组配置业务用例或应用程序中的页面的文件。
此类库中的大多数组件都是与数据源交互的智能组件。
这种类型的库还包含大多数 UI 逻辑、表单验证代码等。
特性库几乎都是特定于应用的，通常是惰性加载的。

**命名约定**

`feature` (if nested) or `feature-\*` (e.g., `feature-home`).

**依赖约束**

一个特性库可以依赖于任何类型的库。

```treeview
libs/
└── my-app/
    └── feature-home/
        └── src/
            ├── index.ts
            └── lib/
```

“feature-home”是应用特有的特性库(在这里是“my-app”应用)。

---

## UI Libraries

**What is it?**

A UI library is a collection of related presentational components. There are generally no services injected into these components (all of the data they need should come from Inputs).

**Naming Convention**

`ui` (if nested) or `ui-\*` (e.g., `ui-buttons`)

**Dependency Constraints**

A ui library can depend on ui and util libraries.

---

## Data-access Libraries

**What is it?**

Data-access libraries contain code that function as client-side delegate layers to server tier APIs.

All files related to state management also reside in a `data-access` folder (by convention, they can be grouped under a `+state` folder under `src/lib`).

**Naming Convention**

`data-access` (if nested) or `data-access-\*` (e.g. `data-access-seatmap`)

**Dependency Constraints**

A data-access library can depend on data-access and util libraries.

---

## Utility Libraries

**What is it?**

A utility library contains low level code used by many libraries. Often there is no framework-specific code and the library is simply a collection of utilities or pure functions.

**Naming Convention**

`util` (if nested), or `util-\*` (e.g., `util-testing`)

**Dependency Constraints**

A utility library can depend only on utility libraries.

An example ui lib module: **libs/shared/util-formatting**

```typescript
export { formatDate, formatTime } from './src/format-date-fns';
export { formatCurrency } from './src/format-currency';
```

## Other Types

You will probably come up with other library types that make sense for your organization. That's fine. Just keep a few things in mind:

- Keep the number of library types low
- Clearly document what each type of library means

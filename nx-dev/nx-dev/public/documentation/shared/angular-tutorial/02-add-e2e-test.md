# Angular Nx 教程-第二步:添加端到端测试

默认情况下，Nx 使用[Cypress](/cypress/overview)运行端到端测试。

**打开 `apps/todos-e2e/src/support/app.po.ts`.** 它是一个页面对象文件，包含查询页面的助手。

**添加以下两个助手:**

```typescript
export const getTodos = () => cy.get('li.todo');
export const getAddTodoButton = () => cy.get('button#add-todo');
```

**接下来,更新 `apps/todos-e2e/src/integration/app.spec.ts`.**

```typescript
import { getAddTodoButton, getTodos } from '../support/app.po';

describe('TodoApps', () => {
  beforeEach(() => cy.visit('/'));

  it('should display todos', () => {
    getTodos().should((t) => expect(t.length).equal(2));
    getAddTodoButton().click();
    getTodos().should((t) => expect(t.length).equal(3));
  });
});
```

这是一个简单的 E2E 测试示例，但对于本教程来说已经足够了。

如果你还没有这样做，停止`npx nx serve`命令，然后运行`npx nx e2e todos-e2e --watch`。

UI 打开。点击右上角显示"Run 1 integration spec"的按钮。保持端到端测试运行。

在学习本教程的过程中，您将努力使这些端到端测试通过。

## 接下来是什么

- 继续[步骤 3:显示待办事项](/angular-tutorial/03-display-todos)

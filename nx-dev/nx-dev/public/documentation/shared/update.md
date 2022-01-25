# 更新 Nx

Nx CLI 提供了`migrate`命令来帮助你跟上 Nx 的最新版本。

`nx migrate` 不仅会将您更新到最新版本的 Nx，而且还会更新我们支持和测试的依赖关系版本，如 Jest 和 Cypress。
你也可以使用`migrate`命令来更新任何 Nx 插件。

## 迁移到最新的 Nx 版本

迁移分为两个步骤:

- 安装的依赖会被更新，包括`package.json` (和 `node_modules`)。
- repo 中的源代码会被更新以匹配`package.json`中的新版本的包。

### 步骤 1:更新依赖项并生成迁移

首先，运行 `migrate` 命令:

```bash
nx migrate latest # same as nx migrate @nrwl/workspace@latest
```

You can also specify the name of the package and the version:

```bash
nx migrate @nrwl/workspace@version # you can also specify version
```

This fetches the specified version of the `@nrwl/workspace` package, analyzes the dependencies and fetches all the dependent packages. The process keeps going until all the dependencies are resolved. This results in:

- The `package.json` being updated
- A `migrations.json` being generated if there are pending migrations.

At this point, no packages have been installed, and no other files have been touched.

Now, you can inspect `package.json` to see if the changes make sense. Sometimes the migration can update some package to the version that is either not allowed or conflicts with another package. Feel free to manually apply the desired adjustments.

### Step 2: Install the packages

After inspecting the `package.json`, make sure to install the updated package versions by running `npm install`, `yarn`, or `pnpm install`.

### Step 3: Running migrations

Next, update the repo to match the updated `package.json` and `node_modules`. Every Nx plugin comes with a set of migrations that describe how to update the workspace to make it work with the new version of the plugin. During step one, Nx looked at all of the packages being updated and collected their migrations into `migrations.json`. It's important to note that because Nx knows the from and to versions of every package, the `migrations.json` file only contains the relevant migrations.

Each migration in `migrations.json` updates the source code in the repository. To run all the migrations in order, run the following command:

```bash
nx migrate --run-migrations
```

To specify a custom migrations file, pass it to the `--run-migrations` option:

```bash
nx migrate --run-migrations=migrations.json
```

For small projects, running all the migrations at once often succeeds without any issues. For large projects, more flexibility is needed:

- You may have to skip a migration.
- You may want to run one migration at a time to address minor issues.
- You may want to reorder migrations.
- You may want to run the same migration multiple time if the process takes a long time and you had to rebase.

Because you can run `nx migrate --run-migrations` as many times as you want, you can achieve all of that by commenting out and reordering items in `migrations.json`. The migration process can take a long time, depending on the number of migrations, so it is useful to commit the migrations file with the partially-updated repo.

### Step 4: Cleaning up

After you run all the migrations, you can remove `migrations.json` and commit the changes.

## Advanced capabilities & recommendations

### One major version at a time, small steps

Migrating Jest, Cypress, ESLint, React, Angular, Next, and more is a difficult task. All the tools change at different rates, they can conflict with each other. In addition, every workspace is different. Even though our goal is for you to update any version of Nx to a newer version of Nx in a single go, sometimes it doesn't work. The following process is better for large workspaces.

Say you want to migrate from Nx 10.1.0 to Nx 11.0.1. The following steps are more likely to work comparing to `nx migrate 11.0.1`.

- Run `nx migrate 10.4.5` to update the latest version in the 10.x branch.
- Run `npm install`.
- Run `nx migrate --run-migrations`.
- Next, run `nx migrate 11.0.1`.
- Run `npm install`.
- Run `nx migrate --run-migrations`.

### Overriding versions

Sometimes, you may want to use a different version of a package than what Nx recommends. To do that, specify the package and version:

```bash
nx migrate @nrwl/workspace --to="jest@22.0.0,cypress:3.4.0"
```

By default, Nx uses currently installed packages to calculate what migrations need to run. To override them, override the version:

```bash
nx migrate @nrwl/workspace --to="@nrwl/jest@12.0.0"
```

### Reverting a failed update

Updates are best done on a clean git history so that it can be easily reversed if something fails. We try our best to make sure migrations do not fail but if one does, **please report it** on [GitHub](https://www.github.com/nrwl/nx/issues/new/).

If an update fails for any reason, you can revert it as you do any other set of changes:

```bash
git reset --hard # Reset any changes
git clean -fd # Delete newly added files and directories
```

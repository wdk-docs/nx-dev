# Transitioning to Nx

Within an Nx workspace, you gain many capabilities that help you build applications and libraries
using a monorepo approach. If you are currently using an Angular CLI workspace, you can transform it into an Nx workspace.

## Prerequisites

- The major version of your `Angular CLI` must align with the version of `Nx` you are upgrading to. For example, if you're using Angular CLI version 7, you must transition using the latest version 7 release of Nx.
- Currently, transforming an Angular CLI workspace to an Nx workspace automatically only supports a single project. If you have more than one project in your Angular CLI workspace, you can still migrate manually.

## Using ng add and preserving your existing structure

To add Nx to an existing Angular CLI workspace to an Nx workspace, with keeping your existing file structure in place, use the `ng add` command with the `--preserveAngularCLILayout` option:

```bash
ng add @nrwl/workspace --preserveAngularCLILayout
```

This installs the `@nrwl/workspace` package into your workspace and applies the following changes to your workspace:

- Adds and installs the `@nrwl/workspace` package in your development dependencies.
- Creates an nx.json file in the root of your workspace.
- Adds a `decorate-angular-cli.js` to the root of your workspace, and a `postinstall` script in your `package.json` to run the script when your dependencies are updated. The script forwards the `ng` commands to the Nx CLI(nx) to enable features such as Computation Caching.

After the process completes, you continue using the same serve/build/lint/test commands.

## Using ng add

To transform a Angular CLI workspace to an Nx workspace, use the `ng add` command:

```bash
ng add @nrwl/workspace
```

This installs the `@nrwl/workspace` package into your workspace and runs a generator (or schematic) to transform your workspace. The generator applies the following changes to your workspace:

- Installs the packages for the `Nx` plugin `@nrwl/angular` in your package.json.
- Creates an nx.json file in the root of your workspace.
- Creates configuration files for Prettier.
- Creates an `apps` folder for generating applications.
- Creates a `libs` folder for generating libraries.
- Creates a `tools` folder that includes files for custom workspace tooling, such as workspace-specific generators and scripts.
- Moves your application into the `apps` folder, and updates the relevant file paths in your configuration files.
- Moves your e2e suite into the `apps/{{app name}}-e2e` folder, and updates the relevant file paths in your configuration files.
- Updates your `package.json` with scripts to run various `Nx` workspace commands.
- Updates your `angular.json` configuration to reflect the new paths.

After the changes are applied, your workspace file structure should look similar to below:

```treeview
<workspace name>/
├── apps/
│   ├── <app name>/
│   │   ├── src/
│   │   │   ├── app/
│   │   │   ├── assets/
│   │   │   ├── environments/
│   │   │   ├── favicon.ico
│   │   │   ├── index.html
│   │   │   ├── main.ts
│   │   │   ├── polyfills.ts
│   │   │   ├── styles.css
│   │   │   └── test.ts
│   │   ├── browserslist
│   │   ├── karma.conf.js
│   │   ├── tsconfig.app.json
│   │   └── tsconfig.spec.json
│   └── <app name>-e2e/
│       ├── src/
│       ├── protractor.conf.js
│       └── tsconfig.json
├── libs/
├── tools/
├── README.md
├── angular.json
├── nx.json
├── package.json
└── tsconfig.base.json
```

Your workspace is now powered by Nx! You can verify out that your application still runs as intended:

- To serve, run `ng serve`.
- To build, run `ng build`.
- To run unit tests, run `ng test`.
- To run e2e tests, run `ng e2e`.
- To see your project graph, run `nx graph`.

> Your project graph will grow as you add, and use more applications and libraries. You can add the `--watch` flag to `nx graph` to see this changes in-browser as you add them.

Learn more about the advantages of Nx in the following guides:

- [Using Cypress for e2e tests](/cypress/overview)
- [Using Jest for unit tests](/jest/overview)
- [Computation Caching](/using-nx/caching)
- [Rebuilding and Retesting What is Affected](/using-nx/affected)

## Transitioning Manually

If you are unable to automatically transform your Angular CLI workspace to an Nx workspace using the [ng add](/migration/migration-angular#using-ng-add-preserving-your-existing-structure) method, there are some manual steps you can take to move your project(s) into an Nx workspace.

### Generating a new workspace

To start, run the command to generate an Nx workspace with an Angular application.

**Using `npx`**

```bash
npx create-nx-workspace myorg --preset=angular
```

**Using `npm init`**

```bash
npm init nx-workspace myorg --preset=angular
```

**Using `yarn create`**

```bash
yarn create nx-workspace myorg --preset=angular
```

When prompted for the `application name`, enter the _project name_ from your current `angular.json` file.

A new Nx workspace with your `org name` as the folder name, and your `application name` as the first application is generated.

```treeview
<workspace name>/
├── apps/
│   ├── <app name>/
│   │   ├── src/
│   │   │   ├── app/
│   │   │   ├── assets/
│   │   │   ├── environments/
│   │   │   ├── favicon.ico
│   │   │   ├── index.html
│   │   │   ├── main.ts
│   │   │   ├── polyfills.ts
│   │   │   ├── styles.css
│   │   │   └── test.ts
│   │   ├── browserslist
│   │   ├── jest.conf.js
│   │   ├── tsconfig.app.json
│   │   ├── tsconfig.json
│   │   ├── tslint.json
│   │   └── tsconfig.spec.json
│   └── <app name>-e2e/
│       ├── src/
│       ├── cypress.json
│       ├── tsconfig.e2e.json
│       ├── tslint.json
│       └── tsconfig.json
├── libs/
├── tools/
├── .prettierignore
├── .prettierrc
├── README.md
├── angular.json
├── jest.config.js
├── nx.json
├── package.json
├── tsconfig.base.json
└── tslint.json
```

### Copying over application files

Your application code is self-contained within the `src` folder of your Angular CLI workspace.

- Copy the `src` folder from your Angular CLI project to the `apps/<app name>` folder, overwriting the existing `src` folder.
- Copy any project-specific files, such as `browserslist`, or service worker configuration files into their relative path under the `apps/<app name>` folder.
- Transfer the `assets`, `scripts`, `styles`, and build-specific configuration, such as service worker configuration, from your Angular CLI `angular.json` to the Nx workspace `angular.json` file.

Verify your app runs correctly by running:

```bash
ng serve <app name>
```

### Updating your unit testing configuration

Nx uses Jest by default. If you have any custom Jest configuration, you need to update the workspace Jest configuration also.

Verify your tests run correctly by running:

```bash
ng test <app name>
```

If you are using `Karma` for unit testing:

- Copy the `karma.conf.js` file to your `apps/<app name>` folder.
- Copy the `test.ts` file to your `apps/<app name>/src` folder.
- Copy the `test` target in your `architect` configuration from your Angular CLI `angular.json` file into your Nx workspace `angular.json` file.
- Update your `test` target to prepend `apps/<app name>` to each of the file paths.

```json
{
  "projects": {
    "<app name>": {
      "projectType": "application",
      "schematics": {},
      "root": "apps/<app name>",
      "sourceRoot": "apps/<app name>/src",
      "prefix": "myapp",
      "architect": {
        "test": {
          "builder": "@angular-devkit/build-angular:karma",
          "options": {
            "main": "apps/<app name>/src/test.ts",
            "polyfills": "apps/<app name>/src/polyfills.ts",
            "tsConfig": "apps/<app name>/tsconfig.spec.json",
            "karmaConfig": "apps/<app name>/karma.conf.js",
            "assets": [
              "apps/<app name>/src/favicon.ico",
              "apps/<app name>/src/assets"
            ],
            "styles": ["apps/<app name>/src/styles.css"],
            "scripts": []
          }
        }
      }
    }
  },
  "cli": {
    "defaultCollection": "@nrwl/angular"
  },
  "schematics": {
    "@nrwl/angular:application": {
      "unitTestRunner": "jest",
      "e2eTestRunner": "cypress"
    },
    "@nrwl/angular:library": {
      "unitTestRunner": "jest"
    }
  },
  "defaultProject": "<app name>"
}
```

> Jest will be used by default when generating new applications. If you want to continue using `Karma`, set the `unitTestRunner` to `karma` in the `schematics` section of the `angular.json` file.

- Update `test-setup.ts` to `test.ts` in the `files` array of the `apps/<app name>/tsconfig.spec.json` file.

```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "outDir": "../../dist/out-tsc",
    "module": "commonjs",
    "types": ["node"]
  },
  "files": ["src/test.ts", "src/polyfills.ts"],
  "include": ["**/*.spec.ts", "**/*.d.ts"]
}
```

Verify your tests run correctly by running:

```bash
ng test <app name>
```

### Updating your E2E testing configuration

Nx uses Cypress by default. If you are already using Cypress, copy your E2E setup files into the `apps/<app name>-e2e` folder and verify your tests still run correctly by running:

```bash
ng e2e <app name>-e2e
```

If you are using `Protractor` for E2E testing:

- Delete the `apps/<app name>-e2e` folder that was generated to use Cypress.
- Copy the `e2e` folder from your Angular CLI workspace into the `apps` file to your `apps/<app name>` folder.
- Rename the `e2e` folder to `<app name>-e2e`.
- In the Nx workspace `angular.json`, update your `<app name>-e2e` project with the `Protractor` configuration.

```json
{
  "version": 1,
  "projects": {
    "<app name>-e2e": {
      "root": "apps/<app name>-e2e",
      "projectType": "application",
      "architect": {
        "e2e": {
          "builder": "@angular-devkit/build-angular:protractor",
          "options": {
            "protractorConfig": "apps/<app name>-e2e/protractor.conf.js",
            "devServerTarget": "<app name>:serve"
          },
          "configurations": {
            "production": {
              "devServerTarget": "<app name>:serve:production"
            }
          }
        },
        "lint": {
          "builder": "@angular-devkit/build-angular:tslint",
          "options": {
            "tsConfig": "apps/<app name>-e2e/tsconfig.e2e.json",
            "exclude": ["**/node_modules/**", "!apps/<app name>-e2e/**/*"]
          }
        }
      }
    }
  },
  "cli": {
    "defaultCollection": "@nrwl/angular"
  },
  "schematics": {
    "@nrwl/angular:application": {
      "unitTestRunner": "jest",
      "e2eTestRunner": "cypress"
    },
    "@nrwl/angular:library": {
      "unitTestRunner": "jest"
    }
  },
  "defaultProject": "<app name>"
}
```

Create a `tsconfig.e2e.json` file under `apps/<app name>-e2e` folder:

```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "outDir": "../../dist/out-tsc"
  }
}
```

Update the `apps/<app name>/tsconfig.json` to extend the root `tsconfig.json`:

```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "outDir": "../../out-tsc/<app name>-e2e",
    "module": "commonjs",
    "target": "es5",
    "types": ["jasmine", "jasminewd2", "node"]
  }
}
```

Verify your E2E tests run correctly by running:

```bash
ng e2e <app name>-e2e
```

> Cypress will be used by default when generating new applications. If you want to continue using `Protractor`, set the `e2eTestRunner` to `protractor` in the `schematics` section of the `angular.json` file.

### Updating your linting configuration

For lint rules, migrate your existing rules into the root `tslint.json` file.

Verify your lint checks run correctly by running:

```bash
npm run lint
```

OR

```bash
yarn lint
```

Learn more about the advantages of Nx in the following guides:

[Using Cypress for e2e tests](/cypress/overview) \
[Using Jest for unit tests](/jest/overview) \
[Rebuilding and Retesting What is Affected](/using-nx/affected)

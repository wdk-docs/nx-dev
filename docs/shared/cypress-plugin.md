# Cypress Plugin

![Cypress logo](/shared/cypress-logo.png)

Cypress is an e2e test runner built for modern web. It has a lot of great features:

- Time travel
- Real-time reloads
- Automatic waiting
- Spies, stubs, and clocks
- Network traffic control
- Screenshots and videos

## Setting Up Cypress

### Generating Applications

By default, when creating a new frontend application, Nx will use Cypress to create the e2e tests project.

```bash
nx g @nrwl/web:app frontend
```

### Creating a Cypress E2E project for an existing project

You can create a new Cypress E2E project for an existing project.

If the `@nrwl/cypress` package is not installed, install the version that matches your `@nrwl/workspace` version.

```sh
#yarn
yarn add --dev @nrwl/cypress
```

```sh
#npm
npm install --save-dev @nrwl/cypress
```

Next, generate an E2E project based on an existing project.

```sh
nx g @nrwl/cypress:cypress-project your-app-name-e2e --project=your-app-name
```

Replace `your-app-name` with the app's name as defined in your `workspace.json` file.

## Using Cypress

### Testing Applications

Simply run `nx e2e frontend-e2e` to execute e2e tests with Cypress.

By default, Cypress will run in “headed” mode (you will see the tests executing in a new browser window). You will have the result of all the tests and errors (if any) in your terminal.

Screenshots and videos will be accessible in `dist/apps/frontend/screenshots` and `dist/apps/frontend/videos`.

### Watching for Changes

With, `nx e2e frontend-e2e --watch` Cypress will start in the application mode.

Running Cypress with `--watch` is a great way to enhance dev workflow - you can build up test files with the application running and Cypress will re-run those tests as you enhance and add to the suite.

Cypress doesn't currently re-run your tests after changes are made to application code when it runs in “headed” mode. There is an [open feature request](https://github.com/nrwl/nx/issues/870) to add this behaviour.

### Using Cypress in the Headless Mode

If you want to run the Cypress tests in headless mode (e.g., on CI), you can do so by passing `--headless`. You will see all the test results live in the terminal. Videos and screenshots will be available for debugging.

In headless mode your tests **will** be re-run every time you make a change to your application code.

### Testing Against Prod Build

You can run your e2e test against a production build like this: `nx e2e frontend-e2e --prod`.

## Configuration

### Specifying a Custom Url to Test

The `baseUrl` property provides you the ability to test an application hosted on a specific domain.

```bash
nx e2e frontend-e2e --baseUrl=https://frontend.com
```

> If no `baseUrl` and no `devServerTarget` are provided, Cypress will expect to have the `baseUrl` property in the `cypress.json` file, or will error.

### Using cypress.json

If you need to fine tune your Cypress setup, you can do so by modifying `cypress.json` in the e2e project. For instance, you can easily add your `projectId` to save all the screenshots and videos into your Cypress dashboard. The complete configuration is documented on [the official website](https://docs.cypress.io/guides/references/configuration.html#Options).

## More Documentation

React Nx Tutorial

- [Step 2: Add E2E Tests](/react-tutorial/02-add-e2e-test)
- [Step 3: Display Todso](/react-tutorial/03-display-todos)

Angular Nx Tutorial

- [Step 2: Add E2E Tests](/angular-tutorial/02-add-e2e-test)
- [Step 3: Display Todso](/angular-tutorial/03-display-todos)

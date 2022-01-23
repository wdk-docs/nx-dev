# Nx Plugins

Nx plugins are npm packages that contain generators and executors to extend a Nx workspace. Generators are blueprints to create new files from templates, and executors run those files. These plugins also update the `nx.json` when generating new libs or apps.

> A list of plugins that is maintained by Nrwl is found in the [Nrwl/nx repo](https://github.com/nrwl/nx/tree/master/packages). \
> A list of custom plugins created by the community is found in the [Community](/community) section.
> Plugins are written using Nx Devkit. **Read [Nx Devkit](/getting-started/nx-devkit) for more information.**

## Generating a Plugin

To get started with building a Nx Plugin, run the following command:

```bash
npx create-nx-plugin my-org --pluginName my-plugin
```

This command creates a brand new workspace, and sets up a pre-configured plugin with the specified name.

> Note, the command above will create a plugin the package name set to `@my-org/my-plugin`. You can pass `--importPath` to provide a different package name.

## Workspace Structure

After executing the above command, the following tree structure is created:

```treeview
my-org/
├── e2e/
│   └── my-plugin-e2e/
│       ├── jest.config.js
│       ├── tests/
│       │   └── my-plugin.test.ts
│       ├── tsconfig.json
│       └── tsconfig.spec.json
├── packages/
│   └── my-plugin/
│       ├── README.md
│       ├── executors.json
│       ├── generators.json
│       ├── jest.config.js
│       ├── package.json
│       ├── src/
│       │   ├── executors/
│       │   │   └── my-plugin/
│       │   │       ├── executor.spec.ts
│       │   │       ├── executor.ts
│       │   │       ├── schema.d.ts
│       │   │       └── schema.json
│       │   ├── index.ts
│       │   └── generators/
│       │       └── my-plugin/
│       │           ├── files/
│       │           │   └── src/
│       │           │       └── index.ts.__template__
│       │           ├── schema.d.ts
│       │           ├── schema.json
│       │           ├── generator.spec.ts
│       │           └── generator.ts
│       ├── tsconfig.json
│       ├── tsconfig.lib.json
│       └── tsconfig.spec.json
├── tools
│   ├── generators/
│   └── tsconfig.tools.json
├── jest.config.js
├── nx.json
├── package.json
├── tsconfig.base.json
├── workspace.json
└── yarn.lock
```

> If you do not want to create a new workspace, install the `@nrwl/nx-plugin` dependency in an already existing workspace with npm or yarn. Then run `nx g @nrwl/nx-plugin:plugin [pluginName]`.

A new plugin is created with a default generator, executor, and e2e app.

## Generator

The created generator contains boilerplate that will do the following:

- Normalize a schema (the options that the generator accepts)
- Update the `workspace.json`
- Add the plugin's project to the `nx.json` file
- Add files to the disk using templates

There will be a exported default function that will be the main entry for the generator.

### Generator options

The `schema.d.ts` file contains all the options that the generator supports. By default, it includes `directory`, `tags`, and `name` as the options. If more options need to be added, please update this file and the `schema.json` file.

> Note: The `schema.d.ts` file is used for type checking inside the implementation file. It should match the properties in `schema.json`.

### Adding more generators

To add more generators to the plugin, run the following command:
`nx generate @nrwl/nx-plugin:generator [generatorName] --project=[pluginName]`.

This will scaffold out a new generator and update the necessary files to support it.

### Generator Testing

The generator spec file includes boilerplate to help get started with testing. This includes setting up an empty workspace.

These tests should ensure that files within the tree (created with `createTreeWithEmptyWorkspace`) are in the correct place, and contain the right content.

Full E2Es are supported (and recommended) and will run everything on the file system like a user would.

## Executor

The default executor is set up to just emit a console log. Some examples of what an executor can do are:

- Support different languages, (Java, Go, Python, C#)
- Compile new UI framework components
- Deploy an app on a CDN
- Publish to NPM
- and many more!

### Adding more executors

To add more executors to the plugin, run the following command:
`nx generate @nrwl/nx-plugin:executor [executor] --project=[pluginName]`.

This will scaffold out a new generator and update the necessary files to support it.

### Executor testing

The executor spec file contains boilerplate to run the default exported function from the executor.

These tests should make sure that the executor is executing and calling the functions that it relies on.

Full E2Es are supported (and recommended) and will run everything on the file system like a user would.

## Testing your plugin

One of the biggest benefits that the Nx Plugin package provides is support for E2E testing.

When the E2E app runs, a temporary E2E directory is created in the root of the workspace. This directory is a blank Nx workspace, and will have the plugin's built package installed locally.

### E2E Testing file

When the plugin is generated, a test file is created in the `my-plugin-e2e` app. Inside this test file, there are already tests for making sure that the executor ran, checking if directories are created with the `--directory` option, and checking if tags are added to `nx.json`.

We'll go over a few parts of a test file below:

```typescript
it('should create my-plugin', async (done) => {
  const plugin = uniq('my-plugin');
  ensureNxProject('@my-org/my-plugin', 'dist/packages/my-plugin');
  await runNxCommandAsync(`generate @my-org/my-plugin:myPlugin ${plugin}`);

  const result = await runNxCommandAsync(`build ${plugin}`);
  expect(result.stdout).toContain('Executor ran');

  done();
});
```

- The `uniq` function creates a random name with the prefix and a random number.
- The `ensureNxProject` is the function that will create the temporary directory. It takes two arguments, the plugin package name and the dist directory of when it's built.
- The `runNxCommandAsync` will execute a `nx` command in the E2E directory.

There are additional functions that the `@nrwl/nx-plugin/testing` package exports. Most of them are file utilities to manipulate and read files in the E2E directory.

## Including Assets

Sometimes you might want to include some assets with the plugin. This might be a image or some additional binaries.

To make sure that assets are copied to the dist folder, open the `workspace.json` file, and find the plugin's project. Inside the `build` property, add additional assets. By default, all `.md` files in the root, all non-ts files in folders, and the `generators.json` and `executors.json` files are included.

```json
"build": {
  "executor": "@nrwl/node:package",
  "options": {
    // shortened...
    "assets": [
      "packages/my-plugin/*.md",
      {
        "input": "./packages/my-plugin/src",
        "glob": "**/*.!(ts)",
        "output": "./src"
      },
      {
        "input": "./packages/my-plugin",
        "glob": "generators.json",
        "output": "."
      },
      {
        "input": "./packages/my-plugin",
        "glob": "executors.json",
        "output": "."
      }
    ]
  }
}
```

## Publishing your Nx Plugin

To publish your plugin follow these steps:

1. Build your plugin with the command `nx run my-plugin:build`
1. `npm publish ./dist/package/my-plugin` and follow the prompts from npm.
1. That's it!

> Note: currently you will have to modify the `package.json` version by yourself or with a tool.

After that, you can then install your plugin like any other npm package,
`npm i -D @my-org/my-plugin` or `yarn add -D @my-org/my-plugin`.

### Listing your Nx Plugin

Nx provides a utility (`nx list`) that lists both core and community plugins. To submit your plugin, please follow the steps below:

- Fork the [Nx repo](https://github.com/nrwl/nx/fork) (if you haven't already)
- Update the [`community/approved-plugins.json` file](https://github.com/nrwl/nx/blob/master/community/approved-plugins.json) with a new entry for your plugin that includes name, url and description
- Use the following commit message template: `chore(core): nx plugin submission [PLUGIN_NAME]`
- push your changes, and run `yarn submit-plugin`

> The `yarn submit-plugin` command automatically opens the Github pull request process with the correct template.

We will then verify the plugin, offer suggestions or merge the pull request!

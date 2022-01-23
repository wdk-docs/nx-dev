import type { Tree } from '@nrwl/tao/src/shared/tree';
import * as path from 'path';
import type * as Prettier from 'prettier';
import { getWorkspacePath } from '../utils/get-workspace-layout';
import { readJson, updateJson, writeJson } from '../utils/json';
import { sortObjectByKeys } from '@nrwl/tao/src/utils/object-sort';
import {
  readWorkspaceConfiguration,
  updateWorkspaceConfiguration,
  WorkspaceConfiguration,
} from './project-configuration';

/**
 * Formats all the created or updated files using Prettier
 * @param tree - the file system tree
 */
export async function formatFiles(tree: Tree): Promise<void> {
  let prettier: typeof Prettier;
  try {
    prettier = await import('prettier');
  } catch {}

  ensurePropertiesAreInNewLocations(tree);
  sortWorkspaceJson(tree);
  sortTsConfig(tree);

  if (!prettier) return;

  const files = new Set(
    tree.listChanges().filter((file) => file.type !== 'DELETE')
  );
  await Promise.all(
    Array.from(files).map(async (file) => {
      const systemPath = path.join(tree.root, file.path);
      let options: Prettier.Options = {
        filepath: systemPath,
      };

      const resolvedOptions = await prettier.resolveConfig(systemPath, {
        editorconfig: true,
      });
      if (!resolvedOptions) {
        return;
      }
      options = {
        ...options,
        ...resolvedOptions,
      };

      const support = await prettier.getFileInfo(systemPath);
      if (support.ignored || !support.inferredParser) {
        return;
      }

      try {
        tree.write(
          file.path,
          prettier.format(file.content.toString('utf-8'), options)
        );
      } catch (e) {
        console.warn(`Could not format ${file.path}. Error: "${e.message}"`);
      }
    })
  );
}

function sortWorkspaceJson(tree: Tree) {
  const workspaceJsonPath = getWorkspacePath(tree);
  if (!workspaceJsonPath) {
    return;
  }

  try {
    const workspaceJson = readJson(tree, workspaceJsonPath);
    if (Object.entries(workspaceJson.projects).length !== 0) {
      const sortedProjects = sortObjectByKeys(workspaceJson.projects);
      writeJson(tree, workspaceJsonPath, {
        ...workspaceJson,
        projects: sortedProjects,
      });
    }
  } catch (e) {
    // catch noop
  }
}

/**
 * `updateWorkspaceConfiguration` already handles
 * placing properties in their new locations, so
 * reading + updating it ensures that props are placed
 * correctly.
 */
function ensurePropertiesAreInNewLocations(tree: Tree) {
  const workspacePath = getWorkspacePath(tree);
  if (!workspacePath) {
    return;
  }
  const wc = readWorkspaceConfiguration(tree);
  updateJson<WorkspaceConfiguration>(tree, workspacePath, (json) => {
    wc.generators ??= json.generators ?? (json as any).schematics;
    if (wc.cli) {
      wc.cli.defaultCollection ??= json.cli?.defaultCollection;
      wc.cli.packageManager ??= json.cli?.packageManager;
    } else if (json.cli) {
      wc.cli ??= json.cli;
    }
    wc.defaultProject ??= json.defaultProject;
    delete json.cli;
    delete json.defaultProject;
    delete (json as any).schematics;
    delete json.generators;
    return json;
  });
  updateWorkspaceConfiguration(tree, wc);
}

function sortTsConfig(tree: Tree) {
  try {
    const tsconfig = readJson(tree, 'tsconfig.base.json');
    const sortedPaths = sortObjectByKeys(tsconfig.compilerOptions.paths);
    writeJson(tree, 'tsconfig.base.json', {
      ...tsconfig,
      compilerOptions: {
        ...tsconfig.compilerOptions,
        paths: sortedPaths,
      },
    });
  } catch (e) {
    // catch noop
  }
}

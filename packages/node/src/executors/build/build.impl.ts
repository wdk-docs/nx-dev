import 'dotenv/config';
import { ExecutorContext } from '@nrwl/devkit';

import { readCachedProjectGraph } from '@nrwl/workspace/src/core/project-graph';
import {
  calculateProjectDependencies,
  checkDependentProjectsHaveBeenBuilt,
  createTmpTsConfig,
} from '@nrwl/workspace/src/utilities/buildable-libs-utils';

import { map, tap } from 'rxjs/operators';
import { eachValueFrom } from 'rxjs-for-await';
import { join, resolve } from 'path';
import { register } from 'ts-node';

import { getNodeWebpackConfig } from '../../utils/node.config';
import { BuildNodeBuilderOptions } from '../../utils/types';
import { normalizeBuildOptions } from '../../utils/normalize';
import { generatePackageJson } from '../../utils/generate-package-json';
import { runWebpack } from '../../utils/run-webpack';

import { existsSync } from 'fs';
import { appRootPath } from '@nrwl/tao/src/utils/app-root';

export type NodeBuildEvent = {
  outfile: string;
  success: boolean;
};

export async function* buildExecutor(
  rawOptions: BuildNodeBuilderOptions,
  context: ExecutorContext
) {
  const { sourceRoot, root } = context.workspace.projects[context.projectName];

  if (!sourceRoot) {
    throw new Error(`${context.projectName} does not have a sourceRoot.`);
  }

  if (!root) {
    throw new Error(`${context.projectName} does not have a root.`);
  }

  const options = normalizeBuildOptions(
    rawOptions,
    context.root,
    sourceRoot,
    root
  );

  if (options.webpackConfig.some((x) => x.endsWith('.ts'))) {
    registerTsNode();
  }

  const projGraph = readCachedProjectGraph();
  if (!options.buildLibsFromSource) {
    const { target, dependencies } = calculateProjectDependencies(
      projGraph,
      context.root,
      context.projectName,
      context.targetName,
      context.configurationName
    );
    options.tsConfig = createTmpTsConfig(
      options.tsConfig,
      context.root,
      target.data.root,
      dependencies
    );

    if (
      !checkDependentProjectsHaveBeenBuilt(
        context.root,
        context.projectName,
        context.targetName,
        dependencies
      )
    ) {
      return { success: false } as any;
    }
  }

  if (options.generatePackageJson) {
    generatePackageJson(context.projectName, projGraph, options);
  }
  const config = options.webpackConfig.reduce((currentConfig, plugin) => {
    return require(plugin)(currentConfig, {
      options,
      configuration: context.configurationName,
    });
  }, getNodeWebpackConfig(options));

  return yield* eachValueFrom(
    runWebpack(config).pipe(
      tap((stats) => {
        console.info(stats.toString(config.stats));
      }),
      map((stats) => {
        return {
          success: !stats.hasErrors(),
          outfile: resolve(
            context.root,
            options.outputPath,
            options.outputFileName
          ),
        } as NodeBuildEvent;
      })
    )
  );
}

function registerTsNode() {
  const rootTsConfig = join(appRootPath, 'tsconfig.base.json');
  register({
    ...(existsSync(rootTsConfig) ? { project: rootTsConfig } : null),
  });
}

export default buildExecutor;

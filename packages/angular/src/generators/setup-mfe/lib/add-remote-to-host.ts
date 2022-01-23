import type { Tree } from '@nrwl/devkit';
import type { Schema } from '../schema';

import { readProjectConfiguration, joinPathFragments } from '@nrwl/devkit';
import { tsquery } from '@phenomnomnominal/tsquery';
import { ObjectLiteralExpression } from 'typescript';
import { addRoute } from '../../../utils/nx-devkit/ast-utils';

import * as ts from 'typescript';

export function addRemoteToHost(host: Tree, options: Schema) {
  if (options.mfeType === 'remote' && options.host) {
    const hostProject = readProjectConfiguration(host, options.host);
    const hostWebpackPath =
      hostProject.targets['build'].options.customWebpackConfig?.path;

    if (!hostWebpackPath || !host.exists(hostWebpackPath)) {
      throw new Error(
        `The selected host application, ${options.host}, does not contain a webpack.config.js. Are you sure it has been set up as a host application?`
      );
    }

    const hostWebpackConfig = host.read(hostWebpackPath, 'utf-8');
    const webpackAst = tsquery.ast(hostWebpackConfig);
    const mfRemotesNode = tsquery(
      webpackAst,
      'Identifier[name=remotes] ~ ObjectLiteralExpression',
      { visitAllChildren: true }
    )[0] as ObjectLiteralExpression;

    const endOfPropertiesPos = mfRemotesNode.properties.end;

    const updatedConfig = `${hostWebpackConfig.slice(0, endOfPropertiesPos)}
    \t\t"${options.appName}": 'http://localhost:${
      options.port ?? 4200
    }/remoteEntry.js',${hostWebpackConfig.slice(endOfPropertiesPos)}`;

    host.write(hostWebpackPath, updatedConfig);

    const declarationFilePath = joinPathFragments(
      hostProject.sourceRoot,
      'decl.d.ts'
    );

    const declarationFileContent =
      (host.exists(declarationFilePath)
        ? host.read(declarationFilePath, 'utf-8')
        : '') + `\ndeclare module '${options.appName}/Module';`;
    host.write(declarationFilePath, declarationFileContent);

    addLazyLoadedRouteToHostAppModule(host, options);
  }
}

// TODO(colum): future work: allow dev to pass to path to routing module
function addLazyLoadedRouteToHostAppModule(host: Tree, options: Schema) {
  const hostAppConfig = readProjectConfiguration(host, options.host);
  const pathToHostAppModule = `${hostAppConfig.sourceRoot}/app/app.module.ts`;
  if (!host.exists(pathToHostAppModule)) {
    return;
  }

  const hostAppModule = host.read(pathToHostAppModule, 'utf-8');
  if (!hostAppModule.includes('RouterModule.forRoot(')) {
    return;
  }

  let sourceFile = ts.createSourceFile(
    pathToHostAppModule,
    hostAppModule,
    ts.ScriptTarget.Latest,
    true
  );

  sourceFile = addRoute(
    host,
    pathToHostAppModule,
    sourceFile,
    `{
         path: '${options.appName}', 
         loadChildren: () => import('${options.appName}/Module').then(m => m.RemoteEntryModule)
     }`
  );
}

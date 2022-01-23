import { dirname } from 'path';
import type * as ts from 'typescript';
import { appRootPath } from '@nrwl/tao/src/utils/app-root';

export type { TypeScriptCompilationOptions } from './typescript/compilation';
export { compileTypeScript } from './typescript/compilation';
export { findNodes } from './typescript/find-nodes';
export { getSourceNodes } from './typescript/get-source-nodes';

const normalizedAppRoot = appRootPath.replace(/\\/g, '/');

let tsModule: any;

export function readTsConfig(tsConfigPath: string) {
  if (!tsModule) {
    tsModule = require('typescript');
  }
  const readResult = tsModule.readConfigFile(
    tsConfigPath,
    tsModule.sys.readFile
  );
  return tsModule.parseJsonConfigFileContent(
    readResult.config,
    tsModule.sys,
    dirname(tsConfigPath)
  );
}

function readTsConfigOptions(tsConfigPath: string) {
  if (!tsModule) {
    tsModule = require('typescript');
  }
  const readResult = tsModule.readConfigFile(
    tsConfigPath,
    tsModule.sys.readFile
  );
  // we don't need to scan the files, we only care about options
  const host = {
    readDirectory: () => [],
    fileExists: tsModule.sys.fileExists,
  };
  return tsModule.parseJsonConfigFileContent(
    readResult.config,
    host,
    dirname(tsConfigPath)
  ).options;
}

let compilerHost: {
  host: ts.CompilerHost;
  options: ts.CompilerOptions;
  moduleResolutionCache: ts.ModuleResolutionCache;
};

/**
 * Find a module based on it's import
 *
 * @param importExpr Import used to resolve to a module
 * @param filePath
 * @param tsConfigPath
 */
export function resolveModuleByImport(
  importExpr: string,
  filePath: string,
  tsConfigPath: string
) {
  compilerHost = compilerHost || getCompilerHost(tsConfigPath);
  const { options, host, moduleResolutionCache } = compilerHost;

  const { resolvedModule } = tsModule.resolveModuleName(
    importExpr,
    filePath,
    options,
    host,
    moduleResolutionCache
  );

  if (!resolvedModule) {
    return;
  } else {
    return resolvedModule.resolvedFileName.replace(`${normalizedAppRoot}/`, '');
  }
}

function getCompilerHost(tsConfigPath: string) {
  const options = readTsConfigOptions(tsConfigPath);
  const host = tsModule.createCompilerHost(options, true);
  const moduleResolutionCache = tsModule.createModuleResolutionCache(
    appRootPath,
    host.getCanonicalFileName
  );
  return { options, host, moduleResolutionCache };
}

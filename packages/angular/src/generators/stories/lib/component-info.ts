import type { Tree } from '@nrwl/devkit';
import { joinPathFragments, logger } from '@nrwl/devkit';
import { tsquery } from '@phenomnomnominal/tsquery';
import { basename, dirname } from 'path';
import type { SourceFile, Statement } from 'typescript';
import { SyntaxKind } from 'typescript';
import { getTsSourceFile } from '../../../utils/nx-devkit/ast-utils';
import { getModuleDeclaredComponents } from './module-info';
import { getAllFilesRecursivelyFromDir } from './tree-utilities';

export interface ComponentInfo {
  componentFileName: string;
  moduleFolderPath: string;
  name: string;
  path: string;
}

export function getComponentsInfo(
  tree: Tree,
  moduleFilePaths: string[],
  projectName: string
): ComponentInfo[] {
  return moduleFilePaths.flatMap((moduleFilePath) => {
    const file = getTsSourceFile(tree, moduleFilePath);
    const declaredComponents = getModuleDeclaredComponents(
      file,
      moduleFilePath,
      projectName
    );
    if (declaredComponents.length === 0) {
      return undefined;
    }

    const imports = file.statements.filter(
      (statement) => statement.kind === SyntaxKind.ImportDeclaration
    );

    const componentsInfo = declaredComponents.map((componentName) =>
      getComponentInfo(tree, file, imports, moduleFilePath, componentName)
    );

    return componentsInfo;
  });
}

function getComponentImportPath(
  componentName: string,
  imports: Statement[]
): string {
  const componentImportStatement = imports.find((statement) => {
    const namedImports = statement
      .getChildren()
      .find((node) => node.kind === SyntaxKind.ImportClause)
      .getChildren()
      .find((node) => node.kind === SyntaxKind.NamedImports);

    if (namedImports === undefined) return false;

    const importedIdentifiers = namedImports
      .getChildren()
      .find((node) => node.kind === SyntaxKind.SyntaxList)
      .getChildren()
      .filter((node) => node.kind === SyntaxKind.ImportSpecifier)
      .map((node) => node.getText());

    return importedIdentifiers.includes(componentName);
  });

  const importPath = componentImportStatement
    .getChildren()
    .find((node) => node.kind === SyntaxKind.StringLiteral)
    .getText()
    .slice(1, -1);

  return importPath;
}

function getComponentInfo(
  tree: Tree,
  sourceFile: SourceFile,
  imports: Statement[],
  moduleFilePath: string,
  componentName: string
): ComponentInfo {
  try {
    const moduleFolderPath = dirname(moduleFilePath);

    // try to get the component from the same file (inline scam)
    const node = tsquery(
      sourceFile,
      `ClassDeclaration:has(Decorator > CallExpression > Identifier[name=Component]):has(Identifier[name=${componentName}])`,
      { visitAllChildren: true }
    )[0];

    if (node) {
      return {
        componentFileName: basename(moduleFilePath, '.ts'),
        moduleFolderPath,
        name: componentName,
        path: '.',
      };
    }

    // try to get the component from the imports
    const componentFilePathRelativeToModule = getComponentImportPath(
      componentName,
      imports
    );
    const componentImportPath = getFullComponentFilePath(
      moduleFolderPath,
      componentFilePathRelativeToModule
    );

    if (tree.exists(componentImportPath) && !tree.isFile(componentImportPath)) {
      return getComponentInfoFromDir(
        tree,
        componentImportPath,
        componentName,
        moduleFolderPath
      );
    }

    const path = dirname(componentFilePathRelativeToModule);
    const componentFileName = basename(componentFilePathRelativeToModule);

    return { componentFileName, moduleFolderPath, name: componentName, path };
  } catch (ex) {
    logger.warn(
      `Could not generate a story for ${componentName}. Error: ${ex}`
    );
    return undefined;
  }
}

function getComponentInfoFromDir(
  tree: Tree,
  dir: string,
  componentName: string,
  moduleFolderPath: string
): ComponentInfo {
  let path = null;
  let componentFileName = null;
  const componentImportPathChildren = getAllFilesRecursivelyFromDir(tree, dir);
  for (const candidateFile of componentImportPathChildren) {
    if (candidateFile.endsWith('.ts')) {
      const content = tree.read(candidateFile, 'utf-8');
      const classAndComponentRegex = new RegExp(
        `@Component[\\s\\S\n]*?\\bclass ${componentName}\\b`,
        'g'
      );
      if (content.match(classAndComponentRegex)) {
        path = candidateFile
          .slice(0, candidateFile.lastIndexOf('/'))
          .replace(moduleFolderPath, '.');
        componentFileName = candidateFile.slice(
          candidateFile.lastIndexOf('/') + 1,
          candidateFile.lastIndexOf('.')
        );
        break;
      }
    }
  }

  if (path === null) {
    throw new Error(
      `Path to component ${componentName} couldn't be found. Please open an issue on https://github.com/nrwl/nx/issues.`
    );
  }

  return { componentFileName, moduleFolderPath, name: componentName, path };
}

function getFullComponentFilePath(
  moduleFolderPath: string,
  componentFilePath: string
): string {
  if (moduleFolderPath.startsWith('/')) {
    moduleFolderPath = moduleFolderPath.slice(1, moduleFolderPath.length);
  }

  return joinPathFragments(moduleFolderPath, componentFilePath);
}

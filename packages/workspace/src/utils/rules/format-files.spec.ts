import { SchematicTestRunner } from '@angular-devkit/schematics/testing';
import { Tree } from '@angular-devkit/schematics';

import * as prettier from 'prettier';
import * as path from 'path';
import * as taoWorkspace from '@nrwl/tao/src/shared/workspace';

import { formatFiles } from './format-files';
import { appRootPath } from '@nrwl/tao/src/utils/app-root';

describe('formatFiles', () => {
  let tree: Tree;
  let schematicRunner: SchematicTestRunner;

  beforeAll(() => {
    jest
      .spyOn(taoWorkspace, 'workspaceConfigName')
      .mockReturnValue('workspace.json');
  });

  beforeEach(() => {
    schematicRunner = new SchematicTestRunner(
      '@nrwl/workspace',
      path.join(__dirname, '../../../generators.json')
    );
    jest
      .spyOn(prettier, 'format')
      .mockImplementation((input) => `formatted :: ${input}`);
    tree = Tree.empty();

    tree.create(
      'workspace.json',
      `{
      "version": 1,
      "projects": {
        "app1": {
          "projectType": "application",
          "schematics": {},
          "root": "apps/app1",
          "sourceRoot": "apps/app1/src",
          "prefix": "nx",
          "architect": {}
        }
      },
      "cli": {
        "defaultCollection": "@nrwl/angular"
      },
      "defaultProject": "app1"
    }`
    );
  });

  afterEach(() => jest.clearAllMocks());

  it('should format created files', async () => {
    jest.spyOn(prettier, 'resolveConfig').mockReturnValue(
      Promise.resolve({
        printWidth: 80,
      })
    );
    tree.create('a.ts', 'const a=a');
    const result = await schematicRunner
      .callRule(formatFiles(), tree)
      .toPromise();
    expect(prettier.format).toHaveBeenCalledWith('const a=a', {
      printWidth: 80,
      filepath: path.join(appRootPath, 'a.ts'),
    });
    expect(result.read('a.ts').toString()).toEqual('formatted :: const a=a');
  });

  it('should not format deleted files', async () => {
    jest.spyOn(prettier, 'resolveConfig').mockReturnValue(
      Promise.resolve({
        printWidth: 80,
      })
    );
    tree.create('b.ts', '');
    tree.delete('b.ts');
    await schematicRunner.callRule(formatFiles(), tree).toPromise();
    expect(prettier.format).not.toHaveBeenCalledWith(
      'const b=b',
      expect.anything()
    );
  });

  it('should format overwritten files', async () => {
    jest
      .spyOn(prettier, 'resolveConfig')
      .mockReturnValue(Promise.resolve(null));
    tree.create('a.ts', 'const a=a');
    tree.overwrite('a.ts', 'const a=b');
    const result = await schematicRunner
      .callRule(formatFiles(), tree)
      .toPromise();
    expect(prettier.format).toHaveBeenCalledWith('const a=b', {
      filepath: path.join(appRootPath, 'a.ts'),
    });
    expect(result.read('a.ts').toString()).toEqual('formatted :: const a=b');
  });

  it('should not format renamed files', async () => {
    jest
      .spyOn(prettier, 'resolveConfig')
      .mockReturnValue(Promise.resolve(null));
    tree.create('a.ts', 'const a=a');
    tree.rename('a.ts', 'b.ts');
    const result = await schematicRunner
      .callRule(formatFiles(), tree)
      .toPromise();
    expect(prettier.format).toHaveBeenCalledWith('const a=a', {
      filepath: path.join(appRootPath, 'b.ts'),
    });
    expect(result.read('b.ts').toString()).toEqual('formatted :: const a=a');
  });

  it('should have a readable error when workspace file cannot be formatted', async () => {
    tree.overwrite('workspace.json', '{ invalidJson: true');

    const errorSpy = jest.spyOn(console, 'error');

    await schematicRunner.callRule(formatFiles(), tree).toPromise();

    expect(errorSpy).toHaveBeenCalledWith(
      'Failed to format workspace config: workspace.json'
    );
  });

  describe('--skip-format', () => {
    it('should not format created files', async () => {
      jest.spyOn(prettier, 'resolveConfig').mockReturnValue(
        Promise.resolve({
          printWidth: 80,
        })
      );
      tree.create('a.ts', 'const a=a');
      const result = await schematicRunner
        .callRule(
          formatFiles({
            skipFormat: true,
          }),
          tree
        )
        .toPromise();
      expect(prettier.format).not.toHaveBeenCalledWith('const a=a', {
        printWidth: 80,
        filepath: `${appRootPath}/a.ts`,
      });
      expect(result.read('a.ts').toString()).toEqual('const a=a');
    });
  });
});

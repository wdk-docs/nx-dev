import {
  addDependenciesToPackageJson,
  NxJsonConfiguration,
  readJson,
  Tree,
} from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';

import { nxVersion } from '../../utils/versions';

import webInitGenerator from './init';

describe('init', () => {
  let tree: Tree;

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });

  it('should add web dependencies', async () => {
    const existing = 'existing';
    const existingVersion = '1.0.0';
    addDependenciesToPackageJson(
      tree,
      {
        '@nrwl/web': nxVersion,
        [existing]: existingVersion,
      },
      {
        [existing]: existingVersion,
      }
    );
    await webInitGenerator(tree, {});
    const packageJson = readJson(tree, 'package.json');
    expect(packageJson.devDependencies['@nrwl/web']).toBeDefined();
    expect(packageJson.devDependencies[existing]).toBeDefined();
    expect(packageJson.dependencies['@nrwl/web']).toBeUndefined();
    expect(packageJson.dependencies[existing]).toBeDefined();
  });

  describe('defaultCollection', () => {
    it('should be set if none was set before', async () => {
      await webInitGenerator(tree, {});
      const { cli } = readJson<NxJsonConfiguration>(tree, 'nx.json');
      expect(cli.defaultCollection).toEqual('@nrwl/web');
    });
  });

  it('should not add jest config if unitTestRunner is none', async () => {
    await webInitGenerator(tree, {
      unitTestRunner: 'none',
    });
    expect(tree.exists('jest.config.js')).toBe(false);
  });

  describe('babel config', () => {
    it('should create babel config if not present', async () => {
      await webInitGenerator(tree, {
        unitTestRunner: 'none',
      });
      expect(tree.exists('babel.config.json')).toBe(true);
    });

    it('should not overwrite existing babel config', async () => {
      tree.write('babel.config.json', '{ "preset": ["preset-awesome"] }');

      await webInitGenerator(tree, {
        unitTestRunner: 'none',
      });

      const existing = readJson(tree, 'babel.config.json');
      expect(existing).toEqual({ preset: ['preset-awesome'] });
    });

    it('should not overwrite existing babel config (.js)', async () => {
      tree.write('/babel.config.js', 'module.exports = () => {};');
      await webInitGenerator(tree, {
        unitTestRunner: 'none',
      });
      expect(tree.exists('babel.config.json')).toBe(false);
    });
  });
});

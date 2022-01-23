import {
  buildWorkspaceConfigurationFromGlobs,
  inlineProjectConfigurations,
  toProjectName,
} from './workspace';
import { readJsonFile } from '../utils/fileutils';
import { NxJsonConfiguration } from './nx';

jest.mock('../utils/fileutils');
jest.mock('fast-glob', () => ({
  sync: () => [
    'libs/lib1/package.json',
    'libs/lib1/project.json',
    'libs/lib2/package.json',
    'libs/domain/lib3/package.json',
    'libs/domain/lib4/project.json',
    'libs/domain/lib4/package.json',
  ],
}));

const libConfig = (name) => ({
  root: `libs/${name}`,
  sourceRoot: `libs/${name}/src`,
});

const packageLibConfig = (root) => ({
  root,
  sourceRoot: root,
});

describe('workspace', () => {
  it('should be able to inline project configurations', () => {
    const standaloneConfig = libConfig('lib1');

    (readJsonFile as jest.Mock).mockImplementation((path: string) => {
      if (path.endsWith('libs/lib1/project.json')) {
        return standaloneConfig;
      }
      throw `${path} not in mock!`;
    });

    const inlineConfig = {
      version: 1,
      projects: {
        lib1: 'libs/lib1',
        lib2: libConfig('lib2'),
      },
    };

    const resolved = inlineProjectConfigurations(inlineConfig);
    expect(resolved).toEqual({
      ...inlineConfig,
      projects: {
        ...inlineConfig.projects,
        lib1: { ...standaloneConfig },
      },
    });
  });

  it('should build project configurations from glob', () => {
    const lib1Config = libConfig('lib1');
    const lib2Config = packageLibConfig('libs/lib2');
    const domainPackageConfig = packageLibConfig('libs/domain/lib3');
    const domainLibConfig = libConfig('domain/lib4');

    (readJsonFile as jest.Mock).mockImplementation((path: string) => {
      if (path.endsWith('libs/lib1/project.json')) {
        return lib1Config;
      }
      if (path.endsWith('libs/lib1/package.json')) {
        return { name: 'some-other-name' };
      }
      if (path.endsWith('libs/lib2/package.json')) {
        return { name: 'lib2' };
      }
      if (path.endsWith('libs/domain/lib3/package.json')) {
        return { name: 'domain-lib3' };
      }
      if (path.endsWith('libs/domain/lib4/project.json')) {
        return domainLibConfig;
      }
      if (path.endsWith('libs/domain/lib4/package.json')) {
        return {};
      }
      throw `${path} not in mock!`;
    });

    const resolved = buildWorkspaceConfigurationFromGlobs({ npmScope: '' });
    expect(resolved).toEqual({
      version: 2,
      projects: {
        lib1: lib1Config,
        lib2: lib2Config,
        'domain-lib3': domainPackageConfig,
        'domain-lib4': domainLibConfig,
      },
    });
  });

  describe('to project name', () => {
    it('should trim default directories from beginning', () => {
      const appResults = toProjectName(
        'apps/directory/my-app/project.json',
        null
      );
      const libResults = toProjectName(
        'libs/directory/my-lib/project.json',
        null
      );
      expect(appResults).toEqual('directory-my-app');
      expect(libResults).toEqual('directory-my-lib');
    });

    it('should custom directories from beginning', () => {
      const nxJson: NxJsonConfiguration = {
        npmScope: '',
        workspaceLayout: {
          appsDir: 'my-apps',
          libsDir: 'packages',
        },
      };
      const appResults = toProjectName(
        'my-apps/directory/my-app/project.json',
        nxJson
      );
      const libResults = toProjectName(
        'packages/directory/my-lib/project.json',
        nxJson
      );
      expect(appResults).toEqual('directory-my-app');
      expect(libResults).toEqual('directory-my-lib');
    });

    it('should lowercase names', () => {
      const nxJson: NxJsonConfiguration = {
        npmScope: '',
        workspaceLayout: {
          appsDir: 'my-apps',
          libsDir: 'packages',
        },
      };
      const appResults = toProjectName(
        'my-apps/directory/my-app/package.json',
        nxJson
      );
      const libResults = toProjectName(
        'packages/directory/MyLib/package.json',
        nxJson
      );
      expect(appResults).toEqual('directory-my-app');
      expect(libResults).toEqual('directory-mylib');
    });
  });
});

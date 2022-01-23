import {
  addProjectConfiguration,
  joinPathFragments,
  readJson,
  readProjectConfiguration,
  Tree,
  writeJson,
} from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { exampleRootTslintJson } from '@nrwl/linter';
import { conversionGenerator } from './convert-tslint-to-eslint';

/**
 * Don't run actual child_process implementation of installPackagesTask()
 */
jest.mock('child_process');

const appProjectName = 'nest-app-1';
const appProjectRoot = `apps/${appProjectName}`;
const appProjectTSLintJsonPath = joinPathFragments(
  appProjectRoot,
  'tslint.json'
);
const libProjectName = 'nest-lib-1';
const libProjectRoot = `libs/${libProjectName}`;
const libProjectTSLintJsonPath = joinPathFragments(
  libProjectRoot,
  'tslint.json'
);
// Used to configure the test Tree and stub the response from tslint-to-eslint-config util findReportedConfiguration()
const projectTslintJsonData = {
  raw: {
    extends: '../../tslint.json',
    rules: {
      // User custom TS rule
      'no-empty-interface': true,
      // User custom rule with no known automated converter
      'some-super-custom-rule-with-no-converter': true,
    },
    linterOptions: {
      exclude: ['!**/*'],
    },
  },
  tslintPrintConfigResult: {
    rules: {
      'no-empty-interface': {
        ruleArguments: [],
        ruleSeverity: 'error',
      },
      'some-super-custom-rule-with-no-converter': {
        ruleArguments: [],
        ruleSeverity: 'error',
      },
    },
  },
};

function mockFindReportedConfiguration(_, pathToTslintJson) {
  switch (pathToTslintJson) {
    case 'tslint.json':
      return exampleRootTslintJson.tslintPrintConfigResult;
    case appProjectTSLintJsonPath:
      return projectTslintJsonData.tslintPrintConfigResult;
    case libProjectTSLintJsonPath:
      return projectTslintJsonData.tslintPrintConfigResult;
    default:
      throw new Error(
        `mockFindReportedConfiguration - Did not recognize path ${pathToTslintJson}`
      );
  }
}

/**
 * See ./mock-tslint-to-eslint-config.ts for why this is needed
 */
jest.mock('tslint-to-eslint-config', () => {
  return {
    // Since upgrading to (ts-)jest 26 this usage of this mock has caused issues...
    // @ts-ignore
    ...jest.requireActual<any>('tslint-to-eslint-config'),
    findReportedConfiguration: jest.fn(mockFindReportedConfiguration),
  };
});

/**
 * Mock the the mutating fs utilities used within the conversion logic, they are not
 * needed because of our stubbed response for findReportedConfiguration() above, and
 * they would cause noise in the git data of the actual Nx repo when the tests run.
 */
jest.mock('fs', () => {
  return {
    // Since upgrading to (ts-)jest 26 this usage of this mock has caused issues...
    // @ts-ignore
    ...jest.requireActual<any>('fs'),
    writeFileSync: jest.fn(),
    mkdirSync: jest.fn(),
  };
});

describe('convert-tslint-to-eslint', () => {
  let host: Tree;

  beforeEach(async () => {
    host = createTreeWithEmptyWorkspace();

    writeJson(host, 'tslint.json', exampleRootTslintJson.raw);

    addProjectConfiguration(host, appProjectName, {
      root: appProjectRoot,
      projectType: 'application',
      targets: {
        /**
         * LINT TARGET CONFIG - BEFORE CONVERSION
         *
         * TSLint executor configured for the project
         */
        lint: {
          executor: '@angular-devkit/build-angular:tslint',
          options: {
            exclude: ['**/node_modules/**', '!apps/nest-app-1/**/*'],
            tsConfig: ['apps/nest-app-1/tsconfig.app.json'],
          },
        },
      },
    });

    addProjectConfiguration(host, libProjectName, {
      root: libProjectRoot,
      projectType: 'library',
      targets: {
        /**
         * LINT TARGET CONFIG - BEFORE CONVERSION
         *
         * TSLint executor configured for the project
         */
        lint: {
          executor: '@angular-devkit/build-angular:tslint',
          options: {
            exclude: ['**/node_modules/**', '!libs/nest-lib-1/**/*'],
            tsConfig: ['libs/nest-lib-1/tsconfig.app.json'],
          },
        },
      },
    });

    /**
     * Existing tslint.json file for the app project
     */
    writeJson(host, 'apps/nest-app-1/tslint.json', projectTslintJsonData.raw);
    /**
     * Existing tslint.json file for the lib project
     */
    writeJson(host, 'libs/nest-lib-1/tslint.json', projectTslintJsonData.raw);
  });

  it('should work for NestJS applications', async () => {
    await conversionGenerator(host, {
      project: appProjectName,
      ignoreExistingTslintConfig: false,
      removeTSLintIfNoMoreTSLintTargets: false,
    });

    /**
     * It should ensure the required Nx packages are installed and available
     *
     * NOTE: tslint-to-eslint-config should NOT be present
     */
    expect(readJson(host, 'package.json')).toMatchSnapshot();

    /**
     * LINT TARGET CONFIG - AFTER CONVERSION
     *
     * It should replace the TSLint executor with the ESLint one
     */
    expect(readProjectConfiguration(host, appProjectName)).toMatchSnapshot();

    /**
     * The root level .eslintrc.json should now have been generated
     */
    expect(readJson(host, '.eslintrc.json')).toMatchSnapshot();

    /**
     * The project level .eslintrc.json should now have been generated
     * and extend from the root, as well as applying any customizations
     * which are specific to this projectType.
     */
    expect(
      readJson(host, joinPathFragments(appProjectRoot, '.eslintrc.json'))
    ).toMatchSnapshot();

    /**
     * The project's TSLint file should have been deleted
     */
    expect(host.exists(appProjectTSLintJsonPath)).toEqual(false);
  });

  it('should work for NestJS libraries', async () => {
    await conversionGenerator(host, {
      project: libProjectName,
      ignoreExistingTslintConfig: false,
      removeTSLintIfNoMoreTSLintTargets: false,
    });

    /**
     * It should ensure the required Nx packages are installed and available
     *
     * NOTE: tslint-to-eslint-config should NOT be present
     */
    expect(readJson(host, 'package.json')).toMatchSnapshot();

    /**
     * LINT TARGET CONFIG - AFTER CONVERSION
     *
     * It should replace the TSLint executor with the ESLint one
     */
    expect(readProjectConfiguration(host, libProjectName)).toMatchSnapshot();

    /**
     * The root level .eslintrc.json should now have been generated
     */
    expect(readJson(host, '.eslintrc.json')).toMatchSnapshot();

    /**
     * The project level .eslintrc.json should now have been generated
     * and extend from the root, as well as applying any customizations
     * which are specific to this projectType.
     */
    expect(
      readJson(host, joinPathFragments(libProjectRoot, '.eslintrc.json'))
    ).toMatchSnapshot();

    /**
     * The project's TSLint file should have been deleted
     */
    expect(host.exists(libProjectTSLintJsonPath)).toEqual(false);
  });
});

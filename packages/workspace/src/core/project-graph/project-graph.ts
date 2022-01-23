import { ProjectGraph, stripIndents } from '@nrwl/devkit';
import { ProjectGraphCache, readCache } from '../nx-deps/nx-deps-cache';
import { buildProjectGraph } from './build-project-graph';
import { readNxJson, workspaceFileName } from '../file-utils';
import { output } from '../../utilities/output';
import { isCI } from '../../utilities/is_ci';
import { defaultFileHasher } from '../hasher/file-hasher';
import {
  isDaemonDisabled,
  markDaemonAsDisabled,
} from '@nrwl/workspace/src/core/project-graph/daemon/tmp-dir';

/**
 * Synchronously reads the latest cached copy of the workspace's ProjectGraph.
 * @throws {Error} if there is no cached ProjectGraph to read from
 */
export function readCachedProjectGraph(
  projectGraphVersion = '5.0'
): ProjectGraph {
  const projectGraphCache: ProjectGraphCache | false = readCache();
  const angularSpecificError =
    workspaceFileName() === 'angular.json'
      ? stripIndents`
      Make sure invoke 'node ./decorate-angular-cli.js' in your postinstall script.
      The decorated CLI will compute the project graph.
      'ng --help' should say 'Smart, Fast and Extensible Build System'.
      `
      : '';
  if (!projectGraphCache) {
    throw new Error(stripIndents`
      [readCachedProjectGraph] ERROR: No cached ProjectGraph is available.

      If you are leveraging \`readCachedProjectGraph()\` directly then you will need to refactor your usage to first ensure that
      the ProjectGraph is created by calling \`await createProjectGraphAsync()\` somewhere before attempting to read the data.

      If you encounter this error as part of running standard \`nx\` commands then please open an issue on https://github.com/nrwl/nx

      ${angularSpecificError}
    `);
  }
  const projectGraph = {
    version: projectGraphCache.version,
    nodes: projectGraphCache.nodes,
    externalNodes: projectGraphCache.externalNodes,
    dependencies: projectGraphCache.dependencies,
  };

  return projectGraphAdapter(
    projectGraph.version,
    projectGraphVersion,
    projectGraph
  );
}

async function buildProjectGraphWithoutDaemon(projectGraphVersion: string) {
  try {
    await defaultFileHasher.ensureInitialized();
    return projectGraphAdapter(
      '5.0',
      projectGraphVersion,
      await buildProjectGraph()
    );
  } catch (e) {
    printErrorMessage(e);
    process.exit(1);
  }
}

export async function createProjectGraphAsync(
  projectGraphVersion = '5.0'
): Promise<ProjectGraph> {
  const nxJson = readNxJson();
  const useDaemonProcessOption =
    nxJson.tasksRunnerOptions?.['default']?.options?.useDaemonProcess;
  const env = process.env.NX_DAEMON;

  // env takes precendence
  // option=undefined,env=undefined => no daemon
  // option=true,env=false => no daemon
  // option=false,env=undefined => no daemon
  // option=false,env=false => no daemon
  // option=true,env=undefined,ci => no daemon

  // option=true,env=undefined,!ci => daemon
  // option=true,env=true => daemon
  // option=false,env=true => daemon
  if (
    isDaemonDisabled() ||
    (useDaemonProcessOption === undefined && env === undefined) ||
    (useDaemonProcessOption === true && env === 'false') ||
    (useDaemonProcessOption === false && env === undefined) ||
    (useDaemonProcessOption === false && env === 'false') ||
    (useDaemonProcessOption === true && env === undefined && isCI())
  ) {
    return await buildProjectGraphWithoutDaemon(projectGraphVersion);
  } else {
    try {
      const daemonClient = require('./daemon/client/client');
      if (!(await daemonClient.isServerAvailable())) {
        await daemonClient.startInBackground();
      }
      return projectGraphAdapter(
        '5.0',
        projectGraphVersion,
        await daemonClient.getProjectGraphFromServer()
      );
    } catch (e) {
      // common errors with the daemon due to OS settings (cannot watch all the files available)
      if (e.message.indexOf('inotify_add_watch') > -1) {
        // https://askubuntu.com/questions/1088272/inotify-add-watch-failed-no-space-left-on-device
        output.warn({
          title: `Unable to start Nx Daemon due to the limited amount of inotify watches, continuing without the daemon. Nx Daemon is going to be disabled until you run "nx reset".`,
          bodyLines: [
            'For more information read: https://askubuntu.com/questions/1088272/inotify-add-watch-failed-no-space-left-on-device',
          ],
        });
        markDaemonAsDisabled();
        return buildProjectGraphWithoutDaemon(projectGraphVersion);
      } else {
        printErrorMessage(e);
        process.exit(1);
      }
    }
  }
}

function printErrorMessage(e: any) {
  const lines = e.message.split('\n');
  output.error({
    title: lines[0],
    bodyLines: lines.slice(1),
  });
}

/**
 * Backwards compatibility adapter for project graph
 * @param {string} sourceVersion
 * @param {string} targetVersion
 * @param projectGraph
 * @param {ProjectGraph} projectGraph
 * @returns {ProjectGraph}
 */
export function projectGraphAdapter(
  sourceVersion: string,
  targetVersion: string,
  projectGraph: ProjectGraph
): ProjectGraph {
  if (sourceVersion === targetVersion) {
    return projectGraph;
  }
  if (sourceVersion === '5.0' && targetVersion === '4.0') {
    return projectGraphCompat5to4(projectGraph);
  }
  throw new Error(
    `Invalid source or target versions. Source: ${sourceVersion}, Target: ${targetVersion}.

Only backwards compatibility between "5.0" and "4.0" is supported.
This error can be caused by "@nrwl/..." packages getting out of sync or outdated project graph cache.
Check the versions running "nx report" and/or remove your "nxdeps.json" file (in node_modules/.cache/nx folder).
    `
  );
}

/**
 * Backwards compatibility adapter for project Nodes v4 to v5
 * @param {ProjectGraph} projectGraph
 * @returns {ProjectGraph}
 */
function projectGraphCompat5to4(projectGraph: ProjectGraph): ProjectGraph {
  const { externalNodes, ...rest } = projectGraph;
  return {
    ...rest,
    nodes: {
      ...projectGraph.nodes,
      ...externalNodes,
    },
    dependencies: {
      ...projectGraph.dependencies,
      ...Object.keys(externalNodes).reduce(
        (acc, key) => ({ ...acc, [`npm:${key}`]: [] }),
        {}
      ),
    },
    version: '4.0',
  };
}

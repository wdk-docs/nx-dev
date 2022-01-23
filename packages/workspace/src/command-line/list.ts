import { appRootPath } from '@nrwl/tao/src/utils/app-root';
import { output } from '../utilities/output';
import {
  fetchCommunityPlugins,
  fetchCorePlugins,
  getInstalledPluginsFromPackageJson,
  listCommunityPlugins,
  listCorePlugins,
  listInstalledPlugins,
  listPluginCapabilities,
} from '../utilities/plugins';

export interface ListArgs {
  /** The name of an installed plugin to query  */
  plugin?: string | undefined;
}

/**
 * List available plugins or capabilities within a specific plugin
 *
 * @remarks
 *
 * Must be run within an Nx workspace
 *
 */
export async function listHandler(args: ListArgs): Promise<void> {
  if (args.plugin) {
    listPluginCapabilities(args.plugin);
  } else {
    const corePlugins = fetchCorePlugins();
    const communityPlugins = await fetchCommunityPlugins().catch(() => {
      output.warn({
        title: `Community plugins:`,
        bodyLines: [`Error fetching plugins.`],
      });

      return [];
    });

    const installedPlugins = getInstalledPluginsFromPackageJson(
      appRootPath,
      corePlugins,
      communityPlugins
    );
    listInstalledPlugins(installedPlugins);
    listCorePlugins(installedPlugins, corePlugins);
    listCommunityPlugins(installedPlugins, communityPlugins);

    output.note({
      title: `Use "nx list [plugin]" to find out more`,
    });
  }
}

import { addDependenciesToPackageJson, Tree } from '@nrwl/devkit';
import { swcCliVersion, swcCoreVersion, swcHelpersVersion } from '../versions';

export function addSwcDependencies(tree: Tree) {
  addDependenciesToPackageJson(
    tree,
    {},
    {
      '@swc/core': swcCoreVersion,
      '@swc/helpers': swcHelpersVersion,
      '@swc/cli': swcCliVersion,
    }
  );
}

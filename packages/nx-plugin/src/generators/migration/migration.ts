import {
  readProjectConfiguration,
  names,
  convertNxGenerator,
  generateFiles,
  updateProjectConfiguration,
  updateJson,
  readJson,
  writeJson,
} from '@nrwl/devkit';
import type { Tree } from '@nrwl/devkit';
import type { Schema } from './schema';
import * as path from 'path';

interface NormalizedSchema extends Schema {
  projectRoot: string;
  projectSourceRoot: string;
}

function normalizeOptions(host: Tree, options: Schema): NormalizedSchema {
  let name: string;
  if (options.name) {
    name = names(options.name).fileName;
  } else {
    name = names(`update-${options.version}`).fileName;
  }

  const description: string = options.description ?? name;

  const { root: projectRoot, sourceRoot: projectSourceRoot } =
    readProjectConfiguration(host, options.project);

  const normalized: NormalizedSchema = {
    ...options,
    name,
    description,
    projectRoot,
    projectSourceRoot,
  };

  return normalized;
}

function addFiles(host: Tree, options: NormalizedSchema) {
  generateFiles(
    host,
    path.join(__dirname, 'files/migration'),
    `${options.projectSourceRoot}/migrations`,
    { ...options, tmpl: '' }
  );
}

function updateMigrationsJson(host: Tree, options: NormalizedSchema) {
  const migrationsPath = path.join(options.projectRoot, 'migrations.json');
  const migrations = host.exists(migrationsPath)
    ? readJson(host, migrationsPath)
    : {};

  if (migrations.schematics) {
    migrations.generators = migrations.schematics;
    delete migrations.schematics;
  }

  const generators = migrations.generators ?? {};
  generators[options.name] = {
    version: options.version,
    description: options.description,
    cli: 'nx',
    implementation: `./src/migrations/${options.name}/${options.name}`,
  };
  migrations.generators = generators;

  if (options.packageJsonUpdates) {
    const packageJsonUpdatesObj = migrations.packageJsonUpdates ?? {};
    if (!packageJsonUpdatesObj[options.version]) {
      packageJsonUpdatesObj[options.version] = {
        version: options.version,
        packages: {},
      };
    }
    migrations.packageJsonUpdates = packageJsonUpdatesObj;
  }

  writeJson(host, migrationsPath, migrations);
}

function updatePackageJson(host: Tree, options: NormalizedSchema) {
  updateJson(host, path.join(options.projectRoot, 'package.json'), (json) => {
    if (!json['nx-migrations'] || !json['nx-migrations'].migrations) {
      if (json['nx-migrations']) {
        json['nx-migrations'].migrations = './migrations.json';
      } else {
        json['nx-migrations'] = {
          migrations: './migrations.json',
        };
      }
    }

    return json;
  });
}

function updateWorkspaceJson(host: Tree, options: NormalizedSchema) {
  const project = readProjectConfiguration(host, options.project);

  const assets = project.targets.build?.options?.assets;
  if (
    assets &&
    (assets as any[]).filter((a) => a.glob === 'migrations.json').length === 0
  ) {
    project.targets.build.options.assets = [
      ...assets,
      {
        input: `./${options.projectRoot}`,
        glob: 'migrations.json',
        output: '.',
      },
    ];
    updateProjectConfiguration(host, options.project, project);
  }
}

export async function migrationGenerator(host: Tree, schema: Schema) {
  const options = normalizeOptions(host, schema);

  addFiles(host, options);
  updateMigrationsJson(host, options);
  updateWorkspaceJson(host, options);
  updateMigrationsJson(host, options);
  updatePackageJson(host, options);
}

export default migrationGenerator;
export const migrationSchematic = convertNxGenerator(migrationGenerator);

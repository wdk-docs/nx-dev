import {
  readProjectConfiguration,
  names,
  convertNxGenerator,
  generateFiles,
  updateJson,
  getWorkspaceLayout,
} from '@nrwl/devkit';
import type { Tree } from '@nrwl/devkit';
import type { Schema } from './schema';
import * as path from 'path';

interface NormalizedSchema extends Schema {
  fileName: string;
  className: string;
  projectRoot: string;
  projectSourceRoot: string;
  npmScope: string;
  npmPackageName: string;
}

function normalizeOptions(host: Tree, options: Schema): NormalizedSchema {
  const { npmScope } = getWorkspaceLayout(host);
  const { fileName, className } = names(options.name);

  const { root: projectRoot, sourceRoot: projectSourceRoot } =
    readProjectConfiguration(host, options.project);

  const npmPackageName = `@${npmScope}/${options.project}`;

  let description: string;
  if (options.description) {
    description = options.description;
  } else {
    description = `${options.name} generator`;
  }

  return {
    ...options,
    fileName,
    className,
    description,
    projectRoot,
    projectSourceRoot,
    npmScope,
    npmPackageName,
  };
}

function addFiles(host: Tree, options: NormalizedSchema) {
  const indexPath = `${options.projectSourceRoot}/generators/${options.fileName}/files/src/index.ts__template__`;

  if (!host.exists(indexPath)) {
    host.write(indexPath, 'const variable = "<%= projectName %>";');
  }

  generateFiles(
    host,
    path.join(__dirname, './files/generator'),
    `${options.projectSourceRoot}/generators`,
    {
      ...options,
      tmpl: '',
    }
  );

  if (options.unitTestRunner === 'none') {
    host.delete(
      path.join(
        options.projectSourceRoot,
        'generators',
        options.fileName,
        `generator.spec.ts`
      )
    );
  }
}

function updateGeneratorJson(host: Tree, options: NormalizedSchema) {
  let generatorPath: string;
  if (host.exists(path.join(options.projectRoot, 'generators.json'))) {
    generatorPath = path.join(options.projectRoot, 'generators.json');
  } else {
    generatorPath = path.join(options.projectRoot, 'collection.json');
  }

  return updateJson(host, generatorPath, (json) => {
    let generators = json.generators ?? json.schematics;
    generators = generators || {};
    generators[options.name] = {
      factory: `./src/generators/${options.name}/generator`,
      schema: `./src/generators/${options.name}/schema.json`,
      description: options.description,
    };
    json.generators = generators;

    return json;
  });
}

export async function generatorGenerator(host: Tree, schema: Schema) {
  const options = normalizeOptions(host, schema);

  addFiles(host, options);

  updateGeneratorJson(host, options);
}

export default generatorGenerator;
export const generatorSchematic = convertNxGenerator(generatorGenerator);

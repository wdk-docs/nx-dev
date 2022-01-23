import { logger } from '@nrwl/devkit';
import { Configuration as WebpackDevServerConfiguration } from 'webpack-dev-server';
import * as path from 'path';
import { basename, resolve } from 'path';

import { getWebConfig } from './web.config';
import { WebWebpackExecutorOptions } from '../executors/webpack/webpack.impl';
import { WebDevServerOptions } from '../executors/dev-server/dev-server.impl';
import { buildServePath } from './serve-path';
import { OptimizationOptions } from './shared-models';
import { readFileSync } from 'fs-extra';
import { IndexHtmlWebpackPlugin } from './/webpack/plugins/index-html-webpack-plugin';
import { generateEntryPoints } from './webpack/package-chunk-sort';

export function getDevServerConfig(
  workspaceRoot: string,
  projectRoot: string,
  sourceRoot: string,
  buildOptions: WebWebpackExecutorOptions,
  serveOptions: WebDevServerOptions
): Partial<WebpackDevServerConfiguration> {
  const webpackConfig = getWebConfig(
    workspaceRoot,
    projectRoot,
    sourceRoot,
    buildOptions,
    true, // Don't need to support legacy browsers for dev.
    false
  );

  (webpackConfig as any).devServer = getDevServerPartial(
    workspaceRoot,
    serveOptions,
    buildOptions
  );

  const {
    deployUrl,
    subresourceIntegrity,
    scripts = [],
    styles = [],
    index,
    baseHref,
  } = buildOptions;

  webpackConfig.plugins.push(
    new IndexHtmlWebpackPlugin({
      indexPath: resolve(workspaceRoot, index),
      outputPath: basename(index),
      baseHref,
      entrypoints: generateEntryPoints({ scripts, styles }),
      deployUrl,
      sri: subresourceIntegrity,
      moduleEntrypoints: [],
      noModuleEntrypoints: ['polyfills-es5'],
    })
  );

  return webpackConfig;
}

function getDevServerPartial(
  root: string,
  options: WebDevServerOptions,
  buildOptions: WebWebpackExecutorOptions
): WebpackDevServerConfiguration {
  const servePath = buildServePath(buildOptions);

  const { scripts: scriptsOptimization, styles: stylesOptimization } =
    buildOptions.optimization as OptimizationOptions;

  const config: WebpackDevServerConfiguration = {
    host: options.host,
    port: options.port,
    headers: { 'Access-Control-Allow-Origin': '*' },
    historyApiFallback: {
      index: `${servePath}${path.basename(buildOptions.index)}`,
      disableDotRule: true,
      htmlAcceptHeaders: ['text/html', 'application/xhtml+xml'],
    },
    onListening(server: any) {
      logger.info(
        `NX Web Development Server is listening at ${
          server.options.https ? 'https' : 'http'
        }://${server.options.host}:${server.options.port}${buildServePath(
          buildOptions
        )}`
      );
    },
    open: options.open,
    static: false,
    compress: scriptsOptimization || stylesOptimization,
    https: options.ssl,
    devMiddleware: {
      publicPath: servePath,
      stats: false,
    },
    client: {
      webSocketURL: options.publicHost,
      overlay: {
        errors: !(scriptsOptimization || stylesOptimization),
        warnings: false,
      },
    },
    liveReload: options.hmr ? false : options.liveReload, // disable liveReload if hmr is enabled
    hot: options.hmr,
  };

  if (options.ssl && options.sslKey && options.sslCert) {
    config.https = getSslConfig(root, options);
  }

  if (options.proxyConfig) {
    config.proxy = getProxyConfig(root, options);
  }

  if (options.allowedHosts) {
    config.allowedHosts = options.allowedHosts.split(',');
  }

  return config;
}

function getSslConfig(root: string, options: WebDevServerOptions) {
  return {
    key: readFileSync(path.resolve(root, options.sslKey), 'utf-8'),
    cert: readFileSync(path.resolve(root, options.sslCert), 'utf-8'),
  };
}

function getProxyConfig(root: string, options: WebDevServerOptions) {
  const proxyPath = path.resolve(root, options.proxyConfig as string);
  return require(proxyPath);
}

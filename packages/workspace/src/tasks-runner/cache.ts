import { appRootPath } from '@nrwl/tao/src/utils/app-root';
import { Task } from '@nrwl/devkit';
import { exists, lstat, readdir } from 'fs';
import {
  copy,
  ensureDir,
  ensureDirSync,
  mkdir,
  readFile,
  remove,
  unlink,
  writeFile,
} from 'fs-extra';
import { dirname, join, resolve, sep } from 'path';
import { DefaultTasksRunnerOptions } from './default-tasks-runner';
import { spawn, exec } from 'child_process';
import { cacheDir } from '../utilities/cache-directory';

const util = require('util');

const readFileAsync = util.promisify(readFile);
const existsAsync = util.promisify(exists);
const lstatAsync = util.promisify(lstat);
const readdirAsync = util.promisify(readdir);

export type CachedResult = {
  terminalOutput: string;
  outputsPath: string;
  code: number;
  remote: boolean;
};
export type TaskWithCachedResult = { task: Task; cachedResult: CachedResult };

export class Cache {
  root = appRootPath;
  cachePath = this.createCacheDir();
  terminalOutputsDir = this.createTerminalOutputsDir();
  latestOutputsHashesDir = this.ensureLatestOutputsHashesDir();
  useFsExtraToCopyAndRemove = false;

  constructor(private readonly options: DefaultTasksRunnerOptions) {}

  removeOldCacheRecords() {
    /**
     * Even though spawning a process is fast, we don't want to do it every time
     * the user runs a command. Instead, we want to do it once in a while.
     */
    const shouldSpawnProcess = Math.floor(Math.random() * 50) === 1;
    if (shouldSpawnProcess) {
      const scriptPath = require.resolve(
        '@nrwl/workspace/src/tasks-runner/remove-old-cache-records.js',
        { paths: [this.root] }
      );

      try {
        const p = spawn('node', [scriptPath, `"${this.cachePath}"`], {
          stdio: 'ignore',
          detached: true,
        });
        p.unref();
      } catch (e) {
        console.log(`Unable to start remove-old-cache-records script:`);
        console.log(e.message);
      }
    }
  }

  async get(task: Task): Promise<CachedResult | null> {
    const res = await this.getFromLocalDir(task);

    if (res) {
      return { ...res, remote: false };
    } else if (this.options.remoteCache) {
      // didn't find it locally but we have a remote cache
      // attempt remote cache
      await this.options.remoteCache.retrieve(task.hash, this.cachePath);
      // try again from local cache
      const res2 = await this.getFromLocalDir(task);
      return res2 ? { ...res2, remote: true } : null;
    } else {
      return null;
    }
  }

  async put(
    task: Task,
    terminalOutput: string | null,
    outputs: string[],
    code: number
  ) {
    return this.tryAndRetry(async () => {
      const td = join(this.cachePath, task.hash);
      const tdCommit = join(this.cachePath, `${task.hash}.commit`);

      // might be left overs from partially-completed cache invocations
      await remove(tdCommit);
      await this.remove(td);

      await mkdir(td);
      await writeFile(
        join(td, 'terminalOutput'),
        terminalOutput ?? 'no terminal output'
      );

      await mkdir(join(td, 'outputs'));
      await Promise.all(
        outputs.map(async (f) => {
          const src = join(this.root, f);
          if (await existsAsync(src)) {
            const cached = join(td, 'outputs', f);
            const directory = resolve(cached, '..');
            await ensureDir(directory);
            await this.copy(src, directory);
          }
        })
      );
      // we need this file to account for partial writes to the cache folder.
      // creating this file is atomic, whereas creating a folder is not.
      // so if the process gets terminated while we are copying stuff into cache,
      // the cache entry won't be used.
      await writeFile(join(td, 'code'), code.toString());
      await writeFile(tdCommit, 'true');

      if (this.options.remoteCache) {
        await this.options.remoteCache.store(task.hash, this.cachePath);
      }

      await this.recordOutputsHash(outputs, task.hash);

      if (terminalOutput) {
        const outputPath = this.temporaryOutputPath(task);
        await writeFile(outputPath, terminalOutput);
      }
    });
  }

  async copyFilesFromCache(
    hash: string,
    cachedResult: CachedResult,
    outputs: string[]
  ) {
    return this.tryAndRetry(async () => {
      await this.removeRecordedOutputsHashes(outputs);
      await Promise.all(
        outputs.map(async (f) => {
          const cached = join(cachedResult.outputsPath, f);
          if (await existsAsync(cached)) {
            const src = join(this.root, f);
            await this.remove(src);
            const directory = resolve(src, '..');
            await ensureDir(directory);
            await this.copy(cached, directory);
          }
        })
      );
      await this.recordOutputsHash(outputs, hash);
    });
  }

  temporaryOutputPath(task: Task) {
    return join(this.terminalOutputsDir, task.hash);
  }

  async removeRecordedOutputsHashes(outputs: string[]): Promise<void> {
    for (const output of outputs) {
      const hashFile = this.getFileNameWithLatestRecordedHashForOutput(output);
      try {
        await unlink(hashFile);
      } catch (e) {}
    }
  }

  async shouldCopyOutputsFromCache(
    taskWithCachedResult: TaskWithCachedResult,
    outputs: string[]
  ): Promise<boolean> {
    return (
      (await this.areLatestOutputsHashesDifferentThanTaskHash(
        outputs,
        taskWithCachedResult.task.hash
      )) ||
      (await this.isAnyOutputMissing(
        taskWithCachedResult.cachedResult,
        outputs
      ))
    );
  }

  private copy(src: string, directory: string) {
    if (this.useFsExtraToCopyAndRemove) {
      return copy(src, directory);
    }

    return new Promise((res, rej) => {
      exec(`cp -a "${src}" "${directory}"`, (error) => {
        if (!error) {
          res(null);
        } else {
          this.useFsExtraToCopyAndRemove = true;
          copy(src, directory).then(res, rej);
        }
      });
    });
  }

  private remove(folder: string) {
    if (this.useFsExtraToCopyAndRemove) {
      return remove(folder);
    }

    return new Promise((res, rej) => {
      exec(`rm -rf "${folder}"`, (error) => {
        if (!error) {
          res(null);
        } else {
          this.useFsExtraToCopyAndRemove = true;
          remove(folder).then(res, rej);
        }
      });
    });
  }

  private async recordOutputsHash(
    outputs: string[],
    hash: string
  ): Promise<void> {
    for (const output of outputs) {
      const hashFile = this.getFileNameWithLatestRecordedHashForOutput(output);
      try {
        await ensureDir(dirname(hashFile));
        await writeFile(hashFile, hash);
      } catch {}
    }
  }

  private async areLatestOutputsHashesDifferentThanTaskHash(
    outputs: string[],
    hash: string
  ) {
    for (let output of outputs) {
      if ((await this.getLatestRecordedHashForTask(output)) !== hash)
        return true;
    }
    return false;
  }

  private async getLatestRecordedHashForTask(
    output: string
  ): Promise<string | null> {
    try {
      return (
        await readFileAsync(
          this.getFileNameWithLatestRecordedHashForOutput(output)
        )
      ).toString();
    } catch (e) {
      return null;
    }
  }

  private async isAnyOutputMissing(
    cachedResult: CachedResult,
    outputs: string[]
  ): Promise<boolean> {
    for (let output of outputs) {
      const cacheOutputPath = join(cachedResult.outputsPath, output);
      const rootOutputPath = join(this.root, output);

      if (
        (await existsAsync(cacheOutputPath)) &&
        (await lstatAsync(cacheOutputPath)).isFile()
      ) {
        return (
          (await existsAsync(join(cachedResult.outputsPath, output))) &&
          !(await existsAsync(join(this.root, output)))
        );
      }

      const haveDifferentAmountOfFiles =
        (await existsAsync(cacheOutputPath)) &&
        (await existsAsync(rootOutputPath)) &&
        (await readdirAsync(cacheOutputPath)).length !==
          (await readdirAsync(rootOutputPath)).length;

      if (
        ((await existsAsync(cacheOutputPath)) &&
          !(await existsAsync(rootOutputPath))) ||
        haveDifferentAmountOfFiles
      ) {
        return true;
      }
    }
    return false;
  }

  private getFileNameWithLatestRecordedHashForOutput(output: string): string {
    return join(
      this.latestOutputsHashesDir,
      `${output.split(sep).join('-')}.hash`
    );
  }

  private async getFromLocalDir(task: Task) {
    const tdCommit = join(this.cachePath, `${task.hash}.commit`);
    const td = join(this.cachePath, task.hash);

    if (await existsAsync(tdCommit)) {
      const terminalOutput = await readFile(
        join(td, 'terminalOutput'),
        'utf-8'
      );
      let code = 0;
      try {
        code = Number(await readFile(join(td, 'code'), 'utf-8'));
      } catch (e) {}
      return {
        terminalOutput,
        outputsPath: join(td, 'outputs'),
        code,
      };
    } else {
      return null;
    }
  }

  private createCacheDir() {
    ensureDirSync(cacheDir);
    return cacheDir;
  }

  private createTerminalOutputsDir() {
    const path = join(this.cachePath, 'terminalOutputs');
    ensureDirSync(path);
    return path;
  }

  private ensureLatestOutputsHashesDir() {
    const path = join(this.cachePath, 'latestOutputsHashes');
    ensureDirSync(path);
    return path;
  }

  private tryAndRetry<T>(fn: () => Promise<T>): Promise<T> {
    let attempts = 0;
    const baseTimeout = 100;
    const _try = async () => {
      try {
        attempts++;
        return await fn();
      } catch (e) {
        if (attempts === 10) {
          // After enough attempts, throw the error
          throw e;
        }
        await new Promise((res) => setTimeout(res, baseTimeout * attempts));
        return await _try();
      }
    };
    return _try();
  }
}

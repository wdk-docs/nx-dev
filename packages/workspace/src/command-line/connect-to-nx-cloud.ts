import { readNxJson } from '../core/file-utils';
import { output } from '../utilities/output';
import { getPackageManagerCommand } from '@nrwl/devkit';
import { execSync } from 'child_process';

export async function connectToNxCloudUsingScan(scan: boolean): Promise<void> {
  if (!scan) return;

  const nxJson = readNxJson();
  const defaultRunnerIsUsed = Object.values(nxJson.tasksRunnerOptions).find(
    (r) => r.runner == '@nrwl/workspace/tasks-runners/default'
  );
  if (!defaultRunnerIsUsed) return;

  output.log({
    title: '--scan requires the workspace to be connected to Nx Cloud.',
  });
  const res = await connectToNxCloudPrompt();
  if (res) {
    const pmc = getPackageManagerCommand();
    execSync(`${pmc.addDev} @nrwl/nx-cloud@latest`);
    execSync(`${pmc.exec} nx g @nrwl/nx-cloud:init`, {
      stdio: [0, 1, 2],
    });
  } else {
    output.log({ title: 'Executing the command without --scan' });
  }
}

export async function connectToNxCloudCommand(): Promise<void> {
  const nxJson = readNxJson();
  const nxCloudUsed = Object.values(nxJson.tasksRunnerOptions).find(
    (r) => r.runner == '@nrwl/nx-cloud'
  );
  if (nxCloudUsed) {
    output.log({
      title: 'This workspace is already connected to Nx Cloud.',
    });
    return;
  }

  const res = await connectToNxCloudPrompt();
  if (!res) return;
  const pmc = getPackageManagerCommand();
  execSync(`${pmc.addDev} @nrwl/nx-cloud@latest`);
  execSync(`${pmc.exec} nx g @nrwl/nx-cloud:init`, {
    stdio: [0, 1, 2],
  });
}

async function connectToNxCloudPrompt() {
  return await (
    await import('enquirer')
  )
    .prompt([
      {
        name: 'NxCloud',
        message: `Connect to Nx Cloud? (It's free and doesn't require registration.)`,
        type: 'select',
        choices: [
          {
            name: 'Yes',
            hint: 'Faster builds, run details, GitHub integration. Learn more at https://nx.app',
          },
          {
            name: 'No',
          },
        ],
        initial: 'No' as any,
      },
    ])
    .then((a: { NxCloud: 'Yes' | 'No' }) => a.NxCloud === 'Yes');
}

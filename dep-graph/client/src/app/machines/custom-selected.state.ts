import { assign } from '@xstate/immer';
import { send, actions } from 'xstate';
import { DepGraphStateNodeConfig } from './interfaces';

export const customSelectedStateConfig: DepGraphStateNodeConfig = {
  entry: actions.choose([
    {
      cond: 'selectActionCannotBePersistedToRoute',
      actions: ['notifyRouteClearSelect'],
    },
  ]),
  on: {
    updateGraph: {
      target: 'customSelected',
      actions: [
        assign((ctx, event) => {
          const existingProjectNames = ctx.projects.map(
            (project) => project.name
          );
          const newProjectNames = event.projects.map((project) => project.name);
          const newSelectedProjects = newProjectNames.filter(
            (projectName) => !existingProjectNames.includes(projectName)
          );
          ctx.selectedProjects = [
            ...ctx.selectedProjects,
            ...newSelectedProjects,
          ];
        }),
        'setGraph',
        send(
          (ctx, event) => ({
            type: 'notifyGraphUpdateGraph',
            projects: ctx.projects,
            dependencies: ctx.dependencies,
            affectedProjects: ctx.affectedProjects,
            workspaceLayout: ctx.workspaceLayout,
            groupByFolder: ctx.groupByFolder,
            selectedProjects: ctx.selectedProjects,
          }),
          {
            to: (context) => context.graphActor,
          }
        ),
      ],
    },
  },
};

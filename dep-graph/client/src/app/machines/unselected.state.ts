import { assign } from '@xstate/immer';
import { send, spawn } from 'xstate';
import { routeListener } from './route-listener.actor';
import { DepGraphStateNodeConfig } from './interfaces';

export const unselectedStateConfig: DepGraphStateNodeConfig = {
  entry: [
    'notifyGraphHideAllProjects',
    assign((ctx, event) => {
      if (ctx.routeListenerActor === null) {
        ctx.routeListenerActor = spawn(routeListener, 'routeListener');
      }
    }),
    'notifyRouteClearSelect',
  ],
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

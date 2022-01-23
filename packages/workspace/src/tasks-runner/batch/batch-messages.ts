import type { TaskGraph } from '@nrwl/devkit';

export enum BatchMessageType {
  Tasks,
  Complete,
}

export interface BatchTasksMessage {
  type: BatchMessageType.Tasks;
  executorName: string;
  taskGraph: TaskGraph;
}
/**
 * Results of running the batch. Mapped from task id to results
 */
export interface BatchResults {
  [taskId: string]: { success: boolean; terminalOutput?: string };
}
export interface BatchCompleteMessage {
  type: BatchMessageType.Complete;
  results: BatchResults;
}

export type BatchMessage = BatchTasksMessage | BatchCompleteMessage;

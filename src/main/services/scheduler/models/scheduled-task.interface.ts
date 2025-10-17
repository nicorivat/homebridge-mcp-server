export interface ScheduledTask {
  date: Date;
  task: () => Promise<unknown>;
}

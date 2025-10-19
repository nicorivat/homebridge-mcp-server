import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);
dayjs.extend(customParseFormat);

import { ScheduledTask } from './models';

@Injectable()
export class SchedulerService {
  private scheduledTasks: ScheduledTask[] = [];

  @Cron('*/1 * * * * *')
  protected async handleScheduledTask(): Promise<void> {
    const now = dayjs();

    const tasksToPerform: typeof this.scheduledTasks = [];
    const remainingTasks: typeof this.scheduledTasks = [];

    for (const task of this.scheduledTasks) {
      if (dayjs(task.date).isBefore(now)) {
        tasksToPerform.push(task);
      } else {
        remainingTasks.push(task);
      }
    }

    this.scheduledTasks = remainingTasks;

    if (tasksToPerform.length > 0) {
      tasksToPerform.forEach((task) => task.task());
    }
  }

  private parseWhen(when: string): Date | null {
    if (!when) return null;

    const now = dayjs();

    const iso = dayjs(when);
    if (iso.isValid() && when.match(/^\d{4}-\d{2}-\d{2}/)) {
      return iso.toDate();
    }

    const match = when.match(
      /in\s+(\d+)\s*(second|minute|hour|day|week|month|year)s?/i,
    );
    if (match) {
      const value = parseInt(match[1], 10);
      const unit = match[2].toLowerCase() as dayjs.ManipulateType;
      return now.add(value, unit).toDate();
    }

    if (/tomorrow/i.test(when)) return now.add(1, 'day').toDate();
    if (/today/i.test(when)) return now.toDate();
    if (/next week/i.test(when)) return now.add(1, 'week').toDate();

    console.warn(`Unrecognized date format: "${when}"`);
    return null;
  }

  scheduleTask(date: string, task: () => Promise<unknown>): string {
    const parsedDate = this.parseWhen(date);
    if (parsedDate) {
      this.scheduledTasks.push({ date: parsedDate, task });
      return 'Task successfully scheduled';
    }
    return 'An error occured during the task scheduling';
  }
}

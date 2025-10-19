import { Injectable } from '@nestjs/common';
import { Tool } from '@rekog/mcp-nest';
import z from 'zod';
import {
  GetAllCurtainsUseCase,
  UpdateCurtainUseCase,
} from '../../../business/use-cases';
import { curtainAttributesSchema, CurtainDTO } from '../../dto';
import { SchedulerService } from '../../services';

@Injectable()
export class CurtainsTools {
  constructor(
    private readonly getAllCurtainsUseCase: GetAllCurtainsUseCase,
    private readonly updateCurtainUseCase: UpdateCurtainUseCase,
    private readonly schedulerService: SchedulerService,
  ) {}

  @Tool({
    name: 'get_all_curtains',
    description: 'Get all curtains informations',
  })
  async getAllCurtains() {
    const curtains = await this.getAllCurtainsUseCase.execute();
    return curtains.map((curtain) => ({
      ...curtain,
      capabilities: {
        changeTargetPosition: true,
      },
    }));
  }

  @Tool({
    name: 'update_curtains',
    description: 'Update curtains attributes',
    parameters: curtainAttributesSchema.omit({ currentPosition: true }).extend({
      curtainIds: z.string().array().describe('The IDs of the curtains'),
    }),
  })
  async updateCurtains({
    curtainIds,
    targetPosition,
  }: {
    curtainIds: string[];
    targetPosition: number;
  }): Promise<CurtainDTO[]> {
    return (
      await Promise.all(
        curtainIds.map((curtainId) =>
          this.updateCurtainUseCase.execute(curtainId, { targetPosition }),
        ),
      )
    ).filter((curtain) => !!curtain);
  }

  @Tool({
    name: 'schedule_update_curtains',
    description: 'Schedule updates curtains attributes',
    parameters: curtainAttributesSchema
      .omit({ currentPosition: true })
      .extend({
        curtainIds: z.string().array().describe('The IDs of the curtains'),
      })
      .merge(
        z.object({
          when: z
            .string()
            .describe(
              "Either an ISO 8601 date/time or a relative expression such as 'in 5 minutes', 'in 2 hours', or 'tomorrow at 9am'.",
            ),
        }),
      ),
  })
  scheduleUpdateCurtains({
    curtainIds,
    targetPosition,
    when,
  }: {
    curtainIds: string[];
    targetPosition: number;
    when: string;
  }): string {
    return this.schedulerService.scheduleTask(when, () =>
      this.updateCurtains({ curtainIds, targetPosition }),
    );
  }
}
